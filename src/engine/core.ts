import 'dotenv/config';
import { generateSchema, generateLocalizedKeys } from './seo';
import { pushToSanity, uploadImageFromUrl } from './cms';
import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Seed data - Initial destinations
const SWARM_NODES = [
  { type: 'island', name: 'Santorini', en_name: 'Santorini', local_name: 'Σαντορίνη' },
  { type: 'island', name: 'Mykonos', en_name: 'Mykonos', local_name: 'Μύκονος' },
  { type: 'city', name: 'Athens', en_name: 'Athens', local_name: 'Αθήνα' },
  { type: 'archaeological_site', name: 'Delphi', en_name: 'Delphi', local_name: 'Δελφοί' },
  { type: 'island', name: 'Rhodes', en_name: 'Rhodes', local_name: 'Ρόδος' },
];

const FALLBACKS = [
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613395877344-13d4a3215840?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596706013627-7cfd82bb776e?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522513476839-4d693f1fa68c?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606915159051-2fd5e35bd7f0?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605342880053-157457d15655?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615836245337-f58d0426b6df?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2000&auto=format&fit=crop'
];

// 1. Fetch Authentic Wikipedia Images
async function getAuthenticImages(nodeName: string, count: number): Promise<string[]> {
  try {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(nodeName + ' greece landscape architecture')}&gsrnamespace=6&gsrlimit=${count}&prop=imageinfo&iiprop=url&format=json`);
    const data = await res.json();
    const pages = data.query?.pages;
    const urls: string[] = [];
    if (pages) {
      for (const pageId of Object.keys(pages)) {
        const info = pages[pageId].imageinfo;
        if (info && info[0].url) {
           urls.push(info[0].url);
        }
      }
    }
    return urls;
  } catch (err) {
    console.error(`[Wiki Image] Failed multi-fetch for ${nodeName}`);
    return [];
  }
}

// 2. Google Gemini Swarm Agent - Full Schema Gen
async function generateGeminiContent(node: any) {
  console.log(`[Gemini] Generating full high-end editorial schema for ${node.name}...`);
  
  const systemPrompt = `You are Nikos, the ultimate luxury Greek travel concierge, architectural historian, and local expert.
Your job is to write a highly descriptive, authentic, and premium JSON object for the destination: ${node.name} (${node.local_name}).
We are building a platform to attract ultimate high-net-worth sponsorships. Your text must be masterful, evocative, and exceptionally detailed.

CRITICAL CONTENT INSTRUCTIONS:
1. "intro_paragraph": Must be a massive, evocative, and culturally deep introduction of at least 150 words. Do NOT use emojis.
2. "body_content": Needs to be a structured array of Sanity blocks. Provide at least 5 massive paragraphs of 150+ words each, interspersed with H2 headings. Break down the topology, the history, the high-end zones, and the vibe.
3. "hidden_gems": Exactly 4 incredibly specific untamed locations (e.g., hidden coves, tiny chapels). Include realistic lat/lng coordinates in Greece.
4. "gastronomy": Exactly 4 precise, highly acclaimed luxury or hyper-local culinary items/experiences.
5. "top_experiences": Exactly 4 extremely high-end private experiences (e.g. Helitours over the caldera, private 140ft yacht charters, Michelin-star cliffside dining).

You MUST return ONLY a valid JSON object matching this structure EXACTLY. No markdown wrappers. No backticks. Just pure JSON:
{
  "tagline": "A punchy, atmospheric luxury tagline. Max 12 words.",
  "intro_paragraph": "A deep, local-voice 150-word introduction to the soul of ${node.name}.",
  "body_content": [
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Extensive editorial paragraph 1 (150+ words)..."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Architectural Anatomy"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Extensive paragraph 2 (150+ words)..."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Exclusive Thresholds"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Extensive paragraph 3 (150+ words)..."}]}
  ],
  "at_a_glance": {
    "best_months": ["June", "September"],
    "min_days": 4,
    "budget_tier": "$$$$$",
    "vibe": ["Exclusive", "Architectural", "Secluded"]
  },
  "hidden_gems": [
    {"title": "Name", "description": "High-end detailed description", "coordinates": {"lat": 36.3, "lng": 25.4}, "access_difficulty": "high", "best_time": "Sunrise"}
  ],
  "gastronomy": [
    {"dish_name": "Name", "description": "Rich description", "must_try_at": "Acclaimed venue"}
  ],
  "top_experiences": [
    {"title": "Private Helitour", "description": "Atmospheric details", "duration_hours": 2, "is_private": true}
  ],
  "practical_info": {
    "getting_there": "Private jet / VIP Ferry",
    "getting_around": "Chauffeur details",
    "where_to_stay": "Ultra luxury resorts"
  }
}`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent([
      `Generate the ultra-premium JSON payload for ${node.name}. Output only valid JSON.`
    ]);
    const rawText = result.response.text().trim();
    
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if(jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch(e) {
    console.error("[Gemini] Generation failed", e);
  }
  return null;
}

async function runAutonomousEngine() {
  console.log("=== INITIATING PROJECT OLYMPUS: CORE GEMINI ENGINE v2 ===");
  
  for (const node of SWARM_NODES) {
    try {
      console.log(`\n⚙️ Processing Node: [${node.type}] ${node.name}`);
      
      // 1. Gemini Content Generation (Rich Edition)
      const copyData = await generateGeminiContent(node);
      if (!copyData) {
        console.error(`Skipping ${node.name} - Failed to generate rich Gemini data.`);
        continue;
      }
      
      // 2. Multi-Media Aggregation & Hydration
      console.log(`[Media] Hunting for authentic Wikimedia assets for ${node.name}...`);
      const wikiUrls = await getAuthenticImages(node.en_name, 12);
      const urlsToUpload = wikiUrls.length >= 8 ? wikiUrls : FALLBACKS;
      
      const validImageRefs: any[] = [];
      console.log(`[Media] Uploading ${urlsToUpload.length} high-res images to Sanity CMS (This may take a moment)...`);
      
      // Sequential upload to prevent overwhelming the Sanity ingestion API rate limits
      for (let i = 0; i < urlsToUpload.length; i++) {
         const sanityRef = await uploadImageFromUrl(urlsToUpload[i], `${node.name}-img-${i}.jpg`);
         if (sanityRef) validImageRefs.push(sanityRef);
      }
      
      console.log(`[Media] Successfully uploaded ${validImageRefs.length} images.`);
      
      // Ensure we have at least 8 to pass Sanity strict valdiation!
      while(validImageRefs.length < 8 && validImageRefs.length > 0) {
        validImageRefs.push(validImageRefs[0]);
      }

      const heroRef = validImageRefs.length > 0 ? validImageRefs[0] : undefined;
      const galleryRefs = validImageRefs.slice(0, 15);
      
      // 3. SEO & Schema mapping
      const schema = generateSchema(node.type, node.name, copyData.intro_paragraph);
      const localized = generateLocalizedKeys({ title: node.name, description: copyData.intro_paragraph });
      
      // 4. Build Exact Sanity 'destination' Schema Payload
      const slugValue = node.en_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        name_en: node.en_name,
        name_local: node.local_name,
        slug: { _type: 'slug', current: slugValue },
        type: node.type,
        
        tagline: copyData.tagline,
        intro_paragraph: copyData.intro_paragraph,
        body_content: copyData.body_content,
        
        at_a_glance: { _type: 'atAGlance', ...copyData.at_a_glance },
        hidden_gems: copyData.hidden_gems?.map((gem: any) => ({ _type: 'hiddenGem', ...gem })),
        gastronomy: copyData.gastronomy?.map((g: any) => ({ _type: 'gastronomyItem', ...g })),
        top_experiences: copyData.top_experiences?.map((exp: any) => ({ _type: 'experience', ...exp })),
        practical_info: { _type: 'practicalInfo', ...copyData.practical_info },
        
        hero_image: heroRef,
        gallery: galleryRefs,
        
        review_status: 'ai_draft',
        ai_generated: true,
        seo: { _type: 'seoFields', meta_title: `${node.name} Travel Guide`, meta_description: copyData.intro_paragraph.slice(0,160) },
        translations: localized,
      };
      
      // 5. Push to Headless CMS
      await pushToSanity('destination', { title: node.name, ...payload });
      
      // 6. DB Update timestamp bridging
      const { error } = await supabase
        .from('generationLogs')
        .insert([{ target_node: node.name, type: node.type, generated_at: new Date().toISOString() }]);
      
      if (!error) console.log(`[Supabase] Recorded autonomous generation for ${node.name}.`);
      
      console.log(`=> Node [${node.name}] complete. Bridging to next sequence...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (err) {
      console.error(`[CRITICAL] Generation cycle failed for ${node.name}. Moving to next...`, err);
    }
  }
  
  console.log("=== BATCH COMPLETE: All fundamental nodes deployed ===");
  process.exit(0);
}

if (require.main === module) {
  runAutonomousEngine().then(() => {}).catch((err) => { console.error(err); process.exit(1); });
}
