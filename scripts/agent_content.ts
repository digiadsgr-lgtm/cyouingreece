import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const LOCALES = ['el', 'de', 'fr', 'ru'];

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function translateText(text: string, targetLang: string, retries = 3): Promise<string> {
  if (!text || text.trim().length < 2) return text;
  
  await sleep(2000); 

  const prompt = `You are a high-end travel editor. Translate the following content into ${targetLang}. 
  Maintain the premium, magazine-style tone. Do not use clichés. Keep any HTML tags as they are.
  
  Content: "${text}"
  
  Only return the translated text. No pleasantries.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim().replace(/^"|"$/g, '');
    return response;
  } catch (err: any) {
    if (err.status === 429 && retries > 0) {
      console.log(`  !! Rate limited for ${targetLang}. Retrying in 30s...`);
      await sleep(30000);
      return translateText(text, targetLang, retries - 1);
    }
    console.error(`  !! Translation failed for ${targetLang}:`, err.message || err);
    return text;
  }
}

async function translatePortableText(blocks: any[], lang: string) {
  if (!blocks || !Array.isArray(blocks)) return blocks;
  
  const translatedBlocks = JSON.parse(JSON.stringify(blocks));
  
  for (const block of translatedBlocks) {
    if (block._type === 'block' && block.children) {
      for (const child of block.children) {
        if (child.text && child.text.trim().length > 0) {
          child.text = await translateText(child.text, lang);
        }
      }
    }
  }
  return translatedBlocks;
}

// Check if a string is considered "missing" or "empty" (including failed empty strings from previous scripts)
const isMissing = (val: any) => !val || (typeof val === 'string' && val.trim().length < 5);

async function runContentAgent() {
  console.log('🤖 CONTENT & TRANSLATION AGENT INITIALIZED');
  console.log('Scanning Sanity Database for missing or corrupted translations...\n');

  const destinations = await sanityClient.fetch(`*[_type == "destination"] { _id, name_en, tagline, intro_paragraph, body_content, thematic_sections, translations }`);
  console.log(`Found ${destinations.length} destinations to check.`);

  for (const dest of destinations) {
    const updates: any = { translations: dest.translations || {} };
    let hasChanges = false;

    console.log(`\n🔍 Checking: ${dest.name_en}`);

    for (const lang of LOCALES) {
      if (!updates.translations[lang]) {
        updates.translations[lang] = {};
      }
      
      const tl = updates.translations[lang];
      
      // If intro_paragraph is missing or empty string, we need to translate!
      if (isMissing(tl.intro_paragraph)) {
        console.log(`  -> [${lang}] Healing intro_paragraph...`);
        tl.intro_paragraph = await translateText(dest.intro_paragraph, lang);
        hasChanges = true;
      }
      
      if (isMissing(tl.tagline)) {
        console.log(`  -> [${lang}] Healing tagline...`);
        tl.tagline = await translateText(dest.tagline, lang);
        hasChanges = true;
      }

      // If body content is totally missing or very short
      if (!tl.body_content || tl.body_content.length === 0) {
        console.log(`  -> [${lang}] Healing body_content (PortableText)...`);
        tl.body_content = await translatePortableText(dest.body_content, lang);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      console.log(`  ⬆️ Pushing healed translations for ${dest.name_en}...`);
      try {
        await sanityClient.patch(dest._id).set({ translations: updates.translations }).commit();
        console.log(`  ✅ Successfully updated ${dest.name_en}`);
      } catch (e: any) {
        console.error(`  ❌ Failed to patch ${dest.name_en}:`, e.message);
      }
    } else {
      console.log(`  ✅ All requested locales are healthy.`);
    }
  }
  
  console.log('\n🎉 CONTENT AGENT HAS FINISHED ITS PATROL.');
}

runContentAgent();
