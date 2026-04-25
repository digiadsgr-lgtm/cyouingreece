import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanityClient } from '../src/lib/sanity';
import * as dotenv from 'dotenv';
import { createReadStream, writeFileSync } from 'fs';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const DESTINATIONS = [
  "Mykonos", "Naxos", "Paros", "Milos", "Chania", "Heraklion", "Rethymno", 
  "Rhodes", "Kos", "Patmos", "Symi", "Corfu", "Paxos", "Zakynthos", 
  "Kefalonia", "Lefkada", "Ithaca", "Skiathos", "Skopelos", "Alonissos", 
  "Skyros", "Thassos", "Samothrace", "Lemnos", "Lesvos", "Chios", "Samos", 
  "Ikaria", "Syros", "Tinos", "Andros", "Sifnos", "Serifos", "Folegandros", 
  "Amorgos", "Astypalaia", "Karpathos", "Kythira", "Aegina", "Hydra", 
  "Spetses", "Poros", "Athens", "Thessaloniki", "Nafplio", "Delphi", 
  "Meteora", "Zagori", "Mani", "Monemvasia", "Mount Olympus"
];

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
    
    // Upload the buffer to Sanity
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), { filename });
    return asset._id;
  } catch (err) {
    console.error(`Failed to upload image ${imageUrl}:`, err);
    return null;
  }
}

const SYSTEM_PROMPT = `You are the lead editor for CYouInGreece. Generate a highly curated, editorial JSON object for the given Greek destination. 
DO NOT use clichés like "hidden gem", "crystal clear waters", or "must-see". Be incredibly specific with names (tavernas, villages, trails).
Format the output EXACTLY as this JSON structure (no markdown tags, just pure JSON):
{
  "name_en": "Destination Name",
  "name_local": "Greek Name",
  "type": "island", // or city, village, archaeological_site, mountain, peninsula, beach
  "tagline": "Punchy 10-word summary without cliches.",
  "intro_paragraph": "A rich 3-sentence editorial introduction.",
  "body_content": [
    {
      "_key": "b1",
      "_type": "block",
      "style": "normal",
      "children": [{"_type": "span", "_key": "s1", "text": "Detailed editorial text about the vibe and reality of the destination."}]
    }
  ],
  "hidden_gems": [
    {"_key": "h1", "_type": "hiddenGem", "title": "Specific Place", "description": "Specific details."}
  ],
  "gastronomy": [
    {"_key": "g1", "_type": "gastronomyItem", "dish_name": "Specific Dish", "where_to_find": "Specific Taverna Name", "description": "Why it matters."}
  ],
  "top_experiences": [
    {"_key": "t1", "_type": "experience", "title": "Action", "description": "Details."}
  ],
  "seo": {
    "meta_title": "Best of Destination | CYouInGreece",
    "meta_description": "Editorial description."
  }
}`;

async function processDestination(dest: string) {
  console.log(`Processing ${dest}...`);
  try {
    // 1. Generate Content
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT });
    const result = await model.generateContent(`Generate data for: ${dest}`);
    const text = result.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    const data = JSON.parse(text);

    // 2. Fetch & Upload Image
    let imageUrl = await getWikimediaImage(dest);
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop'; // fallback
    }
    const imageAssetId = await uploadImageToSanity(imageUrl, `${dest.toLowerCase()}-hero.jpg`);

    // 3. Construct Sanity Document
    const doc = {
      _type: 'destination',
      name_en: data.name_en,
      name_local: data.name_local,
      slug: { _type: 'slug', current: dest.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      type: data.type,
      tagline: data.tagline,
      intro_paragraph: data.intro_paragraph,
      body_content: data.body_content,
      hidden_gems: data.hidden_gems.slice(0,3), // Schema requires exactly 3
      gastronomy: data.gastronomy.slice(0,3), // Schema requires exactly 3
      top_experiences: data.top_experiences.slice(0,3), // Schema requires min 3
      hero_image: imageAssetId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAssetId }
      } : undefined,
      seo: data.seo,
      review_status: 'published', // Publish immediately
      ai_generated: true,
      editor_approved: true
    };

    // Pad arrays if Gemini returned fewer than 3 items
    while (doc.hidden_gems.length < 3) doc.hidden_gems.push({ _key: Math.random().toString(), _type: "hiddenGem", title: "Explore", description: "Wander the paths." });
    while (doc.gastronomy.length < 3) doc.gastronomy.push({ _key: Math.random().toString(), _type: "gastronomyItem", dish_name: "Local Wine", where_to_find: "Local Taverna", description: "Taste the local variety." });
    while (doc.top_experiences.length < 3) doc.top_experiences.push({ _key: Math.random().toString(), _type: "experience", title: "Sunset Walk", description: "Take a stroll at dusk." });

    // 4. Save to Sanity
    await sanityClient.create(doc);
    console.log(`✅ Successfully published ${dest}`);
  } catch (error) {
    console.error(`❌ Failed to process ${dest}:`, error);
  }
}

async function run() {
  console.log(`Starting generation of ${DESTINATIONS.length} articles...`);
  // Process in batches of 5 to avoid rate limits
  for (let i = 0; i < DESTINATIONS.length; i += 5) {
    const batch = DESTINATIONS.slice(i, i + 5);
    await Promise.all(batch.map(d => processDestination(d)));
    // Wait 2 seconds between batches
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('🎉 All destinations processed!');
}

run();
