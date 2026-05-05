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

const ARTICLES = [
  // ─── SEA ───────────────────────────────────────────────
  {
    title: "The Blue Roads of Chalki: A Sailor's Confession",
    category: "sea",
    wikiQuery: "Chalki island Greece",
    excerpt: "Hidden behind the tourist behemoth of Rhodes lies an island so quietly beautiful it feels like a secret the Aegean is keeping from the rest of the world.",
    paragraphs: [
      "Every sailor has an island they keep to themselves. For many who know the Dodecanese intimately, that island is Chalki. It sits just fourteen kilometres west of Rhodes, yet it might as well be a world away. The harbour of Emborio is a perfectly preserved Italian-era waterfront of faded ochre, terracotta and deep cobalt-blue neoclassical mansions, each one a ghost of a prosperous past built on sea sponges.",
      "I arrived in early September, when the last summer crowds had retreated and the island exhaled. There is exactly one vehicle on Chalki—the school bus—so you walk. You walk through the abandoned village of Chorio high above the harbour, past the ruined castle of the Knights of St John, past the tiny church that smells perpetually of old beeswax and oregano. You walk until you reach the only sound that matters: the sea.",
      "Ftenagia Beach is a forty-minute walk from the harbour. The pebbles are so white and clean they look polished. The water is the colour of a flame when you hold it to light—an electric, impossible turquoise. There is no beach bar here, no sun-loungers for hire. You bring your own water, find your own rock, and you understand, perhaps for the first time, what the word 'solitude' actually means.",
      "Chalki is a reminder that Greece's greatest luxury is not a private villa with a plunge pool. It is an island where you can disappear for a week and feel no need to document it. Some experiences are meant only for you."
    ]
  },
  {
    title: "Milos: The Sculptor's Island",
    category: "sea",
    wikiQuery: "Milos island",
    excerpt: "The island that gave the world its most famous sculpture still hides an almost incomprehensible beauty in its volcanic coastline and technicolour fishing villages.",
    paragraphs: [
      "Milos does not care whether you notice it or not. That is its supreme confidence. The Venus de Milo was carved here, discovered here in 1820, and then carried away to Paris where she stands in the Louvre without arms and without this island that made her. Milos has never recovered the statue, but it doesn't need to. It has kept everything else.",
      "The coastline of Milos is unlike any other in Greece. Millennia of volcanic activity have sculpted the cliffs into shapes that defy geological gravity. There is Sarakiniko, where a moonscape of white volcanic rock tumbles into a sea so blue it seems artificially coloured. There are the Kleftiko sea caves, accessible only by boat, where the walls glow gold and the water inside is a shifting, luminous green.",
      "But my favourite discovery on Milos was Klima, a tiny fishing village on the north coast. Here, the fishermen's storehouses—called syrmata—are built directly into the colourful volcanic rock at the water's edge, with their small boats moored at the very front door. The colours—crimson, saffron, turquoise—reflect in the still morning harbour water with a vividness that makes you feel like you've stepped inside a painting.",
      "Hire a boat. Navigate yourself around the coastline. Turn every corner slowly. Milos is a geologist's dream and a poet's muse, but most of all it is proof that the Greek earth is still actively, restlessly creative."
    ]
  },
  {
    title: "The Secret Harbours of Ithaca: Walking with Homer",
    category: "sea",
    wikiQuery: "Ithaca Greece",
    excerpt: "The homeland of Odysseus is not a myth. It is a real island in the Ionian with a harbour, a mountain, and a silence profound enough to hear the ancient stories in the wind.",
    paragraphs: [
      "You do not visit Ithaca. You arrive at Ithaca. The word itself carries the weight of an entire literary tradition—the ten-year voyage, the patient wife, the strung bow, the homecoming. But what strikes you when the ferry slides into the harbour of Vathy is that the island is utterly, almost defiantly, un-mythologised. There are no kitsch Odysseus gift shops. There are fishing boats. There is a kafeneio playing old Greek music.",
      "The island is green and dramatic in a way the Cyclades never are. The hills are dense with cypress and olive, the light filtering through them in long, golden shafts in the late afternoon. The roads are narrow and treacherous, but the reward for navigating them is a series of small, secret bays—Filiatro, Gidaki—accessible by dirt track, each one a sheltered crescent of impossible peace.",
      "The mythological archaeology is scattered liberally across the island. The Cave of the Nymphs, a natural grotto near Vathy, is where Odysseus hid the treasure he brought from Phaeacia. You crawl through a low entrance in the rock and find a damp, mossy chamber that smells of earth and time. Whether or not Homer's hero ever existed, people have believed in him here for millennia. That belief has weight.",
      "At the end of a long day, walk to the harbour of Kioni in the north of the island and watch the sun set behind the mountains. Order octopus from the old woman who runs the taverna that has no name. Drink the local wine, which is slightly sour and cold. Think about journeys. You are exactly where you need to be."
    ]
  },

  // ─── MOUNTAIN ──────────────────────────────────────────
  {
    title: "Zagori: The Stone Villages That Time Refused to Swallow",
    category: "mountain",
    wikiQuery: "Zagori villages Greece",
    excerpt: "In the mountains of Epirus, a network of 46 medieval villages, connected by arched stone bridges and wild rivers, represents a Greece most tourists will never see.",
    paragraphs: [
      "The road into Zagori in northwestern Greece is an education in humility. The peaks of the Pindus mountain range crowd in from every side, grey-green and ancient, draped in fog. The villages appear without warning—clusters of grey stone mansions with slate rooftops that blend into the rock as though they grew there organically. This is the Zagori, a region of forty-six villages called Zagorochoria, a place that operated under its own autonomous laws for centuries and developed a culture of fierce, quiet self-sufficiency.",
      "The centre of Zagori's world is the Vikos Gorge. At fifteen kilometres long and one of the deepest gorges in the world by slope angle, it makes the Grand Canyon look conventionally proportioned. The Voidomatis River, renowned as one of the cleanest rivers in Europe, runs through its base—an electric blue-green that is almost biologically impossible. You hike down one side on stone-paved paths built by the same hands that built the arched stone bridges of the Kipi villages.",
      "The villages themselves demand entire days of slow walking. Monodendri, the main gateway to the gorge, has a deserted monastery perched on the cliff edge from which the view is completely unobstructed for fifty kilometres. In Kipoi, an elderly man still maintains the traditional silver embroidery technique that once made Zagori artisans famous across the Ottoman Empire.",
      "Zagori is the Greece that exists behind the postcard—complex, archaic, beautiful in a minor, serious key. It is a place that requires your full attention and rewards it with a depth of experience that no whitewashed Cycladic cube can offer."
    ]
  },
  {
    title: "Mount Olympus: Above the Gods, Below the Clouds",
    category: "mountain",
    wikiQuery: "Mount Olympus Greece",
    excerpt: "The highest peak in Greece is not just a mythological address. It is a serious, magnificent mountain that earns its reputation with every brutal, beautiful metre of ascent.",
    paragraphs: [
      "Most people have an opinion on Olympus before they have ever set foot on it. The name carries centuries of baggage—Zeus, lightning bolts, the Pantheon assembled on the summit in gleaming marble. The reality is more demanding and, in many ways, more awe-inspiring. Olympus is a serious alpine environment. Its highest point, Mytikas, reaches 2,917 metres. It has multiple peaks, technical ridges, and weather that changes with genuinely dangerous speed.",
      "The standard ascent starts from the mountain village of Litochoro, a crisp, clean town at the base of the Enipeas Gorge. The trail follows the river through a cathedral of plane trees and then begins a relentless ascent through zones of beech, black pine, and finally the exposed alpine zone where the wind is constant and the light has a crystalline, high-altitude quality that you cannot find anywhere below.",
      "From the Skolio summit, the second highest peak which requires no technical climbing, the view is a full 360-degree panorama of northern Greece. The Aegean glitters to the east. The Thermaic Gulf gleams silver. The Thessalian plain—where the myths of the Olympian gods played out against the backdrop of this very mountain—stretches out below like a rumpled green blanket.",
      "Standing up there, you understand the mythological impulse completely. The ancients looked up at this peak, perpetually shrouded in cloud, and they were entirely correct to believe that something extraordinary lived there. Olympus is extraordinary. Call it what you will."
    ]
  },
  {
    title: "The Vikos Gorge Crossing: One Day, An Entire Universe",
    category: "mountain",
    wikiQuery: "Vikos gorge",
    excerpt: "There are hikes, and then there is the full crossing of Vikos — a single day walk that packs a lifetime's worth of Greek mountain beauty into its wild, dramatic kilometres.",
    paragraphs: [
      "The full crossing of the Vikos Gorge is, without exaggeration, one of the great walks of the Mediterranean. You start at the village of Monodendri, descend 900 metres into the earth, and emerge the same day at the village of Vikos in the north. In between is the Voidomatis River, a series of ancient stone bridges, two ruined monasteries, wild plane tree forests, and a silence so complete it has its own presence.",
      "The descent from Monodendri is steep and unforgiving, switchbacking down crumbling shale paths. But within thirty minutes you are in a different world. The walls of the gorge rise 900 metres on both sides, and the sky is a narrow blue ribbon far above. The temperature drops by five degrees. The vegetation becomes lush and strange—mossy boulders the size of houses, springs of cold clear water appearing unexpectedly from the rock face.",
      "At the gorge floor, the Voidomatis River appears. The colour of this water is the first thing that stops all conversation among walking companions. It is not simply clear. It is a prismatic blue-green, lit from within, flowing over white limestone pebbles with a sound like distant applause. You must cross it barefoot; the cold is an electric shock followed by pure elation.",
      "The ascent to Vikos village at the far end is gentler, through oak forest and meadow. When you arrive, find the old man who runs the only taverna and order the grilled lamb. Drink the local tsipouro. Your legs will ache. Your heart will be absolutely, irrevocably full."
    ]
  },

  // ─── CULTURE ───────────────────────────────────────────
  {
    title: "The Sound of Epirus: Music That Carries the Weight of Mountains",
    category: "culture",
    wikiQuery: "Epirus music Greece",
    excerpt: "The polyphonic singing tradition of Epirus is one of the oldest living musical forms in Europe — a complex, layered sound that feels less like a performance and more like a geological event.",
    paragraphs: [
      "I heard it for the first time in a village square in Zagori. It was a Sunday evening, and a group of perhaps fifteen men and women had gathered in the central plateia. They began without announcement, without an instrument, without a signal I could see. The sound that emerged was unlike anything I had experienced. It was dense, layered, simultaneously mournful and jubilant, as though the melody and its own mourning for the melody were happening at the same time.",
      "This is the polyphonic music of Epirus, a UNESCO-recognised intangible cultural heritage. It is thought to be a surviving descendant of ancient Greek musical traditions, preserving scales and structures that predate Western classical music by centuries. It is not learned in formal schools. It is transmitted in exactly this way—in the village square, on feast days, at funerals and weddings, the older singers training the younger ones through proximity and repetition.",
      "The klarino—the Greek folk clarinet—provides the melodic spine around which the voices weave. In the right hands, the klarino sounds like it is crying and laughing simultaneously, a quality the Greeks call leventis: a bittersweet vitality that acknowledges both the beauty and the pain of being alive. The great klarino players of Epirus—names like Vasilis Saleas and the legendary Tasos Halkias—are revered here the way Paganini is revered in Italy.",
      "If you visit Zagori or the Ioannina region in the winter months, seek out a panegyri, a village festival. Sit with the locals. Do not photograph immediately. Just listen. Let the sound work on you from the inside out. You will leave understanding something about the Greek soul that no archaeological site can teach you."
    ]
  },
  {
    title: "Nafplio: The Capital That History Forgot to Erase",
    category: "culture",
    wikiQuery: "Nafplio Greece",
    excerpt: "Greece's first modern capital is a palimpsest of Venetian, Ottoman and Neoclassical layers — a small city that carries the entire turbulent history of a nation within its narrow, beautiful streets.",
    paragraphs: [
      "Before Athens, there was Nafplio. When the modern Greek state was born from the ashes of the Ottoman Empire in the 1820s, it was in this small harbour city in the Peloponnese that the first government was established, the first president housed, the first parliament convened. Nafplio carries this history not as a burden but as a form of elegance—the streets are immaculately preserved, the architecture a layered conversation between centuries.",
      "Walk through the old town and you read the history of the city in the walls themselves. The Venetians built the massive Palamidi fortress on the hill above (do not count the 999 steps—just climb). The Ottomans left the mosques repurposed as cinemas and municipal buildings, their minarets still intact. The Neoclassical era produced the First Cemetery, a remarkably moving collection of marble stelae and carved weeping women that make it more beautiful than most public parks.",
      "The plateia of Syntagma at the heart of the old town is perfectly proportioned. In the evening, the Venetian-era buildings turn amber in the last light, and the tables of the kafeneion fill with an unhurried, multigenerational crowd. There is a particular quality to the evening light in Nafplio—warmer, heavier, more golden than anywhere else I have sat in Greece.",
      "Nafplio also functions as the ideal base for exploring the Argolid—Mycenae, Tiryns, Epidaurus—the cradle of Greek civilisation is a forty-five minute drive. Stay in Nafplio, eat in Nafplio, breathe in Nafplio. And only then venture out to see what it built."
    ]
  },
  {
    title: "Thessaloniki by Night: The City That Never Stopped Inventing Itself",
    category: "culture",
    wikiQuery: "Thessaloniki",
    excerpt: "Greece's second city is first in energy, in cuisine, and in the art of the long, slow night—a Byzantine, Ottoman and Sephardic crossroads that pulses with an intensity Athens can never quite match.",
    paragraphs: [
      "Thessaloniki is Greece's best-kept secret from its own citizens. Athenians dismiss it as a provincial city; Thessalonikans return the favour by being entirely, cheerfully indifferent to this opinion. The reality is a city of extraordinary cultural depth—founded by Cassander of Macedon, briefly the most important city in the Roman Empire, the second city of the Byzantine world, a major Ottoman hub for five centuries, home to the world's largest Sephardic Jewish community before the Holocaust. Each layer is still present, still legible, still alive.",
      "The Byzantine churches of Thessaloniki—seventeen UNESCO World Heritage sites—are unlike any other religious architecture in Greece. Rotonda, Hagia Sophia, Agios Demetrios: each one is a massive, dim cave of mosaics and marble, the gold tesserae catching whatever thin light enters and multiplying it into something supernatural. They are not museum pieces. The liturgies are still performed; the incense is still burning.",
      "But Thessaloniki's real genius is nocturnal. The bar culture of the Ladadika district, the outdoor seafront promenade lined with kafeneia, the legendary Sunday morning tsipouradika where you eat meze after meze with small glasses of tsipouro until the afternoon arrives without warning—these are the rituals of a city that knows how to be alive. The street food here—bougatsa, trigona Panoramatos—is technically superior to anything in Athens. This is not my opinion. It is the opinion of every Athenian who has ever eaten there.",
      "Go in October. The summer crowds are gone, the light is amber and serious, the city settles into its true rhythm. Walk the Via Egnatia from the Arch of Galerius to the White Tower. Stop at every bakery. Order everything."
    ]
  },

  // ─── GASTRONOMY ────────────────────────────────────────
  {
    title: "The Olive Oil Pilgrimage: Koroneiki Pressed in Mani",
    category: "gastronomy",
    wikiQuery: "Mani Peninsula Greece",
    excerpt: "The Koroneiki olive—small, bitter, brutally productive—grows in the rugged landscape of the Mani Peninsula and produces an oil that is, without argument, among the finest in the world.",
    paragraphs: [
      "There is a moment in November in the Mani Peninsula when every conversation stops and becomes about olives. The harvest has arrived. The nets are spread beneath the trees. The Koroneiki olive—Greece's primary cultivar, small and green and intensely flavoured—is at its peak. Entire extended families mobilise. The pressing mills operate through the night, their motors heard across the silent stone villages, the smell of fresh-pressed oil hanging over everything like a warm, grassy fog.",
      "The Mani is a harsh landscape—the spine of the Taygetos mountain range drops directly into the sea, leaving narrow strips of terraced land where the olive trees have been coaxed into existence over thousands of years. The trees here are old. Some are four, five hundred years old, their trunks twisted into monumental sculptures by the wind and time. The roots go deep into the rocky soil, finding water where there should be none.",
      "I visited an oil producer outside Areopoli who farms three thousand trees alone, using no machinery for the harvest. He pressed a bottle of this year's first pressing—'agourelaio', the early harvest oil—and handed it to me. The colour was a turbid, electric green. The taste was extraordinary: peppery and aggressive, almost spicy at the back of the throat, with a grassy, herbaceous sweetness beneath it. This is what olive oil is before it becomes the mild, well-behaved thing in the supermarket bottle.",
      "Buy your oil directly from producers in the Mani. You can find them at the small markets in Areopoli and Gythio in November and December. It will ruin you for supermarket oil forever, and this is a completely acceptable sacrifice."
    ]
  },
  {
    title: "Kakavia: The Fisherman's Soup That Predates Civilisation",
    category: "gastronomy",
    wikiQuery: "Greek fish soup",
    excerpt: "Before there was bouillabaisse, before there was cioppino, there was kakavia — the ancient Greek fisherman's broth that is the direct ancestor of all Mediterranean fish soups.",
    paragraphs: [
      "The ancient Greeks ate kakavia on their boats. They made it the same way it is still made on the islands today: the smallest, least saleable fish from the day's catch, cooked directly in seawater in a clay pot over a fire, with olive oil, whatever vegetables were available—potatoes, onions, celery—and nothing else. The word itself is pre-Greek; it refers to the three-legged pot the soup was cooked in. This is one of the oldest continuously prepared dishes in human history.",
      "The critical rule of kakavia is the fish. You need variety. Not the beautiful fish—those are sold or eaten separately. Kakavia requires the bony, small, flavourful scorpion fish, rascasse, tiny crabs, shellfish, rockfish. Their bones and heads dissolve into the broth over long, slow cooking, creating a liquid of extraordinary depth—the sea distilled into drinkable form, rich with iodine and sweetness and a gentle, clean bitterness.",
      "The best kakavia I have eaten was at a small fish taverna in the harbour of Agios Nikolaos in Crete, served with a single piece of grilled bread floating on top to absorb the oil and a harsh, cold Cretan raki beside it. The taverna owner, a woman of perhaps seventy, told me the recipe had not changed since her grandmother. I believed her completely.",
      "When you order kakavia in Greece, do not rush it. Do not photograph it immediately. Smell it first. The steam carries an entire ecosystem in it. Lean over the bowl and breathe. This is the Mediterranean itself, cooked to its essence."
    ]
  }
];

async function getWikimediaImage(query: string) {
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
  } catch (e) {
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), { filename });
    return asset._id;
  } catch (err) {
    console.error(`Failed to upload image:`, err);
    return null;
  }
}

async function run() {
  console.log(`🚀 Starting batch push of ${ARTICLES.length} premium Journal Articles...\n`);

  for (const article of ARTICLES) {
    console.log(`⏳ Pushing: "${article.title}"...`);
    try {
      const imageUrl = await getWikimediaImage(article.wikiQuery);
      let imageAssetId = null;

      if (imageUrl) {
        console.log(`   📸 Image found: ${imageUrl.substring(0, 70)}...`);
        imageAssetId = await uploadImageToSanity(
          imageUrl,
          `${article.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}-hero.jpg`
        );
      } else {
        console.log(`   ⚠️  No Wikimedia image found for: ${article.wikiQuery}`);
      }

      const portableTextBody = article.paragraphs.map(para => ({
        _type: 'block',
        _key: uuidv4(),
        style: 'normal',
        children: [{ _type: 'span', _key: uuidv4(), text: para, marks: [] }]
      }));

      const doc: any = {
        _type: 'article',
        title: article.title,
        slug: {
          _type: 'slug',
          current: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        },
        category: article.category,
        excerpt: article.excerpt,
        body: portableTextBody,
        published_at: new Date().toISOString()
      };

      if (imageAssetId) {
        doc.hero_image = {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAssetId }
        };
      }

      await sanityClient.create(doc);
      console.log(`✅ Published: "${article.title}"\n`);

      // Small delay to be kind to the APIs
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.error(`❌ Failed: "${article.title}":`, error);
    }
  }

  console.log('🎉 All 11 premium articles pushed to Sanity CMS!');
  console.log('👉 Run: vercel deploy --prod to propagate to production.');
}

run();
