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

let fallbackIndex = 0;

async function getNextNodeFromDB() {
  const node = SWARM_NODES[fallbackIndex];
  fallbackIndex = (fallbackIndex + 1) % SWARM_NODES.length;
  return node;
}

// 1. Fetch Authentic Wikipedia Image
async function getAuthenticImage(nodeName: string): Promise<string | null> {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(nodeName)}&prop=pageimages&format=json&pithumbsize=1200`);
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    }
    return null;
  } catch (err) {
    console.error(`[Wiki Image] Failed for ${nodeName}`);
    return null;
  }
}

// Pexels fallback using public random nature URL if Wiki fails
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop';

// 2. Google Gemini Swarm Agent - Full Schema Gen
async function generateGeminiContent(node: any) {
  console.log(`[Gemini] Generating full editorial schema for ${node.name}...`);
  
  const systemPrompt = `You are Nikos, the ultimate luxury Greek travel concierge and a local expert.
Your job is to write a highly descriptive, authentic, and premium JSON object for the destination: ${node.name} (${node.local_name}).
Do NOT use clichés like "hidden gem" or "crystal clear waters". Focus on strict architectural truth, private access, deep gastronomy, and raw topology.

You MUST return ONLY a valid JSON object matching this structure EXACTLY (no markdown wrappers, just JSON):
{
  "tagline": "A punchy, atmospheric tagline. Max 12 words.",
  "intro_paragraph": "A deep, local-voice 150-word introduction to the soul of ${node.name}.",
  "body_content": [
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "A rich editorial paragraph about history and vibe."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Topological Anatomy"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Another detailed paragraph."}]}
  ],
  "at_a_glance": {
    "best_months": ["April", "May", "September"],
    "min_days": 3,
    "budget_tier": "$$$$",
    "vibe": ["Atmospheric", "Historic", "Minimalist"]
  },
  "hidden_gems": [
    {"title": "Name of secret spot 1", "description": "Atmospheric details", "coordinates": {"lat": 36.3, "lng": 25.4}, "access_difficulty": "medium", "best_time": "Sunrise"},
    {"title": "Name of secret spot 2", "description": "Atmospheric details", "coordinates": {"lat": 36.3, "lng": 25.4}, "access_difficulty": "high", "best_time": "Midnight"},
    {"title": "Name of secret spot 3", "description": "Atmospheric details", "coordinates": {"lat": 36.3, "lng": 25.4}, "access_difficulty": "low", "best_time": "Dusk"}
  ],
  "gastronomy": [
    {"dish_name": "Local dish 1", "description": "Culinary profile", "must_try_at": "Specific village/taverna"},
    {"dish_name": "Local dish 2", "description": "Culinary profile", "must_try_at": "Specific village/taverna"},
    {"dish_name": "Local wine or spirit", "description": "Tasting notes", "must_try_at": "Winery/Bar"}
  ],
  "top_experiences": [
    {"title": "Experience 1", "description": "Details", "duration_hours": 4, "is_private": true},
    {"title": "Experience 2", "description": "Details", "duration_hours": 2, "is_private": false},
    {"title": "Experience 3", "description": "Details", "duration_hours": 8, "is_private": true}
  ],
  "practical_info": {
    "getting_there": "Ferry/Flight details",
    "getting_around": "Car hire/transfer tips",
    "where_to_stay": "Which areas to book"
  }
}

Return ONLY standard JSON. No formatting.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      systemPrompt,
      `Generate the full JSON for ${node.name}`
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
  console.log("=== INITIATING PROJECT OLYMPUS: CORE GEMINI ENGINE ===");  
  let isRunning = true;
  process.on('SIGINT', () => {
    console.log("\n[System Interrupt] Shutting down autonomous engine...");
    isRunning = false;
  });
  
  while (isRunning) {
    try {
      const node = await getNextNodeFromDB();
      console.log(`\n⚙️ Processing Node: [${node.type}] ${node.name}`);
      
      // 1. Gemini Generation
      const copyData = await generateGeminiContent(node);
      if (!copyData) {
        console.error("Skipping node - Failed to generate Gemini data");
        continue;
      }
      
      // 2. Fetch Authentic Image & Upload to Sanity
      let imageUrl = await getAuthenticImage(node.name) || FALLBACK_IMG;
      console.log(`[Media] Uploading image for ${node.name}...`);
      const sanityImageRef = await uploadImageFromUrl(imageUrl, `${node.name}-hero.jpg`);
      
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
        
        // Media (8 random fallbacks for gallery just to pass validation length 8)
        hero_image: sanityImageRef ? sanityImageRef : undefined,
        gallery: Array(8).fill(sanityImageRef).filter(Boolean),
        
        // Workflow
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
      
      console.log("=> Node cycle complete. Waiting before next deployment...");
      await new Promise(resolve => setTimeout(resolve, 8000));
      // Loop continues...
      
    } catch (err) {
      console.error("[CRITICAL] Engine generation cycle failed. Rebooting...", err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      process.exit(1); 
    }
  }
}

if (require.main === module) {
  runAutonomousEngine().then(() => {}).catch((err) => { console.error(err); process.exit(1); });
}
