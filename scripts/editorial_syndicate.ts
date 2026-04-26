import { createClient } from '@sanity/client';
import OpenAI from 'openai';
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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
    console.error(`[VISUAL DIRECTOR] Error fetching for "${query}":`, error);
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<any> {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const asset = await sanity.assets.upload('image', Buffer.from(buffer), { filename: `${filename}.jpg` });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (err) {
    console.error(`[PUBLISHER] Upload error for ${filename}:`, err);
    return null;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// AGENT PROMPTS
// ──────────────────────────────────────────────────────────────────────────────

const WRITER_PROMPT = `
You are the "Gonzo Journalist" for an elite, raw, Anthony Bourdain-esque travel magazine. 
Your writing must be highly opinionated, visceral, and slightly edgy. 
You despise tourist traps. You care about the smell of diesel on the ferry, the harsh sunlight, the grit, the authentic locals, and the unpretentious food.

RULES:
1. NEVER use these forbidden words: "hidden gem", "crystal clear", "stunning", "breathtaking", "picturesque", "must-see", "vibrant".
2. Be hyper-specific. Name specific dishes, specific streets, specific times of day.
3. Don't be overly positive. If a place is loud and chaotic, say it. If a beach is ruined by umbrellas, say it.

OUTPUT FORMAT (JSON ONLY):
{
  "diary_entries": [ { "location": "", "title": "", "body_paragraphs": ["...", "..."], "verdict": "", "unsplash_query": "specific photo search term" } x 3 ],
  "hidden_gems": [ { "title": "", "description": "", "location_hint": "", "unsplash_query": "" } x 3 ],
  "gastronomy": [ { "name": "", "type": "", "description": "", "price_level": "€ to €€€€", "unsplash_query": "" } x 3 ],
  "top_experiences": [ { "title": "", "description": "", "duration": "", "unsplash_query": "" } x 3 ]
}
`;

const EDITOR_PROMPT = `
You are the "Chief Editor" of a Conde Nast / Monocle style publication. 
Your job is to audit the JSON content provided by the Writer.
Check for cliches: "hidden gem", "crystal clear", "breathtaking".
If the content feels generic, "vanilla", or like a standard Lonely Planet guide, you MUST REJECT IT.
Return JSON:
{
  "approved": boolean,
  "feedback": "string explaining exactly what needs to be fixed if rejected"
}
`;

// ──────────────────────────────────────────────────────────────────────────────
// THE SYNDICATE PIPELINE
// ──────────────────────────────────────────────────────────────────────────────

async function generateContentWithSyndicate(destName: string) {
  let attempt = 1;
  const maxAttempts = 3;

  while (attempt <= maxAttempts) {
    console.log(`\n📝 [WRITER AGENT] Drafting piece for ${destName} (Attempt ${attempt})...`);
    
    // Writer generates
    const writerRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: WRITER_PROMPT },
        { role: 'user', content: `Write an insider, gritty, elite piece about: ${destName}` }
      ],
      response_format: { type: 'json_object' }
    });

    const draftText = writerRes.choices[0].message.content || '{}';

    console.log(`🕵️‍♂️ [CHIEF EDITOR AGENT] Auditing the draft...`);
    // Editor audits
    const editorRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: EDITOR_PROMPT },
        { role: 'user', content: `Review this draft for ${destName}:\n\n${draftText}` }
      ],
      response_format: { type: 'json_object' }
    });

    const audit = JSON.parse(editorRes.choices[0].message.content || '{"approved": false}');

    if (audit.approved) {
      console.log(`✅ [CHIEF EDITOR AGENT] Draft APPROVED!`);
      return JSON.parse(draftText);
    } else {
      console.log(`❌ [CHIEF EDITOR AGENT] Draft REJECTED. Feedback: ${audit.feedback}`);
      attempt++;
    }
  }

  throw new Error('Editorial Syndicate failed to produce acceptable content after 3 attempts.');
}

async function processDestination(dest: any) {
  console.log(`\n=================================================`);
  console.log(`🏛️ PUBLISHER: Starting pipeline for ${dest.name_en}`);
  console.log(`=================================================`);

  // If we don't have OpenAI keys, we'll try to read a static mock file for demo purposes
  let content: any = {};
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-key-here') {
    console.log(`⚠️ [SYSTEM] No valid OpenAI API key found. Bypassing Syndicate and reading local static file...`);
    const fs = await import('fs/promises');
    content = JSON.parse(await fs.readFile(path.join(process.cwd(), 'scripts', `${dest.slug.current}_content.json`), 'utf-8'));
  } else {
    content = await generateContentWithSyndicate(dest.name_en);
  }

  console.log(`📸 [VISUAL DIRECTOR AGENT] Sourcing imagery from Unsplash...`);
  
  let heroImage = dest.hero_image;
  if (!heroImage?.asset) {
    const heroUrl = await fetchUnsplashImage(`${dest.name_en} island greece landscape sunset`);
    if (heroUrl) {
      heroImage = await uploadImageToSanity(heroUrl, `hero-${dest.slug.current}`);
      await delay(1000);
    }
  }

  // Generic helper to process arrays and attach photos
  const processArray = async (items: any[], type: string, prefix: string) => {
    const output = [];
    for (const item of (items || [])) {
      let img = null;
      if (item.unsplash_query) {
        const url = await fetchUnsplashImage(`${item.unsplash_query} ${dest.name_en}`);
        if (url) img = await uploadImageToSanity(url, `${prefix}-${dest.slug.current}-${Date.now()}`);
        await delay(1000);
      }
      // Reconstruct specific objects based on schema
      let sanityObj: any = { _key: Math.random().toString(36).substring(7), _type: type };
      if (type === 'nikosDiaryEntry') {
        sanityObj.location = item.location;
        sanityObj.title = item.title;
        sanityObj.verdict = item.verdict;
        sanityObj.body = item.body_paragraphs.map((p: string) => ({
          _type: 'block', _key: Math.random().toString(36).substring(7), style: 'normal', markDefs: [],
          children: [{ _type: 'span', marks: [], text: p, _key: Math.random().toString(36).substring(7) }]
        }));
      } else if (type === 'hiddenGem') {
        sanityObj.title = item.title;
        sanityObj.description = item.description;
        sanityObj.location_hint = item.location_hint;
      } else if (type === 'gastronomyItem') {
        sanityObj.name = item.name;
        sanityObj.type = item.type;
        sanityObj.description = item.description;
        sanityObj.price_level = item.price_level;
      } else if (type === 'experience') {
        sanityObj.title = item.title;
        sanityObj.description = item.description;
        sanityObj.duration = item.duration;
      }
      if (img) sanityObj.image = img;
      output.push(sanityObj);
    }
    return output;
  };

  const diary_entries = await processArray(content.diary_entries, 'nikosDiaryEntry', 'diary');
  const hidden_gems = await processArray(content.hidden_gems, 'hiddenGem', 'gem');
  const gastronomy = await processArray(content.gastronomy, 'gastronomyItem', 'food');
  const top_experiences = await processArray(content.top_experiences, 'experience', 'exp');

  console.log(`📤 [PUBLISHER AGENT] Patching data to Sanity Production DB...`);
  await sanity.patch(dest._id)
    .set({
      ...(heroImage?.asset ? { hero_image: heroImage } : {}),
      diary_entries,
      hidden_gems,
      gastronomy,
      top_experiences
    })
    .commit();

  console.log(`✅ [SYSTEM] Workflow complete for ${dest.name_en}`);
}

async function run() {
  const destinations = await sanity.fetch(`*[_type == "destination" && slug.current == "paros"] {
    _id, name_en, slug, hero_image
  }`);

  if (destinations.length === 0) return console.log('🎉 All destinations processed!');

  console.log(`RATE LIMIT SAFETY: Processing ONLY 1 destination per run.`);
  await processDestination(destinations[0]);
}

run().catch(console.error);
