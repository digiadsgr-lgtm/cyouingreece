import * as dotenv from 'dotenv';
dotenv.config();
const { createClient } = require('@sanity/client');
const sanityClient = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

// Items with missing hero images to patch
const PATCHES = [
  { type: 'destination', slug: 'epirus',   wikiQuery: 'Zagori villages Epirus' },
  { type: 'article',     slug: 'the-vikos-gorge-crossing-one-day-an-entire-universe', wikiQuery: 'Vikos Gorge Papingo' },
];

async function getWikimediaImage(query: string): Promise<string | null> {
  try {
    const s = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`)).json();
    const title = s.query?.search?.[0]?.title || query;
    const d = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`)).json();
    const pages = d.query?.pages;
    if (!pages) return null;
    return (Object.values(pages)[0] as any)?.original?.source || null;
  } catch { return null; }
}

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, { headers: { 'User-Agent': 'CYouInGreece/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buf), { filename });
    return asset._id;
  } catch (e: any) {
    console.error(`Upload failed: ${e.message}`);
    return null;
  }
}

async function run() {
  console.log('🖼️  Patching missing hero images...\n');
  for (const p of PATCHES) {
    console.log(`🔍 Searching for: "${p.wikiQuery}"...`);
    const imageUrl = await getWikimediaImage(p.wikiQuery);
    if (!imageUrl) { console.log('  ⚠️  No image found\n'); continue; }
    console.log(`  📸 Found: ${imageUrl.substring(0, 70)}...`);
    const assetId = await uploadImageToSanity(imageUrl, `${p.slug}-hero.jpg`);
    if (!assetId) { console.log('  ❌ Upload failed\n'); continue; }

    const docs = await sanityClient.fetch(
      `*[_type == $type && slug.current == $slug][0]._id`,
      { type: p.type, slug: p.slug }
    );
    if (!docs) { console.log(`  ⚠️  Document not found: ${p.slug}\n`); continue; }

    await sanityClient.patch(docs).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }).commit();
    console.log(`  ✅ Patched: ${p.slug}\n`);
    await new Promise(r => setTimeout(r, 800));
  }
  console.log('🎉 Done!');
}

run();
