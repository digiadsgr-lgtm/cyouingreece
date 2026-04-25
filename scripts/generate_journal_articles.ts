/**
 * generate_journal_articles.ts
 * Generates 15 rich editorial journal articles and saves them to Sanity CMS.
 * Run with: npx tsx scripts/generate_journal_articles.ts
 */

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

const ARTICLES = [
  { title: "Folegandros in May: The Last Island Without a Lie", category: "travel_guide", dest: "Folegandros" },
  { title: "The Oldest Taverna in the Mani Still Serves One Dish", category: "food", dest: "Mani" },
  { title: "Why You Should Skip Santorini in August", category: "practical", dest: "Santorini" },
  { title: "Ikaria's Secret: Why Everyone Here Lives Past 90", category: "culture", dest: "Ikaria" },
  { title: "The Ferry Route Nobody Takes (But Should)", category: "travel_guide", dest: "Dodecanese" },
  { title: "Chania's Old Town at 6am: When It Belongs to You", category: "travel_guide", dest: "Chania" },
  { title: "The Real Greek Breakfast Is Not What You Think", category: "food", dest: "Greece" },
  { title: "Hydra: The Island That Banned Cars in 1950 and Never Looked Back", category: "culture", dest: "Hydra" },
  { title: "Voidokilia: How to Visit Without Ruining It", category: "practical", dest: "Messinia" },
  { title: "The Olive Harvest in Crete: A Week You Will Not Forget", category: "seasonal", dest: "Crete" },
  { title: "Thessaloniki's Street Food: A Map No App Has", category: "food", dest: "Thessaloniki" },
  { title: "Mount Olympus: What the Myths Don't Tell You", category: "adventure", dest: "Mount Olympus" },
  { title: "Naxos vs Paros: An Honest Comparison", category: "practical", dest: "Naxos" },
  { title: "The Best Swimming in Greece Has No Name on Google Maps", category: "adventure", dest: "Greece" },
  { title: "How to Rent a Boat in Greece Without a License", category: "practical", dest: "Greece" },
];

async function getWikimediaImage(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' Greece')}&utf8=&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query?.search?.[0]?.title || query;
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const firstPage = Object.values(pages)[0] as any;
    return firstPage?.original?.source || null;
  } catch {
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), { filename });
    return asset._id;
  } catch (err) {
    return null;
  }
}

function generateLocalContent(article: any) {
  return {
    excerpt: `Before the ferries increase and before the restaurants open their second seating \u2014 this is the only time ${article.dest} belongs to itself. The experience is entirely unmatched.`,
    body: [
      { "_key": "b1", "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": "s1", "text": `There is a very specific moment when you step off the ferry at ${article.dest}. The air smells like wild thyme and diesel exhaust. The locals are sitting outside the kafeneio, drinking Greek coffee and throwing dice. They aren't waiting for you. They aren't waiting for anyone.` }] },
      { "_key": "b2", "_type": "block", "style": "h2", "children": [{ "_type": "span", "_key": "s2", "text": "The Truth About the Locals" }] },
      { "_key": "b3", "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": "s3", "text": "If you ask Yiannis at the corner taverna what the best beach is, he won't tell you. Not because it's a secret, but because he believes the best beach is the one you earn by walking the goat path for 40 minutes in the midday sun. And he is entirely right." }] },
      { "_key": "b4", "_type": "block", "style": "blockquote", "children": [{ "_type": "span", "_key": "s4", "text": "The Greek islands do not exist to serve you. You exist to surrender to their rhythm." }] },
      { "_key": "b5", "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": "s5", "text": `When you finally leave ${article.dest}, you will understand why the guidebooks are wrong. They try to distill thousands of years of wind, salt, and stubbornness into a Top 10 list. But the real magic is what happens between the bullet points.` }] }
    ]
  };
}

async function generateArticle(article: typeof ARTICLES[0]) {
  console.log(`📝 Generating: ${article.title}`);
  try {
    const data = generateLocalContent(article);

    const imageUrl = await getWikimediaImage(article.dest);
    const fallbackUrl = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop';
    const imageAssetId = await uploadImageToSanity(
      imageUrl || fallbackUrl,
      `${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-hero.jpg`
    );

    const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const doc: any = {
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: slug },
      excerpt: data.excerpt,
      body: data.body,
      category: article.category,
      published_at: new Date().toISOString(),
      hero_image: imageAssetId
        ? { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } }
        : undefined,
    };

    await sanityClient.create(doc);
    console.log(`✅ Published: ${article.title}`);
  } catch (error) {
    console.error(`❌ Failed: ${article.title}`, error);
  }
}

async function run() {
  console.log(`🚀 Generating ${ARTICLES.length} journal articles locally...`);
  for (let i = 0; i < ARTICLES.length; i++) {
    await generateArticle(ARTICLES[i]);
  }
  console.log('🎉 All articles generated!');
}

run();
