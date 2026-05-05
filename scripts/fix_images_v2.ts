import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

// Direct Wikipedia article titles (exact page titles for best image results)
const WIKI_TITLES: Record<string, string> = {
  'Milos': 'Milos',
  'Kos': 'Kos',
  'Zakynthos': 'Zakynthos',
  'Lefkada': 'Lefkada',
  'Samos': 'Samos',
  'Syros': 'Syros',
  'Tinos': 'Tinos',
  'Andros': 'Andros, Greece',
  'Serifos': 'Serifos',
  'Amorgos': 'Amorgos',
  'Karpathos': 'Karpathos',
  'Kythira': 'Kythira',
  'Spetses': 'Spetses',
  'Delphi': 'Delphi',
  'Meteora': 'Meteora',
  'Chania': 'Chania',
  'Patmos': 'Patmos',
  'Corfu': 'Corfu',
  'Skiathos': 'Skiathos',
  'Skopelos': 'Skopelos',
  'Lesvos': 'Lesbos',
  'Ikaria': 'Ikaria',
  'Sifnos': 'Sifnos',
  'Folegandros': 'Folegandros',
  'Astypalaia': 'Astypalaia',
  'Aegina': 'Aegina',
  'Hydra': 'Hydra, Greece',
  'Thessaloniki': 'Thessaloniki',
  'Zagori': 'Zagori',
  'Olympus': 'Mount Olympus',
};

// Article image overrides using direct Wikipedia titles
const ARTICLE_WIKI_TITLES: Record<string, string> = {
  'folegandros-the-island-that-perfected-the-art-of-doing-nothing': 'Folegandros',
  'amorgos-at-the-edge-of-the-world': 'Amorgos',
  'the-art-of-the-greek-ferry-a-field-guide-to-slow-travel': 'Piraeus',
  'arachova-the-mountain-village-that-lives-at-1-000-metres': 'Arachova',
  'prespa-lakes-the-hidden-wilderness-at-the-triple-frontier': 'Prespa Lakes',
  'the-acropolis-at-6am-how-to-see-the-most-famous-site-in-the-world-correctly': 'Parthenon',
  'byzantine-athens-the-city-beneath-the-tourist-city': 'Byzantine Athens',
  'the-lost-villages-of-mani-where-greece-kept-its-secrets': 'Mani, Laconia',
  'the-perfect-greek-breakfast-a-geography-of-the-morning-table': 'Bougatsa',
  'sifnos-and-the-slow-pot-how-one-island-changed-greek-cooking': 'Sifnos',
  "crete-s-wild-interior-the-shepherd-s-kitchen": 'Sfakia',
  'the-wine-regions-of-greece-that-france-doesn-t-want-you-to-know': 'Assyrtiko',
  // Older articles that have broken images
  'the-oldest-taverna-in-the-mani-still-serves-one-dish': 'Mani, Laconia',
  'the-ferry-route-nobody-takes-but-should': 'Aegean Sea',
  'the-real-greek-breakfast-is-not-what-you-think': 'Bougatsa',
  'hydra-the-island-that-banned-cars-in-1950-and-never-looked-back': 'Hydra, Greece',
  'naxos-vs-paros-an-honest-comparison': 'Naxos',
};

async function getImageByTitle(wikiTitle: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(wikiTitle)}`;
    const data = await (await fetch(url, { headers: { 'User-Agent': 'CYouInGreece/1.0 (educational)' } })).json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const src = (Object.values(pages)[0] as any)?.original?.source;
    if (!src) return null;
    const l = src.toLowerCase();
    if (l.endsWith('.svg') || l.includes('map') || l.includes('flag') || l.includes('locator') || l.includes('coat_of') || l.includes('_blank')) return null;
    return src;
  } catch { return null; }
}

async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CYouInGreece/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buf), { filename: filename.substring(0, 80) });
    return asset._id;
  } catch (e: any) { console.error(`  ❌ Upload: ${e.message}`); return null; }
}

async function run() {
  // 1. Fix remaining destinations
  const missingDests = await client.fetch(`*[_type == "destination" && !defined(hero_image.asset)]{_id, name_en, slug}`);
  console.log(`\n🏝️  Fixing ${missingDests.length} destination images...\n`);

  for (const dest of missingDests) {
    const wikiTitle = WIKI_TITLES[dest.name_en];
    if (!wikiTitle) { console.log(`  ⚠️  No wiki title for ${dest.name_en}`); continue; }

    console.log(`📍 ${dest.name_en} → Wikipedia: "${wikiTitle}"`);
    const imageUrl = await getImageByTitle(wikiTitle);
    if (!imageUrl) { console.log(`  ⚠️  No image on Wikipedia page\n`); continue; }

    console.log(`  📸 ${imageUrl.substring(0, 80)}...`);
    const assetId = await uploadImage(imageUrl, `${(dest.slug?.current || dest.name_en).replace(/[^a-z0-9]/gi,'_')}-hero.jpg`);
    if (!assetId) { console.log(); continue; }

    await client.patch(dest._id).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Patched!\n`);
    await new Promise(r => setTimeout(r, 1200));
  }

  // 2. Fix articles with no image
  const missingArts = await client.fetch(`*[_type == "article" && !defined(hero_image.asset)]{_id, title, slug}`);
  console.log(`\n📰 Fixing ${missingArts.length} article images...\n`);

  for (const art of missingArts) {
    const slug = art.slug?.current;
    const wikiTitle = ARTICLE_WIKI_TITLES[slug] || art.title.split(':')[0].split('—')[0].trim();
    console.log(`📝 "${art.title.substring(0, 55)}..." → "${wikiTitle}"`);

    const imageUrl = await getImageByTitle(wikiTitle);
    if (!imageUrl) { console.log(`  ⚠️  No image\n`); continue; }

    console.log(`  📸 ${imageUrl.substring(0, 80)}...`);
    const assetId = await uploadImage(imageUrl, `article-${(slug || 'unknown').substring(0, 50)}-hero.jpg`);
    if (!assetId) { console.log(); continue; }

    await client.patch(art._id).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Patched!\n`);
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log('🎉 All images resolved!');
}

run();
