import * as dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-04-18',
  token: process.env.SANITY_API_TOKEN,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const CATEGORIES = ['mountain', 'sea', 'culture', 'gastronomy'];

const PROMPTS: Record<string, string> = {
  'mountain': 'Write an evocative travel editorial about the mountains, gorges, or alpine villages of Greece. Cross-reference other mountain regions if relevant.',
  'sea': 'Write an evocative travel editorial about the hidden beaches, coastal culture, or islands of Greece. Compare it to other Greek island chains if relevant.',
  'culture': 'Write an evocative travel editorial about the ancient ruins, traditions, or living history of Greece. Mention architectural styles or mythology that connects to other regions.',
  'gastronomy': 'Write an evocative travel editorial about the culinary traditions, local ingredients, or iconic dishes of a Greek region. Compare local flavors to other parts of Greece.'
};

async function getUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' Greece')}&orientation=landscape&per_page=1`, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });
    if (!res.ok) {
      console.warn(`⚠️ Unsplash API Error: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch (e) {
    return null;
  }
}

async function getWikimediaImage(query: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' Greece')}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query.search[0]?.title || query;

    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
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

async function generateArticle(category: string, availableDestinations: any[]) {
  console.log(`\n👨‍🎨 Thematic Editor is drafting a new article for: ${category.toUpperCase()}`);
  
  const destNames = availableDestinations.map(d => d.name_en).join(', ');
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are the Editor-in-Chief of CYouInGreece.
    Task: ${PROMPTS[category]}
    
    IMPORTANT: Provide deep cross-referencing. Mention specific nearby or similar regions from the list below to create a web of knowledge.
    
    Return ONLY a raw JSON object with no markdown backticks.
    Format:
    {
      "title": "A captivating, poetic headline (max 8 words).",
      "excerpt": "A two-sentence hook for the article.",
      "body_paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
      "related_destination_names": ["Name 1", "Name 2", "Name 3"] // Pick 1-4 EXACT names from this list: [${destNames}].
    }
  `;

  let retries = 3;
  let rawJson = null;

  while (retries > 0) {
    try {
      const result = await model.generateContent(prompt);
      rawJson = JSON.parse(result.response.text().replace(/```json/g, '').replace(/```/g, '').trim());
      break;
    } catch (err: any) {
      if (err.message && err.message.includes('429')) {
        console.log("⏳ Rate limit hit. Sleeping for 30s...");
        await sleep(30000);
        retries--;
      } else {
        console.error("JSON Parse Error:", err);
        return;
      }
    }
  }

  if (!rawJson) {
    console.log("❌ Failed to generate article after retries.");
    return;
  }

  console.log(`   - Headline: "${rawJson.title}"`);

  // Map destination names to _id
  const relatedRefs = [];
  if (rawJson.related_destination_names) {
    for (const name of rawJson.related_destination_names) {
      const match = availableDestinations.find(d => d.name_en.toLowerCase() === name.toLowerCase());
      if (match) relatedRefs.push({ _key: match._id, _type: 'reference', _ref: match._id });
    }
  }

  // Construct Portable Text
  const portableText = rawJson.body_paragraphs.map((para: string, i: number) => ({
    _key: `p${i}-${Date.now()}`,
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', _key: `s${i}`, text: para }]
  }));

  // Fetch Image (Try Unsplash first, fallback to Wikimedia)
  const searchQuery = rawJson.related_destination_names.length > 0 ? rawJson.related_destination_names[0] : rawJson.title;
  let imageUrl = await getUnsplashImage(searchQuery);
  
  if (imageUrl) {
    console.log(`   - 📸 Sourced Premium Unsplash Image`);
  } else {
    console.log(`   - ⚠️ Unsplash failed or Rate Limited. Falling back to Wikimedia.`);
    imageUrl = await getWikimediaImage(searchQuery);
    if (imageUrl) console.log(`   - 📸 Sourced Wikimedia Image`);
  }
  
  let imageAssetId = null;
  if (imageUrl) {
    imageAssetId = await uploadImageToSanity(imageUrl, `article-${category}-${Date.now()}.jpg`);
  }

  const doc = {
    _type: 'article',
    title: rawJson.title,
    slug: { _type: 'slug', current: rawJson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) },
    excerpt: rawJson.excerpt,
    category: category,
    published_at: new Date().toISOString(),
    body: portableText,
    related_destinations: relatedRefs.length > 0 ? relatedRefs : undefined,
    hero_image: imageAssetId ? { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } : undefined
  };

  await sanityClient.create(doc);
  console.log(`✅ Successfully published article: ${doc.title}`);
}

async function run() {
  console.log("🚀 THEMATIC EDITOR IS ON DUTY (MASSIVE PRODUCTION).");
  if (!UNSPLASH_ACCESS_KEY) console.warn("⚠️ UNSPLASH_ACCESS_KEY is missing. Premium visuals will not load.");
  
  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en}`);
  
  // Endless loop for massive production. Will run 20 articles per category per execution.
  for (const category of CATEGORIES) {
    console.log(`\n=========================================\nSTARTING CATEGORY: ${category.toUpperCase()}\n=========================================`);
    for (let i = 0; i < 20; i++) {
      await generateArticle(category, destinations);
      await sleep(15000); // 15 seconds between generations to avoid hitting the 15 RPM Gemini limit too hard
    }
  }
  console.log("🏁 THEMATIC SHIFT COMPLETE.");
}

run();
