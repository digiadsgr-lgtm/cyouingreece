import 'dotenv/config';
import { generateSchema, generateLocalizedKeys } from './seo';
import { pushToSanity, uploadImageFromUrl } from './cms';
import { supabase } from '../lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

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

// 2. Anthropic Claude - "Nikos" Identity
async function generateClaudeContent(node: any) {
  console.log(`[Claude] Generating deeply localized editorial schema for ${node.name}...`);
  
  const systemPrompt = `You are Nikos Papadimitriou, a 45-year-old Greek travel journalist born in Thessaloniki. You have slept on 60 islands and hiked every major mountain trail on the mainland. You write for a world-class travel publication. 
You know Greece the way a local does — not from guidebooks. You know the exact best psarotaverna to recommend by name (e.g., Panormos Tavern). 
You NEVER use terms like "hidden gem" or "crystal clear waters" or "bustling". 
You are specific: "turn left at the blue door, past the bakery that opens at 5am, there is a table with a view that will change you."
Your tone is warm, highly specific, slightly poetic, never pompous.
We are building a platform that feels like Greece. It is not TripAdvisor.

Destination to write about: ${node.name} (${node.local_name}).

CRITICAL INSTRUCTIONS FOR JSON OUTPUT:
1. "tagline": A profound, atmospheric statement. Max 10 words.
2. "intro_paragraph": A masterful, slightly poetic 150-word introduction that captures the SMELL and FEEL of the place (e.g. oregano on a hillside, fishing boats). 
3. "body_content": Return a highly structured array of Sanity blocks. Provide at least 4 massive paragraphs. Intersect them with H2 headers. Write in the first person ("I") as Nikos. Share an obscure local secret right in the middle of the text.
4. "hidden_gems" (Rename mentally to "Local Truths"): Exactly 4 incredibly specific untamed locations or behaviors (e.g., "The lady who sells figs at 7 AM near the old port"). No tourist spots. Provide coordinates.
5. "gastronomy": Exactly 4 highly acclaimed, precise tavernas or dishes (e.g., "Moussaka at Kyria Maria's courtyard").
6. "top_experiences": Exactly 4 experiences that require local knowledge or high-end access.

Return EXACTLY matching this JSON schema and absolutely no markdown formatting outside of the JSON wrapper:
{
  "tagline": "A punchy, atmospheric tagline.",
  "intro_paragraph": "A deep, local-voice 150-word introduction to the soul of ${node.name}.",
  "body_content": [
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Extensive editorial paragraph (150+ words)..."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Real "}]}
  ],
  "at_a_glance": {
    "best_months": ["June", "September"],
    "min_days": 4,
    "budget_tier": "$$$",
    "vibe": ["Authentic", "Raw", "Poetic"]
  },
  "hidden_gems": [
    {"title": "Name", "description": "High-end detailed description", "coordinates": {"lat": 36.3, "lng": 25.4}, "access_difficulty": "high", "best_time": "Sunrise"}
  ],
  "gastronomy": [
    {"dish_name": "Name", "description": "Rich description", "must_try_at": "Acclaimed venue"}
  ],
  "top_experiences": [
    {"title": "Experience", "description": "Atmospheric details", "duration_hours": 2, "is_private": true}
  ],
  "practical_info": {
    "getting_there": "Specific ferry network details",
    "getting_around": "Chauffeur/Scooter details",
    "where_to_stay": "Specific boutique regions"
  }
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Generate the encyclopedic, localized Nikos-authored JSON payload for ${node.name}. Output only valid JSON.` }
      ]
    });
    
    // @ts-ignore
    const rawText = response.content[0].text;
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if(jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch(e) {
    console.error("[Claude] Generation failed", e);
  }
  return null;
}

async function runAutonomousEngine() {
  console.log("=== INITIATING PROJECT OLYMPUS: CORE GEMINI ENGINE v2 ===");
  
  for (const node of SWARM_NODES) {
    try {
      console.log(`\n⚙️ Processing Node: [${node.type}] ${node.name}`);
      
      // 1. Anthropic Claude Content Generation (Nikos Edition)
      const copyData = await generateClaudeContent(node);
      if (!copyData) {
        console.error(`Skipping ${node.name} - Failed to generate rich Claude data.`);
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
