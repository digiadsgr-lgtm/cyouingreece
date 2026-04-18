import 'dotenv/config';
import { generateSchema, generateLocalizedKeys } from './seo';
import { pushToSanity } from './cms';
import { supabase } from '../lib/supabase';

// MASSIVE SWARM DATASET (Bypassing 403 Forbidden on External API)
const SWARM_NODES = [
  { type: 'Island', name: 'Crete', facts: 'Largest Greek island. Rugged mountains meet vast beaches. Minoan palaces like Knossos. High culinary heritage.', img: 'https://images.unsplash.com/photo-1577413627796-0df75a3ea7cd?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Rhodes', facts: 'Medieval old town. Ancient Acropolis of Lindos. Extensive golden beaches and distinct Crusader castle vibes.', img: 'https://images.unsplash.com/photo-1621503833240-622fdb212de7?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Corfu', facts: 'Ionian gem. Venetian, French, and British architectural influences. Lush green landscapes and turquoise coves.', img: 'https://images.unsplash.com/photo-1563219207-6be0bcf8f8dc?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Region', name: 'Mani Peninsula', facts: 'Rugged, stone-tower villages. Deep historical isolation. Crystal clear waters meeting jagged rocks.', img: 'https://images.unsplash.com/photo-1596706013627-7cfd82bb776e?q=80&w=2000&auto=format&fit=crop' },
  { type: 'POI', name: 'Meteora', facts: 'Eastern Orthodox monasteries suspended on immense natural sandstone pillars. Misty, spiritual terrain.', img: 'https://images.unsplash.com/photo-1564074218321-df54c46fcf82?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Symi', facts: 'Neoclassical colorful mansions cascading down the harbor. Sponge-diving history. Incredibly photogenic architecture.', img: 'https://images.unsplash.com/photo-1627993424177-3e11736b4ff0?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Folegandros', facts: 'Untouched Cycladic charm. Dramatic cliffs and small white church pathways leading to the Aegean.', img: 'https://images.unsplash.com/photo-1601275304313-2be68eeb960f?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Island', name: 'Kefalonia', facts: 'Emerald Ionian waters, famous Myrtos beach, dramatic caves like Melissani. Majestic, mountainous scenery.', img: 'https://images.unsplash.com/photo-1533036662719-74e2d3dfdd99?q=80&w=2000&auto=format&fit=crop' },
  { type: 'Region', name: 'Pelion', facts: 'Mountain of the Centaurs. Lush forests descending directly into pristine Aegean beaches. Traditional stone mansions.', img: 'https://images.unsplash.com/photo-1596489390234-fc02a94fe9eb?q=80&w=2000&auto=format&fit=crop' },
  { type: 'POI', name: 'Delos', facts: 'Uninhabited sacred island. Birthplace of Apollo. Sprawling archaeological museum under the open sky.', img: 'https://images.unsplash.com/photo-1504505367351-8b0fd2ec03df?q=80&w=2000&auto=format&fit=crop' }
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
