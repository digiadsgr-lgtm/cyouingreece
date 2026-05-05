import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURATION ---
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBEPIjJZvlHpe7H-cAMccFa9YMoNiQ3Otc');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- AGENT PERSONA ---
const EDITOR_IN_CHIEF_PROMPT = `
You are the Experience Editor-in-Chief of "The Golden Guide" (CYouInGreece).
You have 50 years of experience in high-end travel journalism (Conde Nast, National Geographic).
You have a background in TV production and travel psychology.
Your writing is:
- Magnetic: It pulls the reader in.
- Encyclopedic: Dense with real facts, names of places, and specific local terms.
- Psychological: You understand that people travel to find themselves, to escape, or to connect.
- No Clichés: Never use "hidden gem", "breathtaking", "crystal clear waters", or "stunning views". Use specific, evocative descriptions.
- Structured: You are highly organized and demand perfection in data.

Your goal is to enrich the Greek destination: `;

// --- CATEGORIES ---
const MANDATORY_CATEGORIES = [
  { category: 'Gastronomy', title: 'The Gastronomic Soul' },
  { category: 'Culture', title: 'The Cultural Tapestry' },
  { category: 'Churches', title: 'The Sacred Silence' },
  { category: 'Museums', title: 'The Ancient Whisper' },
  { category: 'Beaches', title: 'The Azure Shoreline' },
  { category: 'Hiking', title: 'The Ancient Trails' },
  { category: 'Mountaineering', title: 'The Alpine Peaks' }
];

async function generateWithGemini(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err: any) {
      console.error(`Gemini Generation Error (Attempt ${i + 1}/${retries}):`, err.message || err);
      if (err?.status === 429 || err?.message?.includes('429')) {
        console.log("⏳ Rate limit hit. Sleeping for 30 seconds before retrying...");
        await new Promise(r => setTimeout(r, 30000));
        continue;
      }
      return null;
    }
  }
  return null;
}

async function getJSONFromGemini(prompt: string) {
  try {
    const result = await generateWithGemini(prompt + "\nReturn ONLY valid JSON. No markdown backticks. No talk.");
    if (!result) return null;
    const clean = result.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON Parse Error:", err);
    return null;
  }
}

async function enrichDestination(dest: any, allDestinations: any[]) {
  console.log(`\n👨‍🎨 Editor-in-Chief is auditing: ${dest.name_en}...`);

  
  const personaPrefix = EDITOR_IN_CHIEF_PROMPT + dest.name_en + ".\n\n";

  // 1. Generate Narrative Content
  console.log("   - Drafting the Narrative...");
  const narrativeData = await getJSONFromGemini(personaPrefix + `
    Generate the following fields in JSON:
    - tagline: A punchy, evocative 8-word max headline.
    - intro: A 100-word immersive introductory paragraph.
    - nikosDiary: An array of 3 objects representing diary entries from 'Nikos', the local concierge. Each object must have:
        - location: Specific beach, bar, or village name.
        - title: A catchy short title.
        - bodyText: A dense 50-word paragraph full of smells, sounds, and secrets.
        - verdict: A 1-sentence TL;DR summary or ultimate tip.
    - hiddenGems: An array of 3 objects {title, description} that are NOT famous landmarks.
    - experiences: An array of 3-5 objects {title, description} that are high-level activities.
    - gastronomySpotlight: An array of 3 objects {dish_name, where_to_find, description}.
  `);

  if (!narrativeData) return;

  // 2. Generate Thematic Sections
  console.log("   - Expanding Thematic Sections...");
  const thematicSections = [];
  for (const cat of MANDATORY_CATEGORIES) {
    const sectionContent = await generateWithGemini(personaPrefix + `
      Write a 150-word deep-dive editorial section for the category "${cat.category}".
      Be specific to ${dest.name_en}. Mention specific names of villages, beaches, churches, or paths.
      If the category is "Activities", focus on Hiking and Mountaineering.
      If the category is "Nature", focus on Beaches and the physical landscape.
      Use a sophisticated, magazine-style tone.
    `);

    if (sectionContent) {
      thematicSections.push({
        _key: Math.random().toString(36).substring(7),
        _type: 'thematicSection',
        category: cat.category,
        title: narrativeData.thematicTitles?.[cat.category] || cat.title,
        content: [
          {
            _key: Math.random().toString(36).substring(7),
            _type: "block",
            style: "normal",
            children: [{"_type": "span", "_key": Math.random().toString(36).substring(7), "text": sectionContent}]
          }
        ],
        // Image will be filled by another process or manual curation for quality
      });
    }
  }

  // 3. Official Links, Practical Info & Interconnectivity
  console.log("   - Sourcing Practical Intelligence & Interconnectivity...");
  const validDestinationNames = allDestinations.map((d: any) => d.name_en).join(', ');
  
  const practicalData = await getJSONFromGemini(personaPrefix + `
    Provide practical info for ${dest.name_en} in JSON:
    - official_website: The official municipality or regional tourism site URL (or null).
    - best_time: One sentence.
    - difficulty: 'Low', 'Medium', or 'High' based on accessibility.
    - youtube_url: Provide a realistic YouTube URL for a high-quality travel documentary or 4K drone video of ${dest.name_en}. (e.g., https://www.youtube.com/watch?v=...)
    - nearby_destinations: Pick 2-4 EXACT names from this list that are geographically closest or logistically connected to ${dest.name_en}: [${validDestinationNames}]. Return an array of strings.
  `);

  if (!practicalData) {
    console.error(`❌ Sourcing Practical Intelligence failed for ${dest.name_en}. Aborting commit to prevent partial data.`);
    return;
  }

  // Map nearby destination names to their Sanity _id references
  let nearbyRefs: any[] = [];
  if (practicalData?.nearby_destinations && Array.isArray(practicalData.nearby_destinations)) {
    nearbyRefs = practicalData.nearby_destinations
      .map((name: string) => allDestinations.find((d: any) => d.name_en === name))
      .filter(Boolean)
      .map((d: any) => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'reference',
        _ref: d._id
      }));
  }

  // 4. Update Sanity
  console.log(`   - Committing the Masterpiece to Sanity...`);
  try {
    const patchData: any = {
      tagline: narrativeData.tagline,
      intro_paragraph: narrativeData.intro,
      diary_entries: narrativeData.nikosDiary.map((entry: any) => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'nikosDiaryEntry',
        location: entry.location,
        title: entry.title,
        body: [{
          _type: "block",
          style: "normal",
          _key: Math.random().toString(36).substring(7),
          children: [{"_type": "span", "_key": Math.random().toString(36).substring(7), "text": entry.bodyText}]
        }],
        verdict: entry.verdict
      })),
      hidden_gems: narrativeData.hiddenGems.map((gem: any) => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'hiddenGem',
        ...gem
      })),
      top_experiences: narrativeData.experiences.map((exp: any) => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'experience',
        ...exp
      })),
      gastronomy: narrativeData.gastronomySpotlight.map((item: any) => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'gastronomyItem',
        ...item
      })),
      thematic_sections: thematicSections,
      practical_info: {
        _type: 'practicalInfo',
        official_website: practicalData?.official_website,
        best_time_to_visit: practicalData?.best_time,
        difficulty_level: practicalData?.difficulty
      },
      nearby_destinations: nearbyRefs.length > 0 ? nearbyRefs : undefined,
      youtube_video_url: practicalData?.youtube_url,
      review_status: 'needs_review',
      ai_generated: true,
      last_reviewed: new Date().toISOString().split('T')[0]
    };

    await sanityClient.patch(dest._id).set(patchData).commit();
    console.log(`✅ ${dest.name_en} is now an Editorial Masterpiece.`);
  } catch (e: any) {
    console.error(`❌ Audit failed for ${dest.name_en}: ${e.message}`);
  }
}

async function main() {
  console.log("🚀 EXPERIENCE EDITOR-IN-CHIEF IS NOW ON DUTY.");
  console.log("-------------------------------------------------");
  
  // Fetch ALL destinations for interconnectivity mapping
  const allDestinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en, review_status}`);
  
  // Filter only those that need enrichment
  const destinationsToProcess = allDestinations.filter((d: any) => d.review_status === 'ai_draft');
  
  console.log(`Found ${allDestinations.length} total destinations. ${destinationsToProcess.length} left to master.`);

  for (const dest of destinationsToProcess) {
    await enrichDestination(dest, allDestinations);
    // Respectful wait for API
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log("\n🏁 SHIFT COMPLETE. THE GOLDEN GUIDE HAS BEEN ELEVATED.");
}

main();
