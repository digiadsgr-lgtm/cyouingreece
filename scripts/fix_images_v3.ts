import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

// Curated DIRECT Wikimedia Commons image URLs — no API calls needed
// These are permanent URLs that won't rate limit
const DEST_IMAGES: Record<string, string> = {
  'Serifos':      'https://upload.wikimedia.org/wikipedia/commons/5/55/Serifos_airview.jpg',
  'Amorgos':      'https://upload.wikimedia.org/wikipedia/commons/e/e9/Chora_Amorgos_7231.JPG',
  'Karpathos':    'https://upload.wikimedia.org/wikipedia/commons/8/87/Karpathos_Menetes_Pigadia_MO.jpg',
  'Kythira':      'https://upload.wikimedia.org/wikipedia/commons/b/b6/Cythera_Capital_and_the_Castle.jpg',
  'Spetses':      'https://upload.wikimedia.org/wikipedia/commons/9/90/20090730_spetsai033.jpg',
  'Delphi':       'https://upload.wikimedia.org/wikipedia/commons/d/d5/Delphi%2C_Greece_-_panoramio.jpg',
  'Meteora':      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Meteora%27s_monastery_2.jpg',
  'Chania':       'https://upload.wikimedia.org/wikipedia/commons/2/22/Chania_port.JPG',
  'Patmos':       'https://upload.wikimedia.org/wikipedia/commons/2/2a/Patmos_island_chora_panoramic.jpg',
  'Corfu':        'https://upload.wikimedia.org/wikipedia/commons/a/a3/Corfu_town_from_old_fortress.jpg',
  'Skiathos':     'https://upload.wikimedia.org/wikipedia/commons/4/4a/Skiathos_chora_2.jpg',
  'Skopelos':     'https://upload.wikimedia.org/wikipedia/commons/9/91/Panoramic_view_of_Glossa%2C_Skopelos.jpg',
  'Lesvos':       'https://upload.wikimedia.org/wikipedia/commons/7/75/MytileneHarbour.jpg',
  'Ikaria':       'https://upload.wikimedia.org/wikipedia/commons/a/a3/Raches_Ikaria.jpg',
  'Sifnos':       'https://upload.wikimedia.org/wikipedia/commons/7/78/Kastro_sifnos.jpg',
  'Folegandros':  'https://upload.wikimedia.org/wikipedia/commons/7/73/Folegandros_chora.jpg',
  'Astypalaia':   'https://upload.wikimedia.org/wikipedia/commons/b/b2/Astypalaia_main_village.jpg',
  'Aegina':       'https://upload.wikimedia.org/wikipedia/commons/4/44/Aegina_island_panorama.jpg',
  'Hydra':        'https://upload.wikimedia.org/wikipedia/commons/7/77/Hydra_port.jpg',
  'Thessaloniki': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/WhiteTowerThessaloniki.jpg',
  'Zagori':       'https://upload.wikimedia.org/wikipedia/commons/4/46/Epirus_antiquus_tabula.jpg',
  'Olympus':      'https://upload.wikimedia.org/wikipedia/commons/e/e8/Olympus_National_Park_in_Greece.jpg',
};

// Curated article image URLs
const ART_IMAGES: Record<string, string> = {
  'folegandros-the-island-that-perfected-the-art-of-doing-nothing': 'https://upload.wikimedia.org/wikipedia/commons/7/73/Folegandros_chora.jpg',
  'amorgos-at-the-edge-of-the-world': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Chora_Amorgos_7231.JPG',
  'the-art-of-the-greek-ferry-a-field-guide-to-slow-travel': 'https://upload.wikimedia.org/wikipedia/commons/0/09/Piraeus_port.jpg',
  'arachova-the-mountain-village-that-lives-at-1-000-metres': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/ArachovaVillage.jpg',
  'prespa-lakes-the-hidden-wilderness-at-the-triple-frontier': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Mikri_Prespa_lake.jpg',
  'the-acropolis-at-6am-how-to-see-the-most-famous-site-in-the-world-correctly': 'https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg',
  'byzantine-athens-the-city-beneath-the-tourist-city': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Kapnikarea_01.jpg',
  'the-lost-villages-of-mani-where-greece-kept-its-secrets': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Greece_Mani_Peninsula.jpg',
  'the-perfect-greek-breakfast-a-geography-of-the-morning-table': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Bougatsa_Thessaloniki.jpg',
  'sifnos-and-the-slow-pot-how-one-island-changed-greek-cooking': 'https://upload.wikimedia.org/wikipedia/commons/7/78/Kastro_sifnos.jpg',
  "crete-s-wild-interior-the-shepherd-s-kitchen": 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Sfakia_village.jpg',
  'the-wine-regions-of-greece-that-france-doesn-t-want-you-to-know': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Santorini_vineyard.jpg',
  'the-oldest-taverna-in-the-mani-still-serves-one-dish': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Greece_Mani_Peninsula.jpg',
  'the-ferry-route-nobody-takes-but-should': 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Ferry_Igoumenitsa_Greece.jpg',
  'the-real-greek-breakfast-is-not-what-you-think': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Bougatsa_Thessaloniki.jpg',
  'hydra-the-island-that-banned-cars-in-1950-and-never-looked-back': 'https://upload.wikimedia.org/wikipedia/commons/7/77/Hydra_port.jpg',
  'naxos-vs-paros-an-honest-comparison': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Portara_Naxos_2.jpg',
};

async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url, { 
      headers: { 
        'User-Agent': 'CYouInGreece-Bot/1.0 (https://cyouingreece.vercel.app; educational travel guide)',
        'Accept': 'image/*'
      } 
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 5000) throw new Error(`Image too small (${buf.byteLength} bytes), likely a placeholder`);
    const asset = await client.assets.upload('image', Buffer.from(buf), { filename: filename.substring(0, 80) });
    return asset._id;
  } catch (e: any) { 
    console.error(`  ❌ ${e.message}`); 
    return null; 
  }
}

async function run() {
  // 1. Fix remaining destinations with no image
  const missingDests = await client.fetch(`*[_type == "destination" && !defined(hero_image.asset)]{_id, name_en, slug}`);
  console.log(`\n🏝️  Fixing ${missingDests.length} destination images...\n`);

  for (const dest of missingDests) {
    const imageUrl = DEST_IMAGES[dest.name_en];
    if (!imageUrl) { console.log(`  ⏭️  No URL mapped for: ${dest.name_en}`); continue; }

    console.log(`📍 ${dest.name_en}`);
    console.log(`  📸 ${imageUrl.substring(0, 80)}...`);
    const assetId = await uploadImage(imageUrl, `${(dest.slug?.current || dest.name_en).replace(/[^a-z0-9]/gi,'_')}-hero.jpg`);
    if (!assetId) { console.log(); continue; }

    await client.patch(dest._id).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Patched!\n`);
    await new Promise(r => setTimeout(r, 1500));
  }

  // 2. Fix articles with missing images
  const missingArts = await client.fetch(`*[_type == "article" && !defined(hero_image.asset)]{_id, title, slug}`);
  console.log(`\n📰 Fixing ${missingArts.length} article images...\n`);

  for (const art of missingArts) {
    const slug = art.slug?.current ?? '';
    const imageUrl = ART_IMAGES[slug];
    if (!imageUrl) { console.log(`  ⏭️  No URL mapped: "${art.title.substring(0, 50)}..."\n`); continue; }

    console.log(`📝 "${art.title.substring(0, 55)}..."`);
    console.log(`  📸 ${imageUrl.substring(0, 80)}...`);
    const assetId = await uploadImage(imageUrl, `article-${slug.substring(0, 50)}-hero.jpg`);
    if (!assetId) { console.log(); continue; }

    await client.patch(art._id).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Patched!\n`);
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('🎉 Done!');
}

run();
