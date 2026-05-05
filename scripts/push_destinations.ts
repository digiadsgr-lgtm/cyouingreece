import * as dotenv from 'dotenv';
dotenv.config();
const { createClient } = require('@sanity/client');
const sanityClient = createClient({
  projectId: 'sntl6fxn',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});
import { v4 as uuidv4 } from 'uuid';

const DESTINATIONS = [
  {
    name_en: "Hydra",
    name_local: "Ύδρα",
    slug: "hydra",
    type: "island",
    region: "Saronic Gulf",
    tagline: "The island that killed the motor car and found its soul.",
    intro_paragraph: "There are no cars on Hydra. No mopeds, no scooters. The cobblestone streets of the Chora are navigated by donkeys and by people on foot, and the silence this creates—broken only by hooves, by bells, and by the sea—is so extraordinary it feels like a form of time travel. Hydra was discovered by artists in the 1950s (Leonard Cohen wrote some of his best songs here) and has somehow, against all odds, resisted the full weight of mass tourism. It remains a place of radical, almost utopian simplicity.",
    best_time: "May, June, September, October",
    wikiQuery: "Hydra island Greece",
    highlights: ["Car-free Chora", "Hydra School of Fine Arts", "Sunset from Sunset Rock", "Donkey trails to Kamini", "Anastasis church views"],
    gastronomy: "Fresh grilled fish at the port tavernas, local honey from the hills, sfougato (Hydra's own omelette).",
    hidden_gem: "Walk the coastal path from Hydra port to Kamini in the early morning before the day-trippers arrive. The sea is turquoise and completely still.",
  },
  {
    name_en: "Nafpaktos",
    name_local: "Ναύπακτος",
    slug: "nafpaktos",
    type: "mainland",
    region: "Central Greece",
    tagline: "The Venetian harbour where Cervantes lost his arm and found his story.",
    intro_paragraph: "Miguel de Cervantes, the author of Don Quixote, lost the use of his left arm at the Battle of Lepanto, fought in the waters outside this small harbour town. He called it 'the finest occasion that the past or present ages have seen, or the future can hope to see.' The Venetian harbour of Nafpaktos is perfectly circular, enclosed by medieval walls, its fortress reflected in the still water. But beyond the history, Nafpaktos is an active, energetic Greek town with a remarkable plateia, excellent seafood, and a proximity to the mountains of Aetolia-Acarnania that makes it the ideal base for a Greece entirely off the tourist map.",
    best_time: "April, May, October, November",
    wikiQuery: "Nafpaktos",
    highlights: ["Venetian circular harbour", "Botsaris Castle", "Battle of Lepanto monument", "Old city walls walk", "Psani beach"],
    gastronomy: "Fresh eel from the lagoon, grilled sea bass from the harbour, local tsipouro from Agrinio.",
    hidden_gem: "Walk the full circuit of the Venetian walls above the town for an unobstructed view over the Gulf of Corinth at sunset.",
  },
  {
    name_en: "Naxos",
    name_local: "Νάξος",
    slug: "naxos",
    type: "island",
    region: "Cyclades",
    tagline: "The island that feeds itself — and, if you're lucky, you too.",
    intro_paragraph: "Naxos is the largest of the Cyclades and the most quietly self-sufficient. It grows its own potatoes (famous across Greece), produces its own cheese (graviera, kefalotyri, arseniko), distills its own liqueur from citron fruit found nowhere else in the world, and raises its own cattle in the green mountain interior. The coast delivers the beaches — Agios Prokopios, Plaka, the endless golden strips of the west — but the interior, which almost no tourist visits, is the soul of Naxos: marble villages, Byzantine churches, olive groves, the Temple of Demeter standing alone in a field.",
    best_time: "May, June, September",
    wikiQuery: "Naxos island Greece",
    highlights: ["Portara (Temple of Apollo)", "Halki village and Vallindras distillery", "Temple of Demeter at Gyroulas", "Kouros of Melanes", "Plaka Beach"],
    gastronomy: "Naxian graviera cheese, loukoumades with local honey, citron liqueur, slow-roasted pork from the mountain villages.",
    hidden_gem: "Drive to the village of Apeiranthos in the marble mountains. It is the most beautiful inland village in the Cyclades and no one is there.",
  },
  {
    name_en: "Pelion",
    name_local: "Πήλιο",
    slug: "pelion",
    type: "mainland",
    region: "Thessaly",
    tagline: "The centaur's mountain. Apple orchards above the sea.",
    intro_paragraph: "The Pelion Peninsula is where Greek mythology placed the home of the centaurs—and if you stand on the high ridge above the beech forests in October, with the Aegean glittering below on one side and the Pagasetic Gulf on the other, this does not seem implausible. Pelion is a mountain covered in apple orchards, chestnut forests, and stone-built traditional villages connected by ancient cobblestone paths called kalderimia. It is a contradiction: the mountain that touches the sea, where you can swim in the morning and ski in the afternoon in winter. The food is extraordinary.",
    best_time: "May–June, September–October",
    wikiQuery: "Pelion peninsula",
    highlights: ["Makrinitsa village", "Tsagarada platanus tree", "Damouchari harbour", "Mouresi to Fakistra hike", "Volos fish market"],
    gastronomy: "Spetzofai (spicy sausage stew), tsipouro with meze in Volos, apple pie from mountain villages, fresh seafood from the gulf.",
    hidden_gem: "The beach at Fakistra is accessible only by a steep path through the forest. The water is cold, electric blue, and completely deserted.",
  },
  {
    name_en: "Rhodes",
    name_local: "Ρόδος",
    slug: "rhodes",
    type: "island",
    region: "Dodecanese",
    tagline: "Where the Colossus stood. Where time still runs differently.",
    intro_paragraph: "The medieval old city of Rhodes is the best-preserved medieval town in the Mediterranean. The walls were built by the Knights of St John in the 14th century and they still stand, complete and massive, enclosing a labyrinth of cobblestone streets, Gothic arches, Byzantine churches converted to mosques, and Venetian fountains. This is the part of Rhodes that matters. Beyond its walls, the island offers a dramatic landscape—the Valley of the Butterflies, the hilltop village of Lindos with its acropolis above a perfect arc of bay—while the north cape is given over, enthusiastically and irreversibly, to the European package holiday. Choose your Rhodes.",
    best_time: "April–May, September–October",
    wikiQuery: "Rhodes island",
    highlights: ["Medieval Old City (UNESCO)", "Lindos Acropolis and village", "Valley of the Butterflies", "Prasonisi windsurfing", "Mandraki Harbour"],
    gastronomy: "Pitaroudia (chickpea fritters), soumada (almond drink), fresh seafood in the old city, local Muscat wine from Lindos.",
    hidden_gem: "The village of Siana in the western hills is completely ignored by tourism. The honey from here is the best in the Dodecanese.",
  },
  {
    name_en: "Epirus Highlands",
    name_local: "Ήπειρος",
    slug: "epirus",
    type: "mainland",
    region: "Epirus",
    tagline: "The green spine of Greece — wild, archaic, and impossibly beautiful.",
    intro_paragraph: "Epirus is the Greece that Greece itself sometimes forgets. It occupies the northwest corner of the country, bordered by Albania and the Ionian Sea, and it is the wettest, greenest, most ecologically diverse region on the peninsula. The Pindus Mountains here reach 2,500 metres; the Vikos Gorge is the deepest canyon in the world by slope angle; the Voidomatis River runs clean enough to drink from. The villages—of which the Zagori network of 46 is the most famous—were prosperous trading posts of the Ottoman Empire, and their stone mansions, arched bridges, and slate-roofed churches survive in a remarkable state of preservation.",
    best_time: "May–June, September–October",
    wikiQuery: "Epirus Greece",
    highlights: ["Vikos Gorge crossing", "Zagorochoria villages", "Voidomatis River", "Ioannina castle and island", "Papingo rock pools"],
    gastronomy: "Giouvetsi from the mountain villages, pites (pies) of every kind, fresh trout from the rivers, aged cheese from Metsovo.",
    hidden_gem: "The Papingo rock pools, fed by the clear cold waters of a mountain stream, are so beautiful they look generated by AI. They are not.",
  },
  {
    name_en: "Paros",
    name_local: "Πάρος",
    slug: "paros",
    type: "island",
    region: "Cyclades",
    tagline: "The island that got everything right without anyone asking.",
    intro_paragraph: "Paros occupies a middle ground that other Greek islands fail to achieve: it is beautiful without being self-consciously so, popular without being overwhelmed, sophisticated without being sterile. The marble quarries of Paros supplied the stone for the Venus de Milo, the Nike of Samothrace, and the Temple of Solomon. The villages—Naoussa, Lefkes, the Chora—are Cycladic architecture at its most natural and unstudied. The wind, the famous meltemi, makes Paros a world-class windsurfing destination at Pounda. The beaches—Kolymbithres, Golden Beach, Santa Maria—cover every mood.",
    best_time: "June, September",
    wikiQuery: "Paros island Greece",
    highlights: ["Naoussa harbour", "Panagia Ekatontapiliani church", "Kolymbithres rock formations", "Lefkes mountain village", "Marathi marble quarry"],
    gastronomy: "Fresh tuna from Naoussa, gouna (sun-dried mackerel), local wine, kritharoto (barley risotto) from the mountain villages.",
    hidden_gem: "Walk from Lefkes to Prodromos on the ancient marble-paved path through the hills. It takes two hours and you will not see a tourist.",
  }
];

async function getWikimediaImage(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query?.search[0]?.title || query;
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const firstPage = Object.values(pages)[0] as any;
    return firstPage?.original?.source || null;
  } catch { return null; }
}

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl, { headers: { 'User-Agent': 'CYouInGreece/1.0' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), { filename });
    return asset._id;
  } catch (err: any) {
    console.error(`  ❌ Upload failed: ${err.message}`);
    return null;
  }
}

async function run() {
  console.log(`🗺️  Pushing ${DESTINATIONS.length} destination entries...\n`);

  for (const dest of DESTINATIONS) {
    // Check if slug already exists
    const existing = await sanityClient.fetch(
      `*[_type == "destination" && slug.current == $slug][0]._id`,
      { slug: dest.slug }
    );
    if (existing) {
      console.log(`⏭️  Already exists: ${dest.name_en} — skipping\n`);
      continue;
    }

    console.log(`⏳ Pushing destination: "${dest.name_en}"...`);

    const imageUrl = await getWikimediaImage(dest.wikiQuery);
    let imageAssetId: string | null = null;
    if (imageUrl) {
      console.log(`   📸 Image: ${imageUrl.substring(0, 70)}...`);
      imageAssetId = await uploadImageToSanity(imageUrl, `${dest.slug}-hero.jpg`);
    }

    const doc: any = {
      _type: 'destination',
      name_en: dest.name_en,
      name_local: dest.name_local,
      slug: { _type: 'slug', current: dest.slug },
      type: dest.type,
      region: dest.region,
      tagline: dest.tagline,
      intro_paragraph: dest.intro_paragraph,
      best_time: dest.best_time,
      highlights: dest.highlights,
      gastronomy: dest.gastronomy,
      hidden_gem: dest.hidden_gem,
    };

    if (imageAssetId) {
      doc.hero_image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } };
    }

    try {
      await sanityClient.create(doc);
      console.log(`✅ Published: "${dest.name_en}"\n`);
    } catch (err: any) {
      console.error(`❌ Failed "${dest.name_en}": ${err.message}\n`);
    }

    await new Promise(r => setTimeout(r, 400));
  }

  console.log('🎉 All destinations pushed!');
}

run();
