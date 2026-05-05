import * as dotenv from 'dotenv';
dotenv.config();
const { createClient } = require('@sanity/client');
const { v4: uuidv4 } = require('uuid');

const client = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

const ARTICLES = [
  // SEA
  {
    title: "Folegandros: The Island That Perfected the Art of Doing Nothing",
    category: "sea", wikiQuery: "Folegandros island Cyclades",
    excerpt: "High above the Aegean, the Chora of Folegandros clings to a cliff edge with an insouciance that borders on the divine. There are no ATMs in the village square. This is not an oversight.",
    paragraphs: [
      "The road from the port of Karavostasi to the Chora of Folegandros is a single-lane switchback that climbs 200 metres in three kilometres. Halfway up, the sea appears below—vast, flat, impossibly blue—and the island drops away on both sides with a vertiginous confidence. This, you quickly understand, is the entire personality of Folegandros condensed into a geography.",
      "The Chora is classified as one of the most beautiful settlements in Greece, a designation it wears without apparent interest. The kastro quarter—a mediaeval fortified neighbourhood where the outer walls of the houses themselves form the perimeter wall—is a masterpiece of functional beauty. The streets are so narrow that neighbours on opposite sides can exchange salt through their windows without raising their voices.",
      "There is essentially one long street, one main square, and three or four tavernas that have not changed their menus significantly since the 1990s. This is not a criticism. The octopus is always sun-dried and grilled, the fava is always from Santorini across the water, the house wine is always slightly too cold. You eat at the same table every night. The owner remembers what you had last time. This is the entire proposition of Folegandros, stated with quiet confidence.",
      "Take the path from the Chora to the Church of Panagia on the clifftop. It is an eighteen-minute walk up a white path through wild capers and rosemary. From the churchyard, the entire Cyclades spreads in every direction. Santorini's caldera to the south, Sikinos to the east, the open sea to the west. Nowhere else in the archipelago does the abstraction of blue and white feel so complete.",
    ]
  },
  {
    title: "Amorgos at the Edge of the World",
    category: "sea", wikiQuery: "Amorgos island",
    excerpt: "The easternmost inhabited Cycladic island is also the most extreme — a narrow blade of rock rising from the sea, home to a monastery that seems to have grown from the cliff face itself.",
    paragraphs: [
      "Amorgos is not an island you arrive at by accident. It requires two ferries and a decision. The reward is a place of genuine, unperformed isolation—long and narrow, the island is essentially a single mountain range running east-west with small settlements clinging to both flanks and a coastline that alternates between sheer cliff and improbable turquoise bay.",
      "The Monastery of Hozoviotissa is the defining image of the island. Built into the white limestone cliff face in the eleventh century, it appears to be not constructed but extruded from the rock itself—a narrow white vertical slab suspended three hundred metres above the sea. Inside, in a series of rooms built into the natural cavities of the cliff, monks have lived a life of deliberate solitude for nine hundred years.",
      "The famous dive site at the Blue Cave near Katapola offers visibility of forty metres in water so clear it removes the psychological sense of depth. You float and look down through fathoms of blue as though suspended in atmosphere rather than water. Luc Besson filmed The Big Blue here in 1988, and the underwater shots require no enhancement: the sea does this naturally.",
      "Stay in the village of Chora at the centre of the island, in one of the small guesthouses operated by families who have been here for generations. Eat at the taverna in the lower plateia, which serves food grown in the small valley below the village—fresh greens with olive oil, slow-cooked goat, a barrel wine that is rough and correct. Wake early. Walk to the monastery before the tourist boats arrive from Naxos. You will have it to yourself and the monks.",
    ]
  },
  {
    title: "The Art of the Greek Ferry: A Field Guide to Slow Travel",
    category: "sea", wikiQuery: "Piraeus port ferry Greece",
    excerpt: "The ferry system of Greece is not merely a transport network. It is an entire way of living — a 24-hour democracy of plastic chairs, instant coffee, and the open Aegean.",
    paragraphs: [
      "The large ferries that operate on the trunk routes of the Greek network—Piraeus to Heraklion, Piraeus to Rhodes, the Cyclades loop—are essentially floating hotels that happen to move. They have restaurants, bars, a disco that operates from midnight, airline-style seats, and private cabins with port-holes. They also have, crucially, the open deck, which is where experienced travellers go and stay.",
      "The open deck of a Greek ferry at two in the morning, somewhere south of Syros with the Milky Way visible and the sea making small noises against the hull, is one of the great experiences available to the modern traveller. Bring a sleeping bag in shoulder season. Find a protected corner behind a funnel. Sleep under the stars. You will arrive at your destination having genuinely travelled, rather than merely transported.",
      "The small island ferries—the caïques and the water taxis that operate between proximate islands—operate on a different logic entirely. Schedules exist as suggestions. The boat leaves when the captain judges it correct to leave. If the wind comes up and the sea builds, the service cancels without ceremony or refund. This is not incompetence. It is a reasonable acknowledgement of the fact that the Aegean is not a motorway.",
      "The correct ferry strategy for any Greek island trip: book the big overnight ferries in advance in high season; leave all small inter-island connections to arrive, ask locally, and see. The best days in Greece are the days where the ferry didn't come and you had to spend one more night on an island you'd planned to leave. Accept this philosophically. Greece is teaching you something.",
    ]
  },
  // MOUNTAIN
  {
    title: "Arachova: The Mountain Village That Lives at 1,000 Metres",
    category: "mountain", wikiQuery: "Arachova village Parnassus",
    excerpt: "In winter, the Athenian affluent come here to ski Mount Parnassus. But Arachova's real genius is not the snow — it is the village itself, unchanged in any way that matters.",
    paragraphs: [
      "Arachova is at its best in the grey, cold months when the plane trees in the plateia are bare and the kafeneio windows are steamed from the inside. The village sits at over a thousand metres on the southern flank of Mount Parnassus, twenty kilometres above Delphi, and in winter the light has a particular quality—blue-white, crystalline, with a sharpness that makes every edge look slightly too defined.",
      "The village is famous for two things that seem contradictory: its ski resort (the best in Central Greece, used by Athenians who arrive in SUVs on Friday evenings) and its absolute, uncompromising preservation of village culture. These things coexist without apparent friction. The same narrow street holds a boutique selling designer ski-wear and an old woman selling hand-woven blankets from a wooden chest that has not moved in forty years.",
      "The local products of Arachova are extraordinary. The formaela cheese—a hard, dry cheese that can be pan-fried without melting—is made only here, protected by PDO status, and eaten warm with honey at breakfast. The local pasta—hilopites, tiny squares of egg pasta dried on the rooftop in summer—is available from every shop in cloth bags tied with a ribbon.",
      "In summer, Arachova empties and Delphi fills. Go in January or February. The ski lifts are running and the monastery snack bar at the base of the mountain serves hot tsipouro with spiced cheese pies from a wood-burning oven. This is the correct temperature at which to experience the mythological landscape of Apollo's oracle.",
    ]
  },
  {
    title: "Prespa Lakes: The Hidden Wilderness at the Triple Frontier",
    category: "mountain", wikiQuery: "Prespa Lakes Greece",
    excerpt: "Where Greece, Albania and North Macedonia share a lake, the bears still outnumber the tourists. One of Europe's most important wetlands sits almost entirely unknown.",
    paragraphs: [
      "The Prespa Lakes are one of Europe's great natural secrets. Two lakes—Megali Prespa and Mikri Prespa—sit in a high mountain basin at the point where Greece, Albania, and North Macedonia meet. The area is an important national park and an internationally recognised wetland of extraordinary biodiversity. It is also completely, staggeringly unknown to most visitors to Greece.",
      "The village of Agios Germanos, the main settlement, has fewer than 400 permanent residents and a Byzantine church from the eleventh century decorated with frescoes of an immediacy and emotional power that many more famous churches fail to achieve. The church is unlocked during daylight hours. There is no admission fee. No queue.",
      "The lakes support the largest breeding colony of Dalmatian pelicans in the world. In spring and early summer, they nest on the small rocky islands in Mikri Prespa in vast, noisy, extraordinary concentrations. You hire a small boat from one of the fishermen in the village of Psarades and approach slowly. The pelicans tolerate a respectful distance. The experience—the noise, the white bodies, the smell of water and fish, the surrounding mountains—is one of the most affecting wildlife encounters in Europe.",
      "Brown bears live in the forests above the lakes. You will almost certainly not see one. But knowing they are there—invisible in the beech forests above the treeline—changes the atmosphere of the place. This is what rewilded Europe feels like: larger, stranger, better than the domesticated landscapes that occupy most of the continent.",
    ]
  },
  // CULTURE
  {
    title: "The Acropolis at 6am: How to See the Most Famous Site in the World Correctly",
    category: "culture", wikiQuery: "Acropolis Athens Parthenon",
    excerpt: "Seven million people visit the Acropolis each year. Almost none of them see it properly. The gate opens at 8am. Stand outside at 7:55. This is the only advice that matters.",
    paragraphs: [
      "The Parthenon is the most studied, most photographed, most argued-about building in human history. It is also, despite everything, genuinely overwhelming in person—a fact that the crowds that currently besiege it make nearly impossible to experience. The standard visit to the Acropolis—arriving by tour bus at 11am, shuffling in a dense column up the Propylaea, photographing the Parthenon from the same three angles everyone else has photographed it from—delivers an experience that approximates the real thing without achieving it.",
      "The gate opens at 8am in spring and autumn. Arrive at 7:55. In the first ninety minutes, before the first tour buses have disgorged their cargo, you will have the Acropolis in a condition approaching solitude. The light at this hour is raking and golden, picking out the carvings on the metopes with a three-dimensional clarity that the flat noon light erases. The Erechtheion's caryatids—the female figures that support the southern porch—look like they might shift their weight at any moment.",
      "The Acropolis Museum, built below the rock to house the surviving original sculptures, is one of the great modern museum buildings in the world. The top floor is constructed on the exact footprint of the Parthenon, oriented identically, so that the surviving original frieze sections face the building they came from through floor-to-ceiling glass. Stand between the originals and the cast reproductions that fill the gaps where the Elgin Marbles were removed. The argument about their return becomes visceral and obvious in a way that no written account can replicate.",
      "After the museum, walk down to the Monastiraki flea market, which is at its most human and least touristic on Sunday mornings. Have breakfast at one of the old kafeneia on Ifaistou Street—a cheese pie, a coffee, a glass of water. Watch the city wake up. Athens is a city best understood at its least spectacular, in the small, human-scale moments between the marble monuments.",
    ]
  },
  {
    title: "Byzantine Athens: The City Beneath the Tourist City",
    category: "culture", wikiQuery: "Byzantine Athens Plaka",
    excerpt: "Between the ancient and the modern, a thousand years of Byzantine Athens hides in plain sight — in the churches of Plaka, the walls of the Kerameikos, and the monks who still ring bells at dawn.",
    paragraphs: [
      "There is a version of Athens that exists between the ancient and the modern—a Byzantine city of small churches, olive-oil-burning lamps, and frescos painted by anonymous artists who believed they were making windows between the human and the divine. Most visitors walk past this city entirely, focusing on the ancient monuments above and the modern city around them. The Byzantine layer requires a different kind of attention: slower, more lateral, willing to push open an unlocked door.",
      "The church of Kapnikarea on Ermou Street—one of the main shopping streets—stands at the exact centre of the pavement, surrounded by people carrying shopping bags. It was built in the eleventh century and has been a functioning church continuously since then. The interior is tiny and dark, lit by oil lamps, smelling of incense and damp stone. Services take place here every morning. The priest does not pause when tourists enter.",
      "The Kerameikos neighbourhood—named for the ancient potters' quarter it overlies—contains one of the most peaceful archaeological sites in Athens: the ancient cemetery, which includes Byzantine graves layered over ancient ones. At the site's edge, an eleventh-century church stands roofless but structurally intact, its brick and stone courses as precise as the day they were laid.",
      "The best way to experience Byzantine Athens is to attend an Easter liturgy. The midnight service on Holy Saturday, when the priest emerges with the flame and the congregation passes it person to person in the darkness, is one of the most affecting rituals in all of European Christianity—and it happens simultaneously in every church in every city and village in Greece. Find a small neighbourhood church in Plaka or Monastiraki, stand outside, receive the flame. You will understand something essential.",
    ]
  },
  {
    title: "The Lost Villages of Mani: Where Greece Kept Its Secrets",
    category: "culture", wikiQuery: "Mani peninsula tower houses",
    excerpt: "The deep Mani peninsula — the middle finger of the Peloponnese pointing south toward Africa — is a landscape of tower houses, clan vendettas, and a Byzantine culture that survived the Ottoman centuries intact.",
    paragraphs: [
      "The Mani Peninsula extends south from the Taygetos mountains toward the open Mediterranean, growing more arid and austere with every kilometre. The vegetation thins to thyme, spurge, and wild garlic. The stone turns from grey to a scorched ochre. The villages, when they appear, are composed entirely of towers—tall, narrow fortified houses built by the clan families of the Mani in the sixteenth, seventeenth, and eighteenth centuries as instruments of inter-family warfare. Some villages are essentially abandoned, their tower houses standing empty against the sky like a petrified argument.",
      "The Maniots were the one population of the Greek peninsula who successfully resisted full Ottoman incorporation. Operating under a semi-autonomous system of clan governance, paying tribute but maintaining their language, religion, and customs, they preserved a version of Byzantine Greek culture through the Ottoman centuries in a form largely untouched by outside influence. The churches of the deep Mani contain frescoes from the twelfth and thirteenth centuries—provincial Byzantine work, sometimes crude, always emotionally direct—that survive because no one has ever had a reason to restore or disturb them.",
      "The village of Vathia, in the southernmost tip of the peninsula, is the most dramatic example of the tower village form. Twenty or thirty towers, most of them derelict, cluster on a rocky outcrop above the sea. The village has perhaps five permanent residents. Walking through it in the late afternoon, when the shadows of the towers fall across each other and the sea glitters below, is an experience in deliberate anachronism.",
      "The food of the deep Mani is the food of an austere, self-sufficient people: dried figs, pressed olives, cured pork from pigs raised on acorns in the hills, a hard dry cheese aged in cloth. The local olive oil—Koroneiki variety, cold-pressed, with a pronounced peppery finish—is among the finest produced anywhere in Greece. Buy it directly from producers in Areopoli. Take more than you think you need.",
    ]
  },
  // GASTRONOMY
  {
    title: "The Perfect Greek Breakfast: A Geography of the Morning Table",
    category: "gastronomy", wikiQuery: "Greek breakfast bougatsa",
    excerpt: "There is no single Greek breakfast. There is an Athenian breakfast and a Cretan one, a bakery breakfast and a taverna one, a fast one and an infinitely slow one. All of them are correct.",
    paragraphs: [
      "The canonical Greek breakfast of the tourist hotel—yoghurt with honey, hard-boiled egg, olives, a bread roll, sliced cucumber and tomato—is a reasonable approximation of what Greeks actually eat in the morning, assembled by someone who has seen the ingredients but not experienced the context. The actual Greek breakfast is a more specific, more local, and considerably more delicious thing.",
      "In Athens, the morning ritual begins at the neighbourhood bakery. The cheese pie—tiropita—is freshest at 7am, when it emerges from the oven still hot enough to burn your fingers through the paper bag. A sesame-crusted koulouri from a street vendor followed by a double espresso standing at the counter of any neighbourhood kafeneio is the businessman's breakfast and still, fifty years after it was standardised, the best possible way to begin an Athenian day.",
      "In Thessaloniki, breakfast is a more serious affair. The bougatsa—a layered filo pastry filled with semolina cream and dusted heavily with icing sugar and cinnamon—is served in dedicated bougatsa shops that open at 6am and close at noon, having sold out. The quality variation between bougatsa shops is as significant and earnestly debated as wine vintage variation among sommeliers. Ask your hotel who does the best one in the neighbourhood. Then ask someone else. Go to the one with the longer queue.",
      "In Crete, breakfast is essentially a small lunch: dakos (dry barley rusk soaked in tomato juice, topped with soft cheese, olive oil, and dried oregano), fresh figs when in season, local honey that tastes of thyme and wild herbs, and the extraordinary Cretan extra-virgin olive oil on everything. The Cretan morning table communicates, without speaking, an entire agricultural philosophy: we have made these things here, from this ground, in this light, and they require no improvement.",
    ]
  },
  {
    title: "Sifnos and the Slow Pot: How One Island Changed Greek Cooking",
    category: "gastronomy", wikiQuery: "Sifnos island pottery",
    excerpt: "The island of Sifnos produced more professional cooks per capita than anywhere else in Greece — and its ceramic clay pots, left in the bakery oven overnight, invented a way of cooking that defined a national cuisine.",
    paragraphs: [
      "The connection between Sifnos and Greek professional cooking is so established it has the quality of mythology, but it is essentially true: for centuries, the island exported its young men to the restaurants and households of Athens, Constantinople, and later Paris as professional cooks, and the island's culinary traditions—built around slow braising in clay pots, the patient use of legumes, and an instinct for the minimal intervention that allows good ingredients to speak—shaped what we now understand as Greek haute cuisine.",
      "The defining dish of Sifnos is mastelo or, in its most iconic form, revithada—chickpeas slow-cooked in a sealed clay pot overnight in the wood-fired bakery oven. The baker accepts the pots in the evening, places them in the residual heat after the day's bread has been baked, and returns them in the morning. The chickpeas, in eighteen hours of gentle heat, become something entirely different from chickpeas: yielding, almost liquid, infused with lemon and rosemary and their own gelatinous liquid.",
      "The pottery of Sifnos—a separate but related tradition—has been producing the distinctive terracotta cooking vessels for centuries. The clay of the island has a particular quality that allows it to absorb and retain heat without cracking, making it perfect for the long, slow cooking methods the island's cuisine demands. You can visit the workshops in the village of Agios Athanasios and watch the pots being made on a kick-wheel by potters who learned the technique from their fathers.",
      "Eat at the taverna Leonidas in the Chora of Sifnos on a Sunday, when the oven-braised dishes are available. Order the mastelo if it's on the menu, the revithada if it isn't, the freshly-caught fish as a second course. The house wine comes from the barrel. Sit outside under the vine-covered pergola. Take your time. This is the fundamental instruction of Sifniot cooking, applied to the act of eating it.",
    ]
  },
  {
    title: "Crete's Wild Interior: The Shepherd's Kitchen",
    category: "gastronomy", wikiQuery: "Crete mountains Sfakia",
    excerpt: "The mountain shepherds of the Cretan interior have maintained a cuisine of radical simplicity and extraordinary quality for centuries. Lamb, cheese, wild herbs, and the wood fire — nothing more is required.",
    paragraphs: [
      "The gastronomy of coastal Crete—the mezedes of the harbour tavernas, the fresh fish, the dakos of the tourist restaurants—is well documented and genuinely excellent. The gastronomy of the interior is almost entirely unknown outside the island itself, and it is in many ways the more interesting cuisine: austere, protein-heavy, defined by the landscape of the Cretan mountains rather than the sea.",
      "The shepherds of the White Mountains—Lefka Ori—have maintained seasonal transhumance for centuries, moving their flocks between the coastal lowlands in winter and the high pastures above 1,500 metres in summer. Their food has been shaped entirely by what is available at altitude: fresh-killed lamb, the milk of sheep and goats that feed on wild mountain herbs, foraged greens and roots, dried legumes carried up at the start of the season.",
      "The cheese of the Cretan mountains—graviera, aged in cloth and turned weekly, hard and crystalline with a flavour that combines sweetness and a sharp animal intensity—is among the finest produced in Greece. The process is essentially unchanged from pre-classical antiquity: raw milk, animal rennet, pressing, salting, ageing in cool stone chambers. The best graviera smells of the herbs the sheep ate.",
      "In the mountain villages of Anogeia and Askyfou, you can still find kapheneia where the food served is kitchen food rather than restaurant food: slow-cooked lamb with stamnagathi (wild chicory), bean soups made with the local fasolia, bread baked in a wood-fired oven that morning. This is the cuisine that fed shepherds and warriors. It requires no presentation and no explanation. It only requires eating.",
    ]
  },
  {
    title: "The Wine Regions of Greece That France Doesn't Want You to Know",
    category: "gastronomy", wikiQuery: "Greek wine Assyrtiko Santorini",
    excerpt: "Assyrtiko, Xinomavro, Agiorgitiko — the indigenous Greek varietals that are quietly rewriting the international wine conversation. Greece has been making wine for 4,000 years. It's getting good at it.",
    paragraphs: [
      "The Assyrtiko grape of Santorini is, by any serious technical measure, one of the world's great white wine varietals. Grown in volcanic ash soil in basket-trained vines that have survived the island's devastating summer winds for centuries—some vines are over 70 years old—it produces wines of extraordinary mineral intensity, high natural acidity, and a capacity for ageing that rivals white Burgundy. It also remains largely unknown outside specialist wine circles, which means you can drink it for a fraction of what a comparable Chablis would cost.",
      "The Naoussa region of northern Macedonia produces Xinomavro, a red grape of legendary difficulty. Thin-skinned, high in acid and tannin, slow to express itself in youth, it requires years in bottle and hours in the decanter. When it finally opens, the result is a wine of uncommon complexity—red fruit, dried tomato, olive, leather, tobacco—that shares more structural DNA with Barolo or Burgundy than with anything produced in the warm southern Mediterranean. The wines of Kir-Yianni, Thymiopoulos, and Apostolos Thymiopoulos are the benchmarks.",
      "The Nemea appellation in the Peloponnese grows Agiorgitiko (St George), a softer, more approachable red grape that produces wines ranging from the simple and fruity to the profoundly complex, depending on the producer and the altitude of the vineyard. The high-altitude Nemea vineyards, above 600 metres, produce wines with a freshness and structure that belie the warm climate of the region.",
      "The wine tourism infrastructure of Greece is still developing, which means that visiting the producers directly—something that requires a car, a map, and a willingness to drive down unmarked roads—delivers experiences unavailable in the more codified wine regions of France or Italy. Most Greek wineries welcome unannounced visitors. They pour generously. They talk at length. They will almost certainly invite you to stay for lunch. This is another form of hospitality that the country has not yet learned to monetise.",
    ]
  },
];

async function getWikimediaImage(query: string): Promise<string | null> {
  try {
    const s = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=3`)).json();
    for (const result of (s.query?.search ?? [])) {
      const d = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(result.title)}`)).json();
      const src = (Object.values(d.query?.pages ?? {})[0] as any)?.original?.source;
      if (!src) continue;
      const l = src.toLowerCase();
      if (l.endsWith('.svg') || l.includes('map') || l.includes('flag') || l.includes('locator') || l.includes('coat_of')) continue;
      return src;
    }
    return null;
  } catch { return null; }
}

async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CYouInGreece/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buf), { filename });
    return asset._id;
  } catch (e: any) { console.error(`  ❌ ${e.message}`); return null; }
}

async function run() {
  console.log(`🚀 Pushing ${ARTICLES.length} new articles...\n`);
  for (const art of ARTICLES) {
    // Check if slug already exists
    const slug = art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await client.fetch(`*[_type == "article" && slug.current == $slug][0]._id`, { slug });
    if (exists) { console.log(`⏭️  Exists: "${art.title.substring(0,50)}..."\n`); continue; }

    console.log(`⏳ "${art.title.substring(0, 55)}..."`);
    const imageUrl = await getWikimediaImage(art.wikiQuery);
    let assetId: string | null = null;
    if (imageUrl) {
      console.log(`  📸 ${imageUrl.substring(0, 70)}...`);
      assetId = await uploadImage(imageUrl, `${slug.substring(0, 50)}-hero.jpg`);
    }

    const doc: any = {
      _type: 'article',
      title: art.title,
      slug: { _type: 'slug', current: slug },
      category: art.category,
      excerpt: art.excerpt,
      body: art.paragraphs.map(p => ({
        _type: 'block', _key: uuidv4(), style: 'normal',
        children: [{ _type: 'span', _key: uuidv4(), text: p, marks: [] }]
      })),
      published_at: new Date().toISOString(),
    };
    if (assetId) doc.hero_image = { _type: 'image', asset: { _type: 'reference', _ref: assetId } };

    await client.create(doc);
    console.log(`  ✅ Published!\n`);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('🎉 All done!');
}

run();
