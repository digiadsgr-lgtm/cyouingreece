import { createClient } from '@sanity/client';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const NIKOS_SYSTEM_PROMPT = `
You are Nikos Papadimitriou — 45, born in Thessaloniki, raised in Athens. You are the editorial soul of CYouInGreece. 
Your tone is cynical but deeply romantic, highly specific, slightly poetic, and extremely authoritative. 
You despise tourist traps, generic descriptions, and words like "hidden gem", "crystal clear waters", "stunning", or "vibrant".
You provide elite, insider intelligence that only a local who has slept on 60 Greek islands would know.

I will give you a destination in Greece. 
You must generate exactly 3 Diary Entries for this destination:
1. A Secret/Untouched Spot (a beach, a cove, a mountain trail)
2. A Gastronomy Verdict (a specific dish at a specific authentic taverna)
3. A Cultural/Historical Observation (something most tourists completely misunderstand or miss)

For each entry, return a JSON object with:
- "location": Specific name (e.g., "Panormos Tavern, Harbor", "Agios Sostis Cove")
- "title": A catchy, slightly cynical or poetic title (e.g., "The Octopus You Don't Deserve", "A Beach Unruined By Instagram")
- "body_paragraphs": Array of 2-3 strings. The actual diary entry. Deeply evocative, specific, magazine-quality writing.
- "verdict": A 1-sentence TL;DR (e.g., "Go before 10 AM or don't go at all.")
- "image_search_query": 2-3 words to search Unsplash for a matching mood image (e.g., "grilled octopus", "wild greek beach")

Output MUST be a valid JSON array of 3 objects.
`;

async function fetchUnsplashImage(query: string, destination: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('⚠️ No Unsplash Key. Skipping image fetch.');
    return null;
  }
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' ' + destination)}&orientation=landscape&per_page=3`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    // Fallback without destination keyword
    const fallback = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=3`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const fbData = await fallback.json();
    if (fbData.results && fbData.results.length > 0) {
      return fbData.results[0].urls.regular;
    }
    return null;
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string): Promise<any> {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const asset = await sanity.assets.upload('image', Buffer.from(buffer), {
      filename: `nikos-diary-${Date.now()}.jpg`,
    });
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
  } catch (err) {
    console.error('Sanity upload error:', err);
    return null;
  }
}

async function generateDiaryForDestination(destination: any) {
  console.log(`\n📓 Generating Diary for ${destination.name_en}...`);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: NIKOS_SYSTEM_PROMPT },
      { role: 'user', content: `Generate 3 elite diary entries for: ${destination.name_en}` }
    ],
    response_format: { type: 'json_object' }
  });

  const rawJson = completion.choices[0].message.content || '{"entries":[]}';
  let entries: any[] = [];
  try {
    const parsed = JSON.parse(rawJson);
    entries = parsed.entries || parsed;
    if (!Array.isArray(entries)) {
        // sometimes GPT returns an object with numbered keys, force array
        entries = Object.values(parsed);
    }
  } catch (e) {
    console.error(`Failed to parse JSON for ${destination.name_en}`);
    return;
  }

  const sanityDiaryEntries = [];

  for (const entry of entries) {
    console.log(`   - Processing: ${entry.title}`);
    
    // 1. Fetch & Upload Image
    let sanityImage = null;
    if (entry.image_search_query) {
      const imgUrl = await fetchUnsplashImage(entry.image_search_query, destination.name_en);
      if (imgUrl) {
        sanityImage = await uploadImageToSanity(imgUrl);
      }
    }

    // 2. Build Portable Text Body
    const bodyBlocks = entry.body_paragraphs.map((p: string) => ({
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', marks: [], text: p, _key: Math.random().toString(36).substring(7) }]
    }));

    sanityDiaryEntries.push({
      _key: Math.random().toString(36).substring(7),
      _type: 'nikosDiaryEntry',
      location: entry.location,
      title: entry.title,
      body: bodyBlocks,
      verdict: entry.verdict,
      ...(sanityImage ? { image: sanityImage } : {})
    });
  }

  // 3. Patch Destination in Sanity
  await sanity.patch(destination._id)
    .set({ diary_entries: sanityDiaryEntries })
    .commit();
    
  console.log(`✅ Saved ${sanityDiaryEntries.length} diary entries to ${destination.name_en}!`);
}

async function run() {
  console.log('Fetching all destinations without diary entries...');
  const destinations = await sanity.fetch(`*[_type == "destination" && !defined(diary_entries)] { _id, name_en }`);
  console.log(`Found ${destinations.length} destinations to process.`);

  // Process just the first 3 for testing purposes to not hit rate limits massively initially
  // We can increase this later or loop all.
  for (const dest of destinations.slice(0, 3)) {
    await generateDiaryForDestination(dest);
  }
  
  console.log('\n🎉 Finished generating diaries!');
}

run().catch(console.error);
