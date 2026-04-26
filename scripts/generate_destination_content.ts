import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Delay utility
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return null;
  } catch (error) {
    console.error(`Unsplash fetch error for "${query}":`, error);
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<any> {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const asset = await sanity.assets.upload('image', Buffer.from(buffer), {
      filename: `${filename}.jpg`,
    });
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
  } catch (err) {
    console.error(`Sanity upload error for ${filename}:`, err);
    return null;
  }
}

const SYSTEM_PROMPT = `
You are the elite editorial team behind CYouInGreece. You write premium, highly specific, Conde Nast Traveler level content.
Never use cliches like "hidden gem", "crystal clear waters", or "stunning".
Be highly specific with names, times, and sensory details. 

I will give you a Greek destination. You must generate JSON containing:
1. "diary_entries": 3 objects (Nikos Diary). Fields: "location", "title", "body_paragraphs" (array of strings), "verdict", "unsplash_query" (2-3 words for photo search).
2. "hidden_gems": 3 objects (Only Locals Know). Fields: "title", "description", "location_hint", "unsplash_query".
3. "gastronomy": 3 objects (Where to eat). Fields: "name" (restaurant), "type" (e.g. Taverna), "description" (what to order), "price_level" ("€" to "€€€€"), "unsplash_query".
4. "top_experiences": 3 objects. Fields: "title", "description", "duration" (e.g. "Half day"), "unsplash_query".

Output must be strictly valid JSON. Do not include markdown codeblocks like \`\`\`json. Just the raw JSON object.
`;

async function processDestination(dest: any) {
  console.log(`\n\n=================================================`);
  console.log(`🚀 PROCESSING DESTINATION: ${dest.name_en}`);
  console.log(`=================================================`);

  // 1. Hero Image
  let heroImage = dest.hero_image;
  if (!heroImage?.asset) {
    console.log(`- Fetching Hero Image for ${dest.name_en}...`);
    const heroUrl = await fetchUnsplashImage(`${dest.name_en} island greece landscape`);
    if (heroUrl) {
      heroImage = await uploadImageToSanity(heroUrl, `hero-${dest.slug.current}`);
      await delay(1000); // Respect rate limits
    }
  }

  // 2. Read Content from static JSON (Bypassing AI API for now due to key limits)
  console.log(`- Reading Editorial Content from JSON...`);
  
  let content: any = {};
  try {
    const fs = await import('fs/promises');
    const rawJson = await fs.readFile(path.join(process.cwd(), 'scripts', 'rethymno_content.json'), 'utf-8');
    content = JSON.parse(rawJson);
  } catch (e) {
    console.error(`Failed to read or parse local JSON.`);
    console.error(e);
    return;
  }

  // 3. Process & Upload Images for each section
  console.log(`- Processing Images & formatting for Sanity...`);
  
  // Diary
  const diary_entries = [];
  for (const entry of (content.diary_entries || [])) {
    let img = null;
    if (entry.unsplash_query) {
      const url = await fetchUnsplashImage(`${entry.unsplash_query} ${dest.name_en}`);
      if (url) img = await uploadImageToSanity(url, `diary-${dest.slug.current}-${Date.now()}`);
      await delay(1000);
    }
    diary_entries.push({
      _key: Math.random().toString(36).substring(7),
      _type: 'nikosDiaryEntry',
      location: entry.location,
      title: entry.title,
      verdict: entry.verdict,
      body: entry.body_paragraphs.map((p: string) => ({
        _type: 'block', _key: Math.random().toString(36).substring(7), style: 'normal', markDefs: [],
        children: [{ _type: 'span', marks: [], text: p, _key: Math.random().toString(36).substring(7) }]
      })),
      ...(img ? { image: img } : {})
    });
  }

  // Hidden Gems
  const hidden_gems = [];
  for (const gem of (content.hidden_gems || [])) {
    let img = null;
    if (gem.unsplash_query) {
      const url = await fetchUnsplashImage(`${gem.unsplash_query} greece`);
      if (url) img = await uploadImageToSanity(url, `gem-${dest.slug.current}-${Date.now()}`);
      await delay(1000);
    }
    hidden_gems.push({
      _key: Math.random().toString(36).substring(7),
      _type: 'hiddenGem',
      title: gem.title,
      description: gem.description,
      location_hint: gem.location_hint,
      ...(img ? { image: img } : {})
    });
  }

  // Gastronomy
  const gastronomy = [];
  for (const gastro of (content.gastronomy || [])) {
    let img = null;
    if (gastro.unsplash_query) {
      const url = await fetchUnsplashImage(`${gastro.unsplash_query} food greece`);
      if (url) img = await uploadImageToSanity(url, `food-${dest.slug.current}-${Date.now()}`);
      await delay(1000);
    }
    gastronomy.push({
      _key: Math.random().toString(36).substring(7),
      _type: 'gastronomyItem',
      name: gastro.name,
      type: gastro.type,
      description: gastro.description,
      price_level: gastro.price_level,
      ...(img ? { image: img } : {})
    });
  }

  // Top Experiences
  const top_experiences = [];
  for (const exp of (content.top_experiences || [])) {
    let img = null;
    if (exp.unsplash_query) {
      const url = await fetchUnsplashImage(`${exp.unsplash_query} ${dest.name_en}`);
      if (url) img = await uploadImageToSanity(url, `exp-${dest.slug.current}-${Date.now()}`);
      await delay(1000);
    }
    top_experiences.push({
      _key: Math.random().toString(36).substring(7),
      _type: 'experience',
      title: exp.title,
      description: exp.description,
      duration: exp.duration,
      ...(img ? { image: img } : {})
    });
  }

  // 4. Patch Sanity
  console.log(`- Saving all data to Sanity for ${dest.name_en}...`);
  await sanity.patch(dest._id)
    .set({
      ...(heroImage?.asset ? { hero_image: heroImage } : {}),
      diary_entries,
      hidden_gems,
      gastronomy,
      top_experiences
    })
    .commit();

  console.log(`✅ Finished ${dest.name_en}!`);
}

async function run() {
  console.log('Fetching destinations missing content...');
  // We look for destinations that are missing diary entries to prioritize them
  const destinations = await sanity.fetch(`*[_type == "destination" && !defined(diary_entries)] {
    _id,
    name_en,
    slug,
    hero_image
  }`);

  if (destinations.length === 0) {
    console.log('🎉 All destinations have been processed!');
    return;
  }

  console.log(`Found ${destinations.length} destinations missing content.`);
  console.log(`RATE LIMIT SAFETY: Processing ONLY 1 destination per run.`);

  // Process ONLY 1 destination to respect the Unsplash 50/hr rate limit
  // (1 destination uses ~13 image requests)
  await processDestination(destinations[0]);
}

run().catch(console.error);
