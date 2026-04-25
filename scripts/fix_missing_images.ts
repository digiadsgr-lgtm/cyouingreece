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

async function getWikipediaImageUrl(title: string): Promise<string | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId && pageId !== '-1' && pages[pageId].original?.source) {
        let url = pages[pageId].original.source;
        // Wikipedia sometimes returns SVG which Sanity might not like as much for hero images, 
        // but we'll accept it, or we could filter it out. 
        if (url.toLowerCase().endsWith('.svg') || url.toLowerCase().includes('map') || url.toLowerCase().includes('flag') || url.toLowerCase().includes('locator')) {
             return null; // Skip maps and flags
        }
        return url;
      }
    }
    
    // Fallback: search for the generic Greece page image if specific fails? No, the user wants specific images.
    // If exact title fails, try title + " Greece"
    if (!title.includes('Greece')) {
      return await getWikipediaImageUrl(`${title}, Greece`);
    }

    return null;
  } catch (error) {
    console.error(`Wikipedia API error for ${title}:`, error);
    return null;
  }
}

async function run() {
  console.log('Fetching destinations...');
  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en, hero_image}`);
  
  let missing = destinations.filter((d: any) => !d.hero_image?.asset);
  console.log(`Found ${missing.length} destinations missing a hero_image.`);

  for (const dest of missing) {
    console.log(`\n🔍 Finding image for ${dest.name_en}...`);
    
    const imageUrl = await getWikipediaImageUrl(dest.name_en);
    if (!imageUrl) {
      console.log(`❌ Could not find a suitable image on Wikipedia for ${dest.name_en}`);
      continue;
    }

    console.log(`📥 Downloading image: ${imageUrl}`);
    try {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buffer = await imgRes.arrayBuffer();
      
      console.log(`⬆️ Uploading to Sanity...`);
      const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
        filename: `${dest.name_en.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_hero.jpg`
      });

      console.log(`🔗 Patching destination...`);
      await sanityClient.patch(dest._id)
        .set({
          hero_image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id }
          }
        })
        .commit();
        
      console.log(`✅ Successfully added image to ${dest.name_en}`);
    } catch (e: any) {
      console.error(`❌ Failed to process image for ${dest.name_en}: ${e.message}`);
    }
    
    // Sleep to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n🎉 Finished processing images!');
}

run();
