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

// A list of IDs that are known to be problematic (duplicates, low-res, maps, gifs)
// We will forcefully replace these.
const PROBLEMATIC_ASSET_IDS = [
  'image-de6aa467abf3b11d87960e328b85a61ff25aab5e-200x208-gif', // Mani map
  'image-0b03247803ee387b6abcdeb2f81cda7b14ab69af-1600x1200-jpg', // Olympus/Pelion duplicate
  'image-73d95847c1e44754acbd0e990c39dda3f9b7e55c-1080x720-jpg', // Thessaloniki/Nafplio duplicate
  'image-b58319dc5a6c987c3d5cb34f92e5458e19425113-3648x2295-jpg', // Aegina/Nafpaktos duplicate
  'image-66ba92ef862b9380da15947ee00a6022f8c41f03-600x800-jpg', // Paros low res
  'image-fcfccd596c69658fa804209fc1491b1c197da61b-800x600-jpg', // Sifnos low res
  'image-4d98e32634344b2544410a09ecfb0bf83511bb88-800x524-jpg', // Lemnos low res
];

async function getHighResImageUrl(title: string): Promise<string | null> {
  try {
    // We use Wikimedia Commons API to search for high-res landscape photos, avoiding generic Wikipedia article headers
    const searchQuery = encodeURIComponent(`${title} Greece landscape OR scenic OR beach OR village`);
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchQuery}&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|size|mime&format=json`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    const pages = data.query?.pages;
    
    if (pages) {
      // Convert to array and filter for good images
      const validImages = Object.values(pages)
        .map((p: any) => p.imageinfo?.[0])
        .filter((info: any) => {
          if (!info) return false;
          // Must be JPEG or PNG
          if (info.mime !== 'image/jpeg' && info.mime !== 'image/png') return false;
          // Must be high resolution (at least 1200px wide)
          if (info.width < 1200) return false;
          // Must be landscape orientation
          if (info.height > info.width) return false;
          return true;
        })
        .sort((a: any, b: any) => (b.width * b.height) - (a.width * a.height)); // Sort by largest resolution

      if (validImages.length > 0) {
        return validImages[0].url;
      }
    }
    
    // Fallback search with just the name
    if (searchQuery.includes('landscape')) {
      return await getHighResImageUrl(`${title} Greece`);
    }

    return null;
  } catch (error) {
    console.error(`API error for ${title}:`, error);
    return null;
  }
}

async function runProImageAgent() {
  console.log('=============================================');
  console.log('🌟 PRO IMAGE AGENT INITIALIZED');
  console.log('=============================================\n');
  console.log('Scanning Sanity Database for problematic images (duplicates, low-res, GIFs)...\n');

  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en, hero_image}`);
  
  const toHeal = destinations.filter((d: any) => {
    if (!d.hero_image?.asset) return true; // Missing entirely
    const assetRef = d.hero_image.asset._ref;
    // Check if it's one of the known problematic assets
    if (PROBLEMATIC_ASSET_IDS.includes(assetRef)) return true;
    return false;
  });

  console.log(`📊 SCAN RESULTS: Found ${toHeal.length} destinations needing new High-Res images.\n`);

  if (toHeal.length === 0) {
    console.log('✅ All destinations have valid high-res images.');
    return;
  }

  console.log('🚀 Starting automated replacement process...\n');

  for (const dest of toHeal) {
    console.log(`🔍 Finding 4K/HD image for: ${dest.name_en}`);
    const imageUrl = await getHighResImageUrl(dest.name_en);
    
    if (!imageUrl) {
      console.log(`❌ Could not find a suitable high-res image. Skipping.\n`);
      continue;
    }

    try {
      console.log(`📥 Downloading: ${imageUrl}`);
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buffer = await imgRes.arrayBuffer();
      
      console.log(`⬆️ Uploading to Sanity...`);
      const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
        filename: `${dest.name_en.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pro_hero.jpg`
      });

      console.log(`🔗 Patching database entry...`);
      await sanityClient.patch(dest._id).set({
        hero_image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      }).commit();
        
      console.log(`✅ Successfully replaced image for: ${dest.name_en}\n`);
    } catch (e: any) {
      console.error(`❌ Failed: ${e.message}\n`);
    }
    
    // Sleep to prevent API rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('🎉 PRO IMAGE AGENT HAS COMPLETED THE UPGRADE.');
}

runProImageAgent().catch(console.error);
