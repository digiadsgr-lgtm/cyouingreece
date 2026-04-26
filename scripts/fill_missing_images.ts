import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Delay utility to avoid rate limits
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchUnsplashImage(destinationName: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('⚠️ No Unsplash Key. Skipping image fetch.');
    return null;
  }
  try {
    // We want beautiful, high-res landscape photos of Greece
    const query = encodeURIComponent(`${destinationName} island greece`);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    
    // Fallback if the specific island search fails
    const fallbackQuery = encodeURIComponent(`${destinationName} greece landscape`);
    const fallback = await fetch(
      `https://api.unsplash.com/search/photos?query=${fallbackQuery}&orientation=landscape&per_page=1`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const fbData = await fallback.json();
    if (fbData.results && fbData.results.length > 0) {
      return fbData.results[0].urls.regular;
    }

    return null;
  } catch (error) {
    console.error(`Unsplash fetch error for ${destinationName}:`, error);
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<any> {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const asset = await sanity.assets.upload('image', Buffer.from(buffer), {
      filename: `${filename}.jpg`,
    });
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
  } catch (err) {
    console.error(`Sanity upload error for ${filename}:`, err);
    return null;
  }
}

async function run() {
  console.log('Fetching destinations missing hero images...');
  const destinations = await sanity.fetch(`*[_type == "destination" && !defined(hero_image.asset)] {
    _id,
    name_en,
    slug
  }`);

  console.log(`Found ${destinations.length} destinations missing hero images.`);

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    console.log(`[${i + 1}/${destinations.length}] Processing ${dest.name_en}...`);

    const imgUrl = await fetchUnsplashImage(dest.name_en);
    
    if (imgUrl) {
      const sanityImage = await uploadImageToSanity(imgUrl, `hero-${dest.slug.current}`);
      if (sanityImage) {
        await sanity.patch(dest._id)
          .set({ hero_image: sanityImage })
          .commit();
        console.log(`✅ Saved hero image for ${dest.name_en}`);
      } else {
        console.log(`❌ Failed to upload image to Sanity for ${dest.name_en}`);
      }
    } else {
      console.log(`⚠️ No image found on Unsplash for ${dest.name_en}`);
    }

    // Delay to respect Unsplash 50 requests/hr limit if we are hitting it, though usually it's higher (50/hr for demo, 5000/hr for production)
    // We will do a small 1s delay
    await delay(1000);
  }

  console.log('\n🎉 Finished filling hero images!');
}

run().catch(console.error);
