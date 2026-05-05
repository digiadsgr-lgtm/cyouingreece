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
    console.error(`[VISUAL DIRECTOR] Error fetching for "${query}":`, error);
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<any> {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const asset = await sanity.assets.upload('image', Buffer.from(buffer), { filename: `${filename}.jpg` });
    return { 
      _type: 'image', 
      asset: { _type: 'reference', _ref: asset._id },
      caption: filename.replace(/-/g, ' ') 
    };
  } catch (err) {
    console.error(`[PUBLISHER] Upload error for ${filename}:`, err);
    return null;
  }
}

const ENCYCLOPEDIST_PROMPT = `
You are the "Master Encyclopedist" for the Golden Guide of Greece, a premium, authoritative, and exhaustive digital encyclopedia (think National Geographic meets luxury travel).
Your mission is to write deeply researched, historically accurate, and culturally rich thematic sections for Greek destinations.

You must generate massive value. Do not write fluff. Include specific historical dates, mythological figures, specific architectural styles, names of local plants, exact mountain peaks, local sports, and highly specific cultural secrets.

CATEGORIES ALLOWED: "Nature", "History", "Culture", "Gastronomy", "Activities", "Churches", "Museums", "Entertainment", "Secrets".
You MUST generate at least 5 different thematic sections.

OUTPUT FORMAT (JSON ONLY, NO MARKDOWN BACKTICKS):
{
  "thematic_sections": [
    {
      "category": "one of the allowed categories",
      "title": "A captivating editorial title (e.g., 'The Whispering Stones of Antiquity')",
      "content": ["Paragraph 1...", "Paragraph 2...", "Paragraph 3..."],
      "unsplash_query": "specific photo search term for this section"
    }
  ],
  "gallery_queries": [
    "search query 1 (e.g. 'Paros Kolymbithres beach')",
    "search query 2 (e.g. 'Paros ancient marble quarry')",
    "search query 3",
    "search query 4",
    "search query 5",
    "search query 6",
    "search query 7",
    "search query 8"
  ]
}
`;

async function generateContentWithSyndicate(destName: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    systemInstruction: ENCYCLOPEDIST_PROMPT,
    generationConfig: { responseMimeType: "application/json" }
  });

  console.log(`\n📝 [ENCYCLOPEDIST AGENT] Researching and drafting epic guide for ${destName}...`);
  const res = await model.generateContent(`Create a massive, deep-dive Golden Guide encyclopedia entry for: ${destName}. Include Nature, History, Culture, Gastronomy, and Secrets.`);
  const text = res.response.text() || '{}';
  return JSON.parse(text);
}

async function processDestination(dest: any) {
  console.log(`\n=================================================`);
  console.log(`🏛️ PUBLISHER: Starting Golden Guide pipeline for ${dest.name_en}`);
  console.log(`=================================================`);

  let content: any;
  const mockPath = path.join(process.cwd(), 'scripts', `${dest.slug.current}_content.json`);
  
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(mockPath, 'utf-8');
    console.log(`💡 [SYSTEM] Found local mock content for ${dest.name_en}. Using it to bypass API limit.`);
    content = JSON.parse(data);
  } catch (e) {
    // No mock file, proceed with Gemini
    content = await generateContentWithSyndicate(dest.name_en);
  }

  console.log(`📸 [VISUAL DIRECTOR] Building Massive Gallery & Section Heroes...`);
  
  // 1. Process Thematic Sections & their hero images
  const processedSections = [];
  for (const sec of content.thematic_sections) {
    let img = null;
    if (sec.unsplash_query) {
      const url = await fetchUnsplashImage(`${sec.unsplash_query} ${dest.name_en}`);
      if (url) {
        img = await uploadImageToSanity(url, `section-${sec.category}-${dest.slug.current}-${Date.now()}`);
        await delay(1000);
      }
    }
    
    // Map paragraphs to Sanity Portable Text
    const bodyContent = sec.content.map((p: string) => ({
      _type: 'block', _key: Math.random().toString(36).substring(7), style: 'normal', markDefs: [],
      children: [{ _type: 'span', marks: [], text: p, _key: Math.random().toString(36).substring(7) }]
    }));

    processedSections.push({
      _key: Math.random().toString(36).substring(7),
      _type: 'thematicSection',
      category: sec.category,
      title: sec.title,
      content: bodyContent,
      hero_image: img
    });
  }

  // 2. Process massive Gallery
  const processedGallery = [];
  for (const query of (content.gallery_queries || [])) {
    const url = await fetchUnsplashImage(`${query} ${dest.name_en} greece`);
    if (url) {
      const img = await uploadImageToSanity(url, `gallery-${dest.slug.current}-${Date.now()}`);
      if (img) processedGallery.push(img);
      await delay(1000);
    }
  }

  console.log(`📤 [PUBLISHER AGENT] Patching massive encyclopedia data to Sanity DB...`);
  await sanity.patch(dest._id)
    .set({
      thematic_sections: processedSections,
      gallery: processedGallery,
      // Clear out the old Bourdain stuff if we want, or leave it. 
      // For now, we just add the new massive data.
    })
    .commit();

  console.log(`✅ [SYSTEM] Golden Guide generated for ${dest.name_en}`);
}

async function run() {
  // TEST RUN: We only want to target ONE specific destination to test the new Encyclopedia layout.
  const targetName = "Paros"; 
  const destinations = await sanity.fetch(`*[_type == "destination" && name_en match "${targetName}"] {
    _id, name_en, slug
  }`);

  if (destinations.length === 0) return console.log('❌ Destination not found!');

  console.log(`🚀 [SYSTEM] TEST MODE: Processing single destination (${targetName}) for Golden Guide preview.`);
  await processDestination(destinations[0]);
}

run().catch(console.error);
