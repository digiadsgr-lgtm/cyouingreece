import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

async function getCommonsImage(searchQuery: string): Promise<string | null> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery + ' landscape')}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.query && data.query.pages) {
      for (const key of Object.keys(data.query.pages)) {
        const urlStr = data.query.pages[key].imageinfo?.[0]?.url;
        if (urlStr && !urlStr.endsWith('.svg') && !urlStr.endsWith('.pdf')) {
          return urlStr;
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en, hero_image}`);
  let missing = destinations.filter((d: any) => !d.hero_image?.asset);
  
  for (const dest of missing) {
    console.log(`Searching Commons for ${dest.name_en}...`);
    let imgUrl = await getCommonsImage(dest.name_en);
    if (!imgUrl) imgUrl = await getCommonsImage(dest.name_en.replace(' ', ''));
    if (!imgUrl) imgUrl = await getCommonsImage(`${dest.name_en} Greece beach`);

    if (imgUrl) {
      console.log(`Downloading ${imgUrl}`);
      try {
        const imgRes = await fetch(imgUrl);
        const buffer = await imgRes.arrayBuffer();
        const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
          filename: `${dest.name_en.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_hero.jpg`
        });
        await sanityClient.patch(dest._id)
          .set({
            hero_image: {
              _type: 'image',
              asset: { _type: 'reference', _ref: asset._id }
            }
          })
          .commit();
        console.log(`✅ Fixed ${dest.name_en}`);
      } catch (e: any) {
        console.error(`❌ Failed ${dest.name_en}: ${e.message}`);
      }
    } else {
      console.log(`❌ Could not find ANY image for ${dest.name_en}`);
    }
  }
}

run();
