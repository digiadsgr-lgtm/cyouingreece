import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

// Better Wikipedia queries per destination
const WIKI_QUERIES: Record<string, string> = {
  'Poros': 'Poros island Saronic Gulf',
  'Monemvasia': 'Monemvasia castle Peloponnese',
  'Milos': 'Milos island Sarakiniko',
  'Kos': 'Kos island Dodecanese',
  'Zakynthos': 'Zakynthos Navagio shipwreck',
  'Lefkada': 'Lefkada island Ionian',
  'Samos': 'Samos island Aegean',
  'Syros': 'Syros Ermoupoli Cyclades',
  'Tinos': 'Tinos island Cyclades',
  'Andros': 'Andros island Cyclades',
  'Serifos': 'Serifos island Cyclades',
  'Amorgos': 'Amorgos island Cyclades',
  'Karpathos': 'Karpathos island Dodecanese',
  'Kythira': 'Kythira island Greece',
  'Spetses': 'Spetses island Saronic',
  'Delphi': 'Delphi archaeological site Apollo',
  'Meteora': 'Meteora monasteries Thessaly',
  'Chania': 'Chania old harbour Crete',
  'Patmos': 'Patmos island monastery',
  'Corfu': 'Corfu old town Kerkyra',
  'Skiathos': 'Skiathos island Sporades',
  'Skopelos': 'Skopelos island Sporades',
  'Lesvos': 'Lesbos island Mytilene',
  'Ikaria': 'Ikaria island Aegean',
  'Sifnos': 'Sifnos island Cyclades',
  'Folegandros': 'Folegandros island Cyclades',
  'Astypalaia': 'Astypalaia island butterfly Dodecanese',
  'Aegina': 'Aegina island Saronic temple',
  'Hydra': 'Hydra island port donkeys',
  'Thessaloniki': 'Thessaloniki White Tower Byzantine',
  'Zagori': 'Zagori stone village bridge Epirus',
  'Olympus': 'Mount Olympus highest peak Greece',
};

async function getWikimediaImage(query: string): Promise<string | null> {
  try {
    const s = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=3`)).json();
    for (const result of (s.query?.search ?? [])) {
      const title = result.title;
      const d = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`)).json();
      const pages = d.query?.pages;
      if (!pages) continue;
      const src = (Object.values(pages)[0] as any)?.original?.source;
      if (!src) continue;
      const lower = src.toLowerCase();
      if (lower.endsWith('.svg') || lower.includes('map') || lower.includes('flag') || lower.includes('locator') || lower.includes('coat_of')) continue;
      return src;
    }
    return null;
  } catch { return null; }
}

async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CYouInGreece/1.0 (travel guide)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buf), { filename });
    return asset._id;
  } catch (e: any) {
    console.error(`  ❌ Upload failed: ${e.message}`);
    return null;
  }
}

async function run() {
  // Get all destinations missing hero images
  const missing = await client.fetch(`*[_type == "destination" && !defined(hero_image.asset)]{_id, name_en, slug}`);
  console.log(`\n🖼️  Fixing images for ${missing.length} destinations...\n`);

  for (const dest of missing) {
    const query = WIKI_QUERIES[dest.name_en] || `${dest.name_en} Greece`;
    console.log(`🔍 ${dest.name_en} → "${query}"`);
    
    const imageUrl = await getWikimediaImage(query);
    if (!imageUrl) { console.log(`  ⚠️  No image found\n`); continue; }
    
    console.log(`  📸 ${imageUrl.substring(0, 70)}...`);
    const assetId = await uploadImage(imageUrl, `${(dest.slug?.current || dest.name_en).replace(/[^a-z0-9]/gi,'_')}-hero.jpg`);
    if (!assetId) { console.log(`  skipping\n`); continue; }

    await client.patch(dest._id).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Done\n`);
    await new Promise(r => setTimeout(r, 600));
  }

  // Also fix articles missing hero images
  const missingArticles = await client.fetch(`*[_type == "article" && !defined(hero_image.asset)]{_id, title, slug, category}`);
  console.log(`\n📰 Fixing images for ${missingArticles.length} articles...\n`);

  const articleQueries: Record<string, string> = {
    'sea': 'Greek island Aegean sea turquoise',
    'mountain': 'Greek mountain landscape Pindus',
    'culture': 'Ancient Greek ruins archaeology',
    'gastronomy': 'Greek food traditional taverna',
  };

  for (const art of missingArticles) {
    const query = `${art.title.split(':')[0]} Greece`;
    console.log(`🔍 Article: "${art.title.substring(0, 50)}..."`);
    
    const imageUrl = await getWikimediaImage(query) || await getWikimediaImage(articleQueries[art.category] || 'Greece travel');
    if (!imageUrl) { console.log(`  ⚠️  No image\n`); continue; }

    console.log(`  📸 ${imageUrl.substring(0, 70)}...`);
    const assetId = await uploadImage(imageUrl, `article-${art.slug?.current?.substring(0,40)}-hero.jpg`);
    if (!assetId) continue;

    await client.patch(art._id).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Done\n`);
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('🎉 All images fixed!');
}

run();
