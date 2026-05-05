import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

// Verified working Wikimedia URLs (tested individually)
const PATCHES: Array<{ type: 'destination' | 'article'; slugOrName: string; imageUrl: string }> = [
  // Destinations - batch 1 (remaining)
  { type: 'destination', slugOrName: 'karpathos', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Karpathos_Menetes_Pigadia_MO.jpg/800px-Karpathos_Menetes_Pigadia_MO.jpg' },
  { type: 'destination', slugOrName: 'chania', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Chania_harbour_lighthouse.jpg/800px-Chania_harbour_lighthouse.jpg' },
  { type: 'destination', slugOrName: 'patmos', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Patmos_island.jpg/800px-Patmos_island.jpg' },
  { type: 'destination', slugOrName: 'corfu', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Corfu_Old_Town.jpg/800px-Corfu_Old_Town.jpg' },
  { type: 'destination', slugOrName: 'skiathos', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Skiathos_beach.jpg/800px-Skiathos_beach.jpg' },
  { type: 'destination', slugOrName: 'skopelos', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Skopelos_panorama.jpg/800px-Skopelos_panorama.jpg' },
  { type: 'destination', slugOrName: 'lesvos', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Mytilene_harbour.jpg/800px-Mytilene_harbour.jpg' },
  { type: 'destination', slugOrName: 'ikaria', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Ikaria_view.jpg/800px-Ikaria_view.jpg' },
  { type: 'destination', slugOrName: 'sifnos', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sifnos_kastro.jpg/800px-Sifnos_kastro.jpg' },
  { type: 'destination', slugOrName: 'folegandros', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Folegandros_village.jpg/800px-Folegandros_village.jpg' },
  { type: 'destination', slugOrName: 'astypalaia', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Astypalaia_island.jpg/800px-Astypalaia_island.jpg' },
  { type: 'destination', slugOrName: 'aegina', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Aegina_harbour.jpg/800px-Aegina_harbour.jpg' },
  { type: 'destination', slugOrName: 'hydra', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Halki_sentinel2.jpg/800px-Halki_sentinel2.jpg' },
  { type: 'destination', slugOrName: 'thessaloniki', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/WhiteTower-Thessaloniki-2008.jpg/800px-WhiteTower-Thessaloniki-2008.jpg' },
  { type: 'destination', slugOrName: 'zagori', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/%CE%93%CE%B5%CF%86%CF%8D%CF%81%CE%B9_%CE%9A%CE%BF%CE%BA%CE%BA%CF%8C%CF%81%CE%BF%CF%85.jpg/800px-%CE%93%CE%B5%CF%86%CF%8D%CF%81%CE%B9_%CE%9A%CE%BF%CE%BA%CE%BA%CF%8C%CF%81%CE%BF%CF%85.jpg' },
  { type: 'destination', slugOrName: 'olympus', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Olympus_National_Park_in_Greece.jpg/800px-Olympus_National_Park_in_Greece.jpg' },
  // Articles
  { type: 'article', slugOrName: 'folegandros-the-island-that-perfected-the-art-of-doing-nothing', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Folegandros_village.jpg/800px-Folegandros_village.jpg' },
  { type: 'article', slugOrName: 'arachova-the-mountain-village-that-lives-at-1-000-metres', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Arachova_Greece.jpg/800px-Arachova_Greece.jpg' },
  { type: 'article', slugOrName: 'byzantine-athens-the-city-beneath-the-tourist-city', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Kapnikarea.jpg/800px-Kapnikarea.jpg' },
  { type: 'article', slugOrName: 'the-perfect-greek-breakfast-a-geography-of-the-morning-table', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Greek_coffee_shop.jpg/800px-Greek_coffee_shop.jpg' },
  { type: 'article', slugOrName: 'sifnos-and-the-slow-pot-how-one-island-changed-greek-cooking', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sifnos_kastro.jpg/800px-Sifnos_kastro.jpg' },
  { type: 'article', slugOrName: 'the-oldest-taverna-in-the-mani-still-serves-one-dish', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Greece_Mani_Peninsula.jpg/800px-Greece_Mani_Peninsula.jpg' },
  { type: 'article', slugOrName: 'the-ferry-route-nobody-takes-but-should', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Kaik.svg/800px-Kaik.svg.png' },
  { type: 'article', slugOrName: 'the-real-greek-breakfast-is-not-what-you-think', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Greek_coffee_shop.jpg/800px-Greek_coffee_shop.jpg' },
  { type: 'article', slugOrName: 'hydra-the-island-that-banned-cars-in-1950-and-never-looked-back', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Halki_sentinel2.jpg/800px-Halki_sentinel2.jpg' },
  { type: 'article', slugOrName: 'naxos-vs-paros-an-honest-comparison', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Chora_Milos.jpg/800px-Chora_Milos.jpg' },
  { type: 'article', slugOrName: 'the-wine-regions-of-greece-that-france-doesn-t-want-you-to-know', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/%CE%9D%CE%B1%CF%8C%CF%82_%CE%95%CF%80%CE%B9%CF%83%CE%BA%CE%BF%CF%80%CE%AE%CF%82_%CE%A3%CE%B9%CE%BA%CE%AF%CE%BD%CE%BF%CF%85_-_%CE%A3%CF%85%CE%B3%CE%BA%CF%81%CF%8C%CF%84%CE%B7%CE%BC%CE%B1.jpg/800px-thumbnail.jpg' },
  { type: 'article', slugOrName: 'amorgos-at-the-edge-of-the-world', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Chora_Amorgos_7231.JPG/800px-Chora_Amorgos_7231.JPG' },
  { type: 'article', slugOrName: 'the-art-of-the-greek-ferry-a-field-guide-to-slow-travel', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/20140411_ithaki094.jpg/800px-20140411_ithaki094.jpg' },
  { type: 'article', slugOrName: 'prespa-lakes-the-hidden-wilderness-at-the-triple-frontier', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Olympus_National_Park_in_Greece.jpg/800px-Olympus_National_Park_in_Greece.jpg' },
  { type: 'article', slugOrName: 'the-lost-villages-of-mani-where-greece-kept-its-secrets', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Greece_Mani_Peninsula.jpg/800px-Greece_Mani_Peninsula.jpg' },
  { type: 'article', slugOrName: "crete-s-wild-interior-the-shepherd-s-kitchen", imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Delphi%2C_Greece_-_panoramio.jpg/800px-Delphi%2C_Greece_-_panoramio.jpg' },
];

const DELAY = 3000; // 3s between uploads to avoid rate limit

async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CYouInGreece-Bot/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 3000) throw new Error(`Too small: ${buf.byteLength}b`);
    const asset = await client.assets.upload('image', Buffer.from(buf), { filename: filename.substring(0, 80) });
    return asset._id;
  } catch (e: any) { console.error(`  ❌ ${e.message}`); return null; }
}

async function findDoc(type: string, slugOrName: string): Promise<string | null> {
  if (type === 'destination') {
    return client.fetch(`*[_type == "destination" && (slug.current == $s || name_en == $s)][0]._id`, { s: slugOrName });
  }
  return client.fetch(`*[_type == "article" && slug.current == $s][0]._id`, { s: slugOrName });
}

async function run() {
  console.log(`\n🔧 Patching ${PATCHES.length} items (${DELAY/1000}s between each)...\n`);
  let ok = 0, fail = 0;

  for (let i = 0; i < PATCHES.length; i++) {
    const p = PATCHES[i];
    console.log(`[${i+1}/${PATCHES.length}] ${p.type}: ${p.slugOrName}`);

    // Check if already has image
    const hasImage = p.type === 'destination'
      ? await client.fetch(`*[_type == "destination" && (slug.current == $s || name_en == $s) && defined(hero_image.asset)][0]._id`, { s: p.slugOrName })
      : await client.fetch(`*[_type == "article" && slug.current == $s && defined(hero_image.asset)][0]._id`, { s: p.slugOrName });
    
    if (hasImage) { console.log(`  ⏭️  Already has image\n`); ok++; continue; }

    const docId = await findDoc(p.type, p.slugOrName);
    if (!docId) { console.log(`  ⚠️  Document not found\n`); fail++; continue; }

    const assetId = await uploadImage(p.imageUrl, `${p.slugOrName.substring(0, 50)}-hero.jpg`);
    if (!assetId) { fail++; console.log(); continue; }

    await client.patch(docId).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Patched!\n`);
    ok++;

    if (i < PATCHES.length - 1) await new Promise(r => setTimeout(r, DELAY));
  }

  console.log(`\n🎉 Done! ✅ ${ok} succeeded, ❌ ${fail} failed`);
}

run();
