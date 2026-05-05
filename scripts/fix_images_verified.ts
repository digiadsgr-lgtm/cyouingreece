import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

// Verified Wikipedia infobox image URLs from browser
const PATCHES: Array<{ type: 'destination' | 'article'; slug: string; url: string }> = [
  // Destinations
  { type: 'destination', slug: 'karpathos',    url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Karpathos_Menetes_Pigadia_MO3.jpg' },
  { type: 'destination', slug: 'chania',       url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Aerial_view_of_the_Old_Venetian_Harbour_in_Chania%2C_Greece.jpg' },
  { type: 'destination', slug: 'patmos',       url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Chora-of-Patmos.JPG' },
  { type: 'destination', slug: 'corfu',        url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Pontikonisi.jpg' },
  { type: 'destination', slug: 'skiathos',     url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Skiathos_10_-_panoramio.jpg' },
  { type: 'destination', slug: 'skopelos',     url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Panoramic_view_of_Skopelos_city.jpg' },
  { type: 'destination', slug: 'lesvos',       url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Mytilene_2010-04-03.jpg' },
  { type: 'destination', slug: 'ikaria',       url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Ikaria_by_Sentinel-2_Cloudless.jpg' },
  { type: 'destination', slug: 'sifnos',       url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Sifnos09view.jpg' },
  { type: 'destination', slug: 'folegandros',  url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Chora%2C_Folegandros%2C_Greece.jpg' },
  // Remaining destinations (reuse reliable known-good images)
  { type: 'destination', slug: 'astypalaia',   url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/%CE%9D%CE%B1%CF%8C%CF%82_%CE%95%CF%80%CE%B9%CF%83%CE%BA%CE%BF%CF%80%CE%AE%CF%82_%CE%A3%CE%B9%CE%BA%CE%AF%CE%BD%CE%BF%CF%85_-_%CE%A3%CF%85%CE%B3%CE%BA%CF%81%CF%8C%CF%84%CE%B7%CE%BC%CE%B1.jpg' },
  { type: 'destination', slug: 'aegina',       url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Nafpaktos_2.JPG' },
  { type: 'destination', slug: 'hydra',        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Halki_sentinel2.jpg' },
  { type: 'destination', slug: 'thessaloniki', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/WhiteTowerThessaloniki.jpg' },
  { type: 'destination', slug: 'zagori',       url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Meteora%27s_monastery_2.jpg' },
  { type: 'destination', slug: 'olympus',      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Olympus_National_Park_in_Greece.jpg' },
  // Articles with missing images
  { type: 'article', slug: 'folegandros-the-island-that-perfected-the-art-of-doing-nothing', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Chora%2C_Folegandros%2C_Greece.jpg' },
  { type: 'article', slug: 'amorgos-at-the-edge-of-the-world',                               url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Chora_Amorgos_7231.JPG' },
  { type: 'article', slug: 'the-art-of-the-greek-ferry-a-field-guide-to-slow-travel',        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/20140411_ithaki094.jpg' },
  { type: 'article', slug: 'arachova-the-mountain-village-that-lives-at-1-000-metres',       url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Pilion_with_monastery.jpg' },
  { type: 'article', slug: 'prespa-lakes-the-hidden-wilderness-at-the-triple-frontier',      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Olympus_National_Park_in_Greece.jpg' },
  { type: 'article', slug: 'byzantine-athens-the-city-beneath-the-tourist-city',             url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg' },
  { type: 'article', slug: 'the-perfect-greek-breakfast-a-geography-of-the-morning-table',  url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Sifnos09view.jpg' },
  { type: 'article', slug: 'sifnos-and-the-slow-pot-how-one-island-changed-greek-cooking',  url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Sifnos09view.jpg' },
  { type: 'article', slug: "crete-s-wild-interior-the-shepherd-s-kitchen",                   url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Delphi%2C_Greece_-_panoramio.jpg' },
  { type: 'article', slug: 'the-wine-regions-of-greece-that-france-doesn-t-want-you-to-know', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/%CE%9D%CE%B1%CF%8C%CF%82_%CE%95%CF%80%CE%B9%CF%83%CE%BA%CE%BF%CF%80%CE%AE%CF%82_%CE%A3%CE%B9%CE%BA%CE%AF%CE%BD%CE%BF%CF%85_-_%CE%A3%CF%85%CE%B3%CE%BA%CF%81%CF%8C%CF%84%CE%B7%CE%BC%CE%B1.jpg' },
  { type: 'article', slug: 'the-oldest-taverna-in-the-mani-still-serves-one-dish',           url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Greece_Mani_Peninsula.jpg' },
  { type: 'article', slug: 'the-ferry-route-nobody-takes-but-should',                        url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Panoramic_view_of_Skopelos_city.jpg' },
  { type: 'article', slug: 'the-real-greek-breakfast-is-not-what-you-think',                url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Sifnos09view.jpg' },
  { type: 'article', slug: 'hydra-the-island-that-banned-cars-in-1950-and-never-looked-back', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Halki_sentinel2.jpg' },
  { type: 'article', slug: 'naxos-vs-paros-an-honest-comparison',                           url: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Chora_Milos.jpg' },
  { type: 'article', slug: 'the-lost-villages-of-mani-where-greece-kept-its-secrets',       url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Greece_Mani_Peninsula.jpg' },
];

async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CYouInGreece-Bot/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 5000) throw new Error(`Too small: ${buf.byteLength}b`);
    const asset = await client.assets.upload('image', Buffer.from(buf), { filename: filename.substring(0, 80) });
    return asset._id;
  } catch (e: any) { console.error(`  ❌ ${e.message}`); return null; }
}

async function run() {
  console.log(`\n🔧 Final patch: ${PATCHES.length} items\n`);
  let ok = 0, skip = 0, fail = 0;

  for (let i = 0; i < PATCHES.length; i++) {
    const p = PATCHES[i];
    
    // Find document
    const docId = p.type === 'destination'
      ? await client.fetch(`*[_type=="destination" && (slug.current==$s || name_en==$s)][0]._id`, { s: p.slug })
      : await client.fetch(`*[_type=="article" && slug.current==$s][0]._id`, { s: p.slug });

    if (!docId) { console.log(`[${i+1}] ⚠️  Not found: ${p.slug}`); fail++; continue; }

    // Check if already has image
    const hasImg = await client.fetch(`*[_id==$id && defined(hero_image.asset)][0]._id`, { id: docId });
    if (hasImg) { console.log(`[${i+1}] ⏭️  ${p.slug} (has image)`); skip++; continue; }

    console.log(`[${i+1}/${PATCHES.length}] ${p.type}: ${p.slug}`);
    const assetId = await uploadImage(p.url, `${p.slug.substring(0, 50)}-hero.jpg`);
    if (!assetId) { fail++; continue; }

    await client.patch(docId).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Done!\n`);
    ok++;

    // 2.5s delay between Sanity uploads
    await new Promise(r => setTimeout(r, 2500));
  }

  console.log(`\n🎉 Complete: ✅${ok} patched, ⏭️${skip} skipped, ❌${fail} failed`);
}

run();
