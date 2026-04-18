import 'dotenv/config';
import { generateContentForNode } from './copywriter';
import { generateSchema, generateLocalizedKeys } from './seo';
import { fetchVisualAssets } from './visual';
import { fetchLiveEvents } from './live';
import { pushToSanity } from './cms';
import { supabase } from '../lib/supabase';

// Deterministic Array Fallback for true Autonomy
const AUTONOMOUS_FALLBACK_NODES = [
  { type: 'Region', name: 'Cyclades', rawFacts: 'Aegean archipelago, known for minimalist architecture.' },
  { type: 'Island', name: 'Mykonos', rawFacts: 'Cosmopolitan, high-end gastronomy, bare rocky landscapes.' },
  { type: 'POI', name: 'Naxos Apollo Temple', rawFacts: 'Ancient marble gateway (Portara) sitting intensely against the Aegean sea.' },
  { type: 'Island', name: 'Crete', rawFacts: 'Largest island, distinct Minoan archaeology, high-altitude mountain ranges.' }
];

let fallbackIndex = 0;

async function getNextNodeFromDB() {
  // Return rotating fallback sequence for robust simulation without DB dependency
  const node = AUTONOMOUS_FALLBACK_NODES[fallbackIndex];
  fallbackIndex = (fallbackIndex + 1) % AUTONOMOUS_FALLBACK_NODES.length;
  return node;
}

async function runAutonomousEngine() {
  console.log("=== INITIATING CYOUINGREECE AUTONOMOUS ENGINE (INFINITE LOOP) ===");
  
  let isRunning = true;
  
  // Catch system interrupt to terminate safely
  process.on('SIGINT', () => {
    console.log("\n[System Interrupt Received] Shutting down autonomous engine...");
    isRunning = false;
  });
  
  while (isRunning) {
    try {
      const node = await getNextNodeFromDB();
      console.log(`\n⚙️ Processing Node: [${node.type}] ${node.name}`);
      
      // 1. Copywriting Engine
      const copyData = await generateContentForNode(node.type, node.name, node.rawFacts);
      if (!copyData) {
        console.warn(`[!] Skipping ${node.name} due to AI Copy Generation Error. Retrying in 10s...`);
        await new Promise(res => setTimeout(res, 10000));
        continue;
      }
      
      // 2. SEO & Schema mapping
      const schema = generateSchema(node.type, node.name, copyData.description);
      const localized = generateLocalizedKeys(copyData);
      
      // 3. Visual Sourcing
      const factualImage = await fetchVisualAssets(node.name, 'factual');
      
      // 4. Live Events
      const events = await fetchLiveEvents(node.name);
      
      const payload = {
        name: node.name,
        ...localized.en,
        seoSchema: JSON.stringify(schema),
        heroImage: factualImage,
        liveEvents: events,
        translations: localized,
        updatedAt: new Date().toISOString()
      };
      
      // 5. Push to Headless CMS
      await pushToSanity(node.type, payload);
      
      // 6. DB Update timestamp bridging
      if (node.type && node.name) {
          const { error } = await supabase
            .from('generationLogs')
            .insert([{ target_node: node.name, type: node.type, generated_at: new Date().toISOString() }]);
          
          if (error) {
             console.log(`[Supabase] Note: Supabase 'generationLogs' table might not exist yet or RLS blocked it. Continuing autonomy...`);
          } else {
             console.log(`[Supabase] Recorded autonomous generation for ${node.name}.`);
          }
      }
      
      // Pacing logic to prevent rate limiting (15 seconds between nodes)
      console.log("\n=> Node cycle complete. Preparing next target...");
      await new Promise(resolve => setTimeout(resolve, 15000));
      
    } catch (err) {
      console.error("[CRITICAL] Engine generation cycle failed. Rebooting cycle...", err);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

if (require.main === module) {
  runAutonomousEngine().then(() => {
    // Process exits safely when done or interrupted
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
