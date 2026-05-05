import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanityClient } from '../src/lib/sanity';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ARTICLES = [
  { title: "The Forgotten Cyclades: Why Sikinos is the Last True Sanctuary", category: "sea", wikiQuery: "Sikinos" },
  { title: "Waking Up in Folegandros: A Study in Wind and Stone", category: "destinations", wikiQuery: "Folegandros" },
  { title: "Sailing the Ionian: The Hidden Coves of Meganisi", category: "sea", wikiQuery: "Meganisi" },
  { title: "Beyond the Caldera: The Hidden Wineries of Santorini", category: "destinations", wikiQuery: "Santorini_wine" },
  { title: "The Venetian Echoes of Chania's Old Port", category: "destinations", wikiQuery: "Chania_harbour" },
  { title: "The Pindus Spine: Hiking the Dragon Lakes of Epirus", category: "mountain", wikiQuery: "Pindus" },
  { title: "Silence in Meteora: Climbing the Monastic Pillars", category: "mountain", wikiQuery: "Meteora_monastery" },
  { title: "The Marble Carvers of Tinos: A Living Tradition", category: "culture", wikiQuery: "Tinos_marble" },
  { title: "Delphi at Dawn: Hearing the Oracle in the Wind", category: "culture", wikiQuery: "Delphi" },
  { title: "The Artisans of Ioannina: Silver and Shadow", category: "culture", wikiQuery: "Ioannina" },
  { title: "The Anatomy of True Fava: A Schinoussa Secret", category: "gastronomy", wikiQuery: "Schinoussa" },
  { title: "Cretan Liquid Gold: The Olive Oil Harvest Ritual", category: "gastronomy", wikiQuery: "Olive_harvest_Greece" },
  { title: "Slow Cooked in Clay: The Mastery of Sifnos Gastronomy", category: "gastronomy", wikiQuery: "Sifnos_pottery" },
  { title: "Assyrtiko and Sea Salt: The Wines of the Aegean", category: "gastronomy", wikiQuery: "Assyrtiko" },
  { title: "The Mountain Foragers: Wild Greens of the Peloponnese", category: "gastronomy", wikiQuery: "Peloponnese" }
];

async function getWikimediaImage(query: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' Greece')}&utf8=&format=json`;
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

async function uploadImageToSanity(imageUrl: string, filename: string) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), { filename });
    return asset._id;
  } catch (err) {
    console.error(`Failed to upload image ${imageUrl}:`, err);
    return null;
  }
}

const SYSTEM_PROMPT = `You are Nikos, the lead travel editor for a luxury Greek travel platform. 
Generate a stunning, first-person editorial journal article.
Tone: Evocative, deeply authentic, poetic but specific. No cliches.

Output EXACTLY as this JSON structure:
{
  "excerpt": "A beautiful, punchy 3-sentence summary of the article.",
  "body_paragraphs": [
    "Paragraph 1: Atmospheric intro.",
    "Paragraph 2: Deep dive into details.",
    "Paragraph 3: Local secret or personal reflection.",
    "Paragraph 4: A profound conclusion."
  ]
}`;

async function processArticle(article: any) {
  console.log(`\n⏳ Generating article: "${article.title}"...`);
  try {
    // 1. Generate Content
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: SYSTEM_PROMPT });
    const prompt = `Write an editorial about: "${article.title}". Category: ${article.category}.`;
    const result = await model.generateContent(prompt);
    
    let text = result.response.text();
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    const data = JSON.parse(text);

    // 2. Fetch & Upload Image
    let imageUrl = await getWikimediaImage(article.wikiQuery);
    let imageAssetId = null;
    
    if (imageUrl) {
      console.log(`   📸 Found Wikimedia image: ${imageUrl}`);
      imageAssetId = await uploadImageToSanity(imageUrl, `${article.title.replace(/[^a-z0-9]/gi, '_')}-hero.jpg`);
    }

    // Convert paragraphs into PortableText format for Sanity
    const portableTextBody = data.body_paragraphs.map((para: string) => ({
      _type: 'block',
      _key: uuidv4(),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: uuidv4(),
          text: para,
          marks: []
        }
      ]
    }));

    // 3. Construct Sanity Document
    const doc = {
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') },
      category: article.category,
      excerpt: data.excerpt,
      body: portableTextBody,
      hero_image: imageAssetId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAssetId }
      } : undefined,
      published_at: new Date().toISOString()
    };

    // 4. Save to Sanity
    await sanityClient.create(doc);
    console.log(`✅ Successfully published "${article.title}"`);
  } catch (error) {
    console.error(`❌ Failed to process "${article.title}":`, error);
  }
}

async function run() {
  console.log(`🚀 Starting generation of ${ARTICLES.length} Journal Articles...`);
  for (const article of ARTICLES) {
    await processArticle(article);
    await new Promise(r => setTimeout(r, 2500)); // Rate limit buffer
  }
  console.log('🎉 All 15 articles generated and synced to Sanity!');
}

run();
