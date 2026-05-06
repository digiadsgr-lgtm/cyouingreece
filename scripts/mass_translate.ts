import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const sanityClient = createClient({
  projectId: 'sntl6fxn',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-04-18',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const LOCALES = ['de', 'fr', 'it', 'es', 'ro', 'nl', 'no', 'sv', 'da', 'fi', 'el'];

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function translateText(text: string, targetLang: string, retries = 5): Promise<string> {
  if (!text || text.length < 2) return text;
  
  await sleep(4000); 

  const prompt = `Translate the following Greek travel website content into ${targetLang}. 
  Maintain the premium, magazine-style tone. Do not use clichés. 
  Keep any HTML tags or special characters as they are.
  
  Content: "${text}"
  
  Only return the translated text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim().replace(/^"|"$/g, '');
    return response;
  } catch (err: any) {
    if (err.status === 429 && retries > 0) {
      const waitTime = 60000;
      console.log(`  !! Rate limited for ${targetLang}. Retrying in 60s...`);
      await sleep(waitTime);
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
        if (child.text) {
          child.text = await translateText(child.text, lang);
        }
      }
    }
  }
  
  return translatedBlocks;
}

async function translateDestinations() {
  const destinations = await sanityClient.fetch(`*[_type == "destination"] { _id, name_en, tagline, intro_paragraph, body_content, thematic_sections, translations }`);
  console.log(`Found ${destinations.length} destinations.`);

  for (const dest of destinations) {
    console.log(`Processing ${dest.name_en}...`);
    const updates: any = { translations: dest.translations || {} };

    for (const lang of LOCALES) {
      // Logic: Skip if thematic_sections already translated for this lang
      if (updates.translations[lang]?.thematic_sections) {
        console.log(`  -> ${lang} (already translated)`);
        continue;
      }

      console.log(`  -> Translating to ${lang}...`);
      
      const tagline = await translateText(dest.tagline, lang);
      const intro = await translateText(dest.intro_paragraph, lang);
      const body = await translatePortableText(dest.body_content, lang);
      
      // Translate thematic sections
      const translatedSections = [];
      if (dest.thematic_sections) {
        for (const sec of dest.thematic_sections) {
          console.log(`    - Section: ${sec.title}`);
          const secTitle = await translateText(sec.title, lang);
          const secContent = await translatePortableText(sec.content, lang);
          translatedSections.push({
            _key: sec._key,
            title: secTitle,
            content: secContent
          });
        }
      }

      updates.translations[lang] = {
        ...updates.translations[lang],
        tagline: tagline || updates.translations[lang]?.tagline,
        intro_paragraph: intro || updates.translations[lang]?.intro_paragraph,
        body_content: body,
        thematic_sections: translatedSections,
        meta_title: `${dest.name_en} — CYouInGreece`,
        meta_description: tagline || intro?.slice(0, 160),
        ai_translated: true
      };
      
      await sanityClient.patch(dest._id).set({ [`translations.${lang}`]: updates.translations[lang] }).commit();
      console.log(`  ✅ Updated ${lang} for ${dest.name_en}`);
    }
  }
}

async function translateArticles() {
  const articles = await sanityClient.fetch(`*[_type == "article"] { _id, title, excerpt, body, translations }`);
  console.log(`Found ${articles.length} articles.`);

  for (const article of articles) {
    console.log(`Processing Article: ${article.title}...`);
    const updates: any = { translations: article.translations || {} };

    for (const lang of LOCALES) {
      if (updates.translations[lang]?.body_content) {
        continue;
      }

      console.log(`  -> Translating to ${lang}...`);
      const translatedTitle = await translateText(article.title, lang);
      const translatedExcerpt = await translateText(article.excerpt, lang);
      const translatedBody = await translatePortableText(article.body, lang);
      
      updates.translations[lang] = {
        ...updates.translations[lang],
        tagline: translatedTitle,
        intro_paragraph: translatedExcerpt,
        body_content: translatedBody,
        meta_title: translatedTitle,
        meta_description: translatedExcerpt?.slice(0, 160),
        ai_translated: true
      };

      await sanityClient.patch(article._id).set({ [`translations.${lang}`]: updates.translations[lang] }).commit();
      console.log(`  ✅ Updated ${lang} for ${article.title}`);
    }
  }
}

async function main() {
  try {
    await translateDestinations();
    await translateArticles();
    console.log('🎉 FULL THEMATIC TRANSLATION COMPLETED!');
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

main();
