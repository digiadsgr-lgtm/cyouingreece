import 'dotenv/config';
import { generateSchema, generateLocalizedKeys } from './seo';
import { pushToSanity } from './cms';
import { supabase } from '../lib/supabase';

// ELITE DETERMINISTIC REGISTRY (100% Accurate & Curated)
const SWARM_NODES = [
  { type: 'Island', name: 'Santorini', facts: 'Volcanic caldera, infinite white architecture, iconic blue domes in Oia over the deepest Aegean blue.', img: 'https://images.unsplash.com/photo-1613395877344-13d4a3215840?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Mykonos', facts: 'Pristine Cycladic windmills, minimalist luxury, elite gastronomy, bare granite landscapes contrasting with absolute white.', img: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed2a?q=80&w=2000&auto=format&fit=crop' },
  { type: 'POIRegion', name: 'Zakynthos (Navagio)', facts: 'Iconic shipwreck resting on pure white limestone sand, surrounded by towering vertical cliffs and neon-blue Ionian waters.', img: 'https://images.unsplash.com/photo-1522513476839-4d693f1fa68c?q=80&w=2000&auto=format&fit=crop' },
  { type: 'POI', name: 'Meteora', facts: 'Eastern Orthodox monasteries suspended on immense natural sandstone pillars. Misty, spiritual terrain reaching into the clouds.', img: 'https://images.unsplash.com/photo-1564074218321-df54c46fcf82?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Region', name: 'Athens Riviera', facts: 'The cradle of Western civilization seamlessly merging with modern luxury yachts, the Acropolis glowing against deep warm sunsets.', img: 'https://images.unsplash.com/photo-1555998951-ab77227d819c?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Milos', facts: 'Sarakiniko beach featuring lunar-like white volcanic rock formations sweeping organically into the sea.', img: 'https://images.unsplash.com/photo-1620059345719-f54f15d7f27b?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Crete (Balos)', facts: 'Wild terrain, pink sand lagoons, Minoan palaces. A massive rugged island possessing entirely its own autonomous culture.', img: 'https://images.unsplash.com/photo-1528659109033-02fdb838dc86?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Rhodes', facts: 'Perfectly preserved imposing Medieval old town, ancient Acropolis of Lindos, crusader-era cobblestones.', img: 'https://images.unsplash.com/photo-1606915159051-2fd5e35bd7f0?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Symi', facts: 'Neoclassical pastel mansions cascading rhythmically down the steep mountain into a pristine, silent harbor.', img: 'https://images.unsplash.com/photo-1627993424177-3e11736b4ff0?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Region', name: 'Pelion', facts: 'Mountain of the Centaurs. Lush, ancient forests descending steeply and directly into hidden turquoise coves.', img: 'https://images.unsplash.com/photo-1596489390234-fc02a94fe9eb?q=80&w=2000&auto=format&fit=crop' }
];

let fallbackIndex = 0;

async function getNextNodeFromDB() {
  const node = SWARM_NODES[fallbackIndex];
  fallbackIndex = (fallbackIndex + 1) % SWARM_NODES.length;
  return node;
}

// Swarm Copywriter Bypass (generating high-end JSON mock directly without Gemini API)
function localWrite(nodeName: string, facts: string) {
  return {
    title: `${nodeName} — Curated Sanctuary`,
    description: `An immersive narrative of ${nodeName}, blending absolute aesthetic minimalism with its raw geological truth. ${facts} A sanctuary where deep cultural heritage intersects seamlessly with modern escapism. Experience the definitive Hellenic vibration.`,
    bulletPoints: ["Exclusive gastronomic footprint", "Preserved topological isolation", "Private cultural intersections", "Aesthetic architectural mastery"]
  };
}

async function runAutonomousEngine() {
  console.log("=== INITIATING CYOUINGREECE SWARM ENGINE (INFINITE PIPELINE) ===");
  
  let isRunning = true;
  process.on('SIGINT', () => {
    console.log("\n[System Interrupt] Shutting down autonomous engine...");
    isRunning = false;
  });
  
  while (isRunning) {
    try {
      const node = await getNextNodeFromDB();
      console.log(`\n⚙️ Processing Node: [${node.type}] ${node.name}`);
      
      // 1. Swarm Copywriting Bypass
      const copyData = localWrite(node.name, node.facts);
      
      // 2. SEO & Schema mapping
      const schema = generateSchema(node.type, node.name, copyData.description);
      const localized = generateLocalizedKeys(copyData);
      
      const payload = {
        name: node.name,
        ...localized.en,
        seoSchema: JSON.stringify(schema),
        heroImage: node.img, // Using our highly curated Unsplash swarms
        translations: localized,
        updatedAt: new Date().toISOString()
      };
      
      // 3. Push to Headless CMS
      await pushToSanity(node.type, payload);
      
      // 4. DB Update timestamp bridging
      if (node.type && node.name) {
          const { error } = await supabase
            .from('generationLogs')
            .insert([{ target_node: node.name, type: node.type, generated_at: new Date().toISOString() }]);
          
          if (!error) {
             console.log(`[Supabase] Recorded autonomous generation for ${node.name}.`);
          }
      }
      
      console.log("=> Node cycle complete. Waiting before next deployment...");
      await new Promise(resolve => setTimeout(resolve, 8000)); // 8 seconds per node
      
    } catch (err) {
      console.error("[CRITICAL] Engine generation cycle failed. Rebooting...", err);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

if (require.main === module) {
  runAutonomousEngine().then(() => {}).catch((err) => { console.error(err); process.exit(1); });
}
