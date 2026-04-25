/**
 * generate_journal_articles.ts
 * Generates 15 rich editorial journal articles and saves them to Sanity CMS.
 * Run with: npx tsx scripts/generate_journal_articles.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanityClient } from '../src/lib/sanity';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

const SYSTEM_PROMPT = `You are Nikos Papadimitriou, the lead editorial writer for CYouInGreece.
Write deeply specific, anti-cliché travel journalism about Greece.
Never use: "hidden gem", "crystal clear waters", "bustling", "vibrant", "must-see", "charming".
Always give specific restaurant names, taverna owners' first names, ferry routes, trail names.
Your tone: warm, poetic, specific. Like a trusted friend who has lived this.

Output ONLY valid JSON with this structure:
{
  "excerpt": "2-sentence editorial hook, max 60 words.",
  "body": [
    { "_key": "b1", "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": "s1", "text": "Opening paragraph (100-150 words). Set the scene specifically." }] },
    { "_key": "b2", "_type": "block", "style": "h2", "children": [{ "_type": "span", "_key": "s2", "text": "Section title" }] },
    { "_key": "b3", "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": "s3", "text": "Section body (100-150 words). Specific details." }] },
    { "_key": "b4", "_type": "block", "style": "blockquote", "children": [{ "_type": "span", "_key": "s4", "text": "A memorable one-sentence insight." }] },
    { "_key": "b5", "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": "s5", "text": "Final section (80-100 words). Practical advice or departure note." }] }
  ]
}`;

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
    console.error(`Failed to upload image:`, err);
    return null;
  }
}

async function generateArticle(article: typeof ARTICLES[0]) {
  console.log(`📝 Generating: ${article.title}`);
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    });
    const result = await model.generateContent(
      `Write for article titled: "${article.title}" (destination focus: ${article.dest}, category: ${article.category})`
    );
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);

    // Upload hero image
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
  console.log(`🚀 Generating ${ARTICLES.length} journal articles...`);
  // Process 3 at a time to respect rate limits
  for (let i = 0; i < ARTICLES.length; i += 3) {
    const batch = ARTICLES.slice(i, i + 3);
    await Promise.all(batch.map(a => generateArticle(a)));
    if (i + 3 < ARTICLES.length) {
      console.log('⏳ Waiting 3s...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log('🎉 All articles generated!');
}

run();
