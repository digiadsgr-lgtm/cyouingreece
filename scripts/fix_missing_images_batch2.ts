import * as dotenv from 'dotenv';
dotenv.config();
const { createClient } = require('@sanity/client');
const sanityClient = createClient({
  projectId: 'sntl6fxn',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

// These articles had no Wikimedia image — fix their hero_image with alternative queries
const IMAGE_FIXES = [
  {
    slug: 'the-secret-harbours-of-ithaca-walking-with-homer',
    wikiQuery: 'Ithaki Ionian island',
  },
  {
    slug: 'the-vikos-gorge-crossing-one-day-an-entire-universe',
    wikiQuery: 'Voidomatis River Epirus',
  },
  {
    slug: 'the-sound-of-epirus-music-that-carries-the-weight-of-mountains',
    wikiQuery: 'Ioannina Greece Epirus',
  },
  {
    slug: 'nafplio-the-capital-that-history-forgot-to-erase',
    wikiQuery: 'Nafplio harbour Palamidi',
  },
  {
    slug: 'thessaloniki-by-night-the-city-that-never-stopped-inventing-itself',
    wikiQuery: 'Thessaloniki White Tower',
  },
  {
    slug: 'the-olive-oil-pilgrimage-koroneiki-pressed-in-mani',
    wikiQuery: 'Mani towers Laconia',
  },
  {
    slug: 'kakavia-the-fisherman-s-soup-that-predates-civilisation',
    wikiQuery: 'Greek fishing boat Aegean',
  }
];

async function getWikimediaImage(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query?.search[0]?.title || query;

    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const firstPage = Object.values(pages)[0] as any;
    return firstPage?.original?.source || null;
  } catch (e) {
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl, { headers: { 'User-Agent': 'CYouInGreece/1.0' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), { filename });
    return asset._id;
  } catch (err: any) {
    console.error(`  ❌ Upload failed: ${err.message}`);
    return null;
  }
}

async function run() {
  console.log('🔧 Fixing missing hero images...\n');

  for (const fix of IMAGE_FIXES) {
    console.log(`🔍 Searching image for slug: "${fix.slug}"...`);

    // Find the article document
    const docs = await sanityClient.fetch(
      `*[_type == "article" && slug.current == $slug]{ _id, title }`,
      { slug: fix.slug }
    );

    if (!docs.length) {
      console.log(`  ⚠️  Article not found in Sanity: ${fix.slug}\n`);
      continue;
    }

    const doc = docs[0];
    console.log(`  Found: "${doc.title}" (${doc._id})`);

    const imageUrl = await getWikimediaImage(fix.wikiQuery);
    if (!imageUrl) {
      console.log(`  ⚠️  No Wikimedia image found for query: "${fix.wikiQuery}"\n`);
      continue;
    }

    console.log(`  📸 Found image: ${imageUrl.substring(0, 70)}...`);
    const assetId = await uploadImageToSanity(imageUrl, `${fix.slug}-hero.jpg`);

    if (assetId) {
      await sanityClient
        .patch(doc._id)
        .set({
          hero_image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId }
          }
        })
        .commit();
      console.log(`  ✅ Hero image patched!\n`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log('🎉 Image fix complete!');
}

run();
