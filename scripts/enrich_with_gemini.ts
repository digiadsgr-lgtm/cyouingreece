import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

const genAI = new GoogleGenerativeAI('AIzaSyCj8jvAk_EsSZrnXaYhVToQZBKsIPTFKRw');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function generateContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
}

async function run() {
  console.log('Fetching all destinations from Sanity...');
  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en, thematic_sections}`);
  
  console.log(`Found ${destinations.length} destinations to enrich.`);

  for (const dest of destinations) {
    console.log(`\n✨ Enriching ${dest.name_en}...`);
    
    // 1. Generate Tagline & Intro
    const tagline = await generateContent(`Write a short, poetic 5-8 word tagline for the Greek destination ${dest.name_en}. Return ONLY the tagline. No quotes.`);
    const intro = await generateContent(`Write a beautiful, immersive, 3-sentence introductory paragraph for a luxury travel magazine about the Greek destination ${dest.name_en}. Focus on aesthetics, light, and atmosphere. Do not use generic tourist phrases.`);
    
    // 2. Update Thematic Sections
    const updatedSections = [];
    if (dest.thematic_sections) {
      for (const section of dest.thematic_sections) {
        const cat = section.category;
        const newText = await generateContent(`Write a beautiful, immersive 3-sentence paragraph describing the ${cat} of ${dest.name_en}, Greece for a premium travel magazine. Make it poetic and specific to ${dest.name_en}.`);
        
        updatedSections.push({
          ...section,
          content: [
            {
              _key: Math.random().toString(),
              _type: "block",
              style: "normal",
              children: [{"_type": "span", "_key": Math.random().toString(), "text": newText}]
            }
          ]
        });
      }
    }

    // 3. Patch Document in Sanity
    try {
      await sanityClient.patch(dest._id)
        .set({
          tagline: tagline || `The magic of ${dest.name_en}`,
          intro_paragraph: intro || dest.intro_paragraph,
          thematic_sections: updatedSections,
          review_status: 'ai_draft'
        })
        .commit();
      
      console.log(`✅ Successfully enriched ${dest.name_en}`);
    } catch (e: any) {
      console.error(`❌ Failed to patch ${dest.name_en}: ${e.message}`);
    }
    
    // Sleep to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n🎉 All destinations have been enriched with Gemini 2.5 Flash!');
}

run();
