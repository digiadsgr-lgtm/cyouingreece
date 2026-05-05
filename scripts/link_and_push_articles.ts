import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';
const { v4: uuidv4 } = require('uuid');

const client = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

// ── Step 1: Link existing articles to destinations ─────────────────────────
// Articles whose titles reference specific destinations → patch related_destinations

const ARTICLE_DESTINATION_LINKS: Record<string, string[]> = {
  'folegandros-the-island-that-perfected-the-art-of-doing-nothing': ['folegandros'],
  'amorgos-at-the-edge-of-the-world':                               ['amorgos'],
  'the-art-of-the-greek-ferry-a-field-guide-to-slow-travel':        ['piraeus', 'athens'],
  'arachova-the-mountain-village-that-lives-at-1-000-metres':       ['arachova'],
  'prespa-lakes-the-hidden-wilderness-at-the-triple-frontier':      ['zagori'],
  'the-acropolis-at-6am-how-to-see-the-most-famous-site-in-the-world-correctly': ['athens'],
  'byzantine-athens-the-city-beneath-the-tourist-city':             ['athens'],
  'the-lost-villages-of-mani-where-greece-kept-its-secrets':        ['nafplio'],
  'sifnos-and-the-slow-pot-how-one-island-changed-greek-cooking':   ['sifnos'],
  "crete-s-wild-interior-the-shepherd-s-kitchen":                   ['crete', 'chania'],
  'the-wine-regions-of-greece-that-france-doesn-t-want-you-to-know': ['santorini', 'naoussa'],
  'hydra-the-island-that-banned-cars-in-1950-and-never-looked-back': ['hydra'],
  'naxos-vs-paros-an-honest-comparison':                            ['naxos', 'paros'],
  'the-vikos-gorge-crossing-one-day-an-entire-universe':            ['zagori', 'epirus'],
  'santorini-without-the-crowds-a-local-blueprint':                 ['santorini'],
  'nafplio-the-city-that-invented-greek-nostalgia':                 ['nafplio'],
  'athens-in-48-hours-the-non-tourist-version':                     ['athens'],
  'the-pelion-peninsula-in-winter':                                 ['pelion'],
  'nafpaktos-the-ottomans-never-really-left':                       ['nafpaktos'],
  'hydra-off-season-what-happens-when-the-boats-stop':              ['hydra'],
  'the-old-monastery-circuit-of-mount-athos':                       ['halkidiki'],
  'eating-your-way-through-naxos':                                  ['naxos'],
  'a-week-on-ikaria-and-why-i-still-havent-left':                   ['ikaria'],
  'the-best-beaches-in-the-peloponnese-that-nobody-talks-about':    ['nafplio', 'monemvasia'],
};

// ── Step 2: New destination-specific articles ──────────────────────────────
const NEW_ARTICLES = [
  // SANTORINI
  {
    title: "Santorini Without the Crowds: A Local Blueprint",
    slug: "santorini-without-the-crowds-a-local-blueprint",
    category: "sea", destSlug: "santorini", wikiTitle: "Santorini",
    excerpt: "The island receives 3 million visitors a year. The caldera at sunset is genuinely incomparable. The trick — and there is a trick — is to arrange your relationship with both facts simultaneously.",
    paragraphs: [
      "The key to Santorini is to treat the famous parts of it as you would any natural wonder: approach them at the correct time, with the correct attitude, and not via organised group transport. The caldera view from Oia is, genuinely, one of the great views in the world. The problem is that 4,000 other people have also been told this, and they have all arrived at 7pm on a Tuesday in August with identical telephoto lenses.",
      "Go in April or October. The light is better — the low-angle sun of shoulder season turns the caldera walls a colour that high summer, with its flat overhead light, cannot replicate. The wind is more present, which means the bougainvillea is doing something interesting at all times. And the village of Oia, which in August is essentially a crowd of tourists taking photographs of other tourists, becomes navigable.",
      "The non-famous parts of Santorini are extraordinary. The village of Pyrgos, at the centre of the island, is older and higher and quieter than anything on the caldera rim. Its kastro — a concentric system of lanes and archways built for defence — can be walked in twenty minutes, after which you sit in the square and eat the local white eggplant and drink a glass of Assyrtiko and understand what the island actually is when it is not performing for cameras.",
      "The beaches of the south — Perivolos, Agios Georgios — are long and black and backed by beach bars that, in the right season, play the correct music at the correct volume. The red beach near Akrotiri, which is genuinely red, the colour of oxidised iron, is photogenic beyond reason. Visit it in the morning, before the boats from Fira arrive.",
      "Akrotiri itself: the Minoan city preserved under volcanic ash for 3,600 years, excavated since the 1960s, is the most compelling archaeological site in the Cyclades. It is built over with a modern protective structure that controls light and temperature; you walk through the preserved streets of a Bronze Age city and the effect is not didactic but visceral. People lived here, ate here, loved here. Then one morning, without warning, the mountain decided otherwise.",
    ]
  },
  // ATHENS
  {
    title: "Athens in 48 Hours: The Non-Tourist Version",
    slug: "athens-in-48-hours-the-non-tourist-version",
    category: "culture", destSlug: "athens", wikiTitle: "Athens",
    excerpt: "The tourist Athens and the Athenian Athens exist in the same city but rarely intersect. Here is how to find the second one — in 48 hours, without a guidebook, without a tour.",
    paragraphs: [
      "The first morning: walk from wherever you are staying to the Monastiraki flea market by 8am. Not to buy anything — the antique dealers at this hour are still arranging their wares and are not in selling mode — but to observe. The market on Sunday morning is the city in a compressed, heightened form: a retired lawyer examining a collection of 1960s Greek 45s, a Nigerian man selling bootleg Gucci, a cat asleep on a pile of Byzantine iconography, a smell of coffee and exhaust and something indefinably resinous that is Athens in the morning.",
      "For breakfast: Avocado on Nikis Street opens at 7:30am and is the best café in central Athens, which is saying something in a city that takes coffee existentially seriously. The double Freddo espresso — iced, shaken to a foam — is the correct introduction to the Athenian metabolism. Drink it standing at the bar. Order a cheese pie.",
      "The Acropolis opens at 8am. Be there. The first hour, before the tours arrive from Piraeus, is the Acropolis you thought you were getting when you booked the flight. The second morning: the Benaki Museum on Vas. Sofias Avenue. The Benaki is the definitive collection of Greek material culture from the Neolithic to the 20th century, assembled by a single patrician family and donated to the state. The cafe on the rooftop terrace has one of the best views in Athens and the mezedes are surprisingly good. This is where Athenians go on a Saturday morning when they want to feel good about their city.",
      "The evening. Exarcheia, the formerly anarchist neighbourhood northwest of Omonia, is where Athenians under 35 eat, drink, and stay out too late on weeknights. The squares around Exarcheia Square have a dozen small tavernas of the old type — paper tablecloths, barrel wine, food brought to the table without being ordered because the kitchen decides what is good today. Find one. Sit down. Let them bring you things.",
      "Gazi, further west, is the former gasworks district, now a bar and restaurant neighbourhood built around the preserved industrial infrastructure. The best thing about it at night is that it looks exactly as improbable as it is: neon bars attached to Victorian gasometers, people eating grilled octopus on chrome tables under rusted Victorian ironwork. This is Athens at its most recent and most itself.",
    ]
  },
  // NAFPLIO
  {
    title: "Nafplio: The City That Invented Greek Nostalgia",
    slug: "nafplio-the-city-that-invented-greek-nostalgia",
    category: "culture", destSlug: "nafplio", wikiTitle: "Nafplio",
    excerpt: "Greece's first post-independence capital is so beautiful that it embarrasses every city that came after it. Three fortresses, neoclassical streets, and an olive grove that smells of something close to perfect.",
    paragraphs: [
      "Nafplio is the city that Athenians go to when they need to remember why they stayed in Greece. It is three hours from Athens by road, positioned at the inner end of the Argolic Gulf in the northeastern Peloponnese, and it is so comprehensively, almost aggressively beautiful that spending more than two days there induces a specific form of melancholy: the knowledge that your own city is not this.",
      "The old town is Venetian in form — a grid of narrow streets, tall ochre buildings, arched doorways, small churches — laid over and around a Byzantine foundation. It served as the capital of the first Greek state from 1828 to 1834, which gives it a particular historical charge: the neoclassical mansions of the independence era stand alongside the Venetian churches and the older mosque in the square (now a cinema, then a mosque, earlier a church) in a layered chronology that the city wears without self-consciousness.",
      "The three fortresses define the skyline. The Akronauplia, the oldest, sits directly above the old town and has been fortified in one form or another since antiquity. The Palamidi, above it, is the Venetian masterwork — a dramatic baroque fort reached by 999 steps (the count varies) from which the entire Argolic Gulf is visible on clear days. The Bourtzi, the island fortress in the harbour, was the executioner's residence in the nineteenth century and is now accessible by water taxi.",
      "Eat in the old town, in one of the restaurants that faces the harbour wall. The Argolida produces some of the best olive oil in Greece, the local oranges are world-class, and the fish from the Gulf is fresh in a way that coastal city fish rarely is. Drink ouzo at sunset on the harbour promenade, watching the water change colour. This is exactly what it looks like in the photographs, and the photographs do not exaggerate.",
    ]
  },
  // MYKONOS
  {
    title: "Mykonos: What It Actually Is (and What to Do About It)",
    slug: "mykonos-what-it-actually-is",
    category: "sea", destSlug: "mykonos", wikiTitle: "Mykonos",
    excerpt: "Mykonos is not a place anymore. It is a brand. Understanding this is the first step toward enjoying it — or toward knowing why you shouldn't go.",
    paragraphs: [
      "Mykonos is the most commercially successful Greek island and, depending on your perspective and your bank balance, either a perfectly engineered pleasure machine or a cautionary tale about what happens when a beautiful place discovers what it is worth per square metre. Both things are simultaneously true. The island is genuinely beautiful — the Cycladic architecture of the Chora, with its perfect white cubes and proliferating blue doors, is as good as anywhere — and it has been thoroughly monetised in a way that has replaced most of its local character with an international luxury vernacular.",
      "The correct way to do Mykonos: go for two nights, not a week. Stay in the Chora, in a small hotel in the labyrinthine back streets rather than on the coast. Eat at Nikos Taverna, which has been operating in the same spot since 1957 and serves the same food with the same lack of ceremony. Explore Little Venice in the early morning, before the sunset crowds arrive, when the buildings overhang the water in a silence that belongs entirely to them.",
      "The beaches: Super Paradise, Paradise, Elia. They are what they are — loud, expensive, beautiful, full of people who have paid considerable sums to be seen being relaxed. If you go, go early, rent a sunbed, order a beer at 11am without guilt, and understand that you are participating in a specific international ritual that Mykonos has been perfecting since the 1970s.",
      "What Mykonos does extremely well: it is the best organised island in the Cyclades. The water is clear, the ferries run on time, the nightlife operates at a genuinely international level if that is what you want, and the infrastructure that comes with extreme wealth — excellent restaurants, well-maintained streets, reliable service — is visible everywhere. It has simply decided to be this thing, and it is very good at it.",
    ]
  },
  // CRETE
  {
    title: "The Cretan Interior: Going Off the Tourist Map",
    slug: "cretan-interior-off-the-tourist-map",
    category: "mountain", destSlug: "chania", wikiTitle: "Crete",
    excerpt: "Most visitors to Crete see the coast and call it Crete. The interior — the Lefka Ori, the Amari Valley, the villages that have not changed since the Byzantine era — is a different country entirely.",
    paragraphs: [
      "The standard Crete experience: arrive at Heraklion Airport, transfer to a beach hotel somewhere between Hersonissos and Malia, spend ten days swimming in the Libyan Sea and eating at poolside restaurants. This is fine. The sea is as advertised. But it is not Crete in any meaningful sense.",
      "The Amari Valley, in the centre of the island, is what Crete was before tourism. A sequence of villages — Thronos, Monastiraki, Fourfouras — sit in a landscape of olive groves, almond trees, and mountains that rise in every direction to snow-capped peaks. The valley was systematically destroyed by German forces in World War II in reprisal for resistance activities; many of the villages were rebuilt from scratch in the 1950s on the foundations of the originals. Walking through them, you feel the weight of recent history in a way that the beach resorts cannot replicate.",
      "The Samaria Gorge is the most famous walk in Crete and rightly so — 16 kilometres of descent through a limestone gorge that narrows, at the Sideroportes (Iron Gates), to a width of three metres with walls 300 metres high. It requires a full day, good knees, and early arrival; the most strenuous part is the first hour of steep descent, after which the valley opens and the walk becomes something approaching meditation.",
      "Eat in the village of Anogeia, which is the cultural heartland of Cretan music and has maintained a stubborn independence through centuries of occupiers. The restaurant Mitsos serves roast lamb from a wood-fired oven and the house wine from an unlabelled carafe. This is the food of the Cretan interior: abundant, generous, based on ingredients produced within five kilometres, and requiring no menu because there is only one correct answer to what you should eat.",
    ]
  },
  // RHODEOS
  {
    title: "Rhodes Old Town: 2,400 Years in 90 Minutes",
    slug: "rhodes-old-town-2400-years-in-90-minutes",
    category: "culture", destSlug: "rhodes", wikiTitle: "Rhodes",
    excerpt: "The medieval city of Rhodes is the largest inhabited medieval town in Europe. It is also, inexplicably, still lived in — 6,000 people wake up inside its walls every morning.",
    paragraphs: [
      "The Old Town of Rhodes is UNESCO World Heritage, entirely enclosed within medieval walls built by the Knights Hospitaller in the fourteenth century, and still functioning as a living neighbourhood rather than a museum. People live there, run laundries and hardware shops and bakeries there, park their motorcycles in the street there, conduct the ordinary business of a small Greek town — within walls that have stood for 700 years.",
      "Enter through the d'Amboise Gate in the northwest and walk east along the Street of the Knights, which is the most intact medieval street in the Mediterranean: the palaces of the individual national langues of the Knights — Italian, French, Spanish, Provençal — face each other across a cobbled lane barely wide enough for two people to pass. The effect, if you arrive early enough to have it to yourself, is genuinely anachronistic.",
      "The Palace of the Grand Masters, at the top of the Street of the Knights, was destroyed in a gunpowder explosion in 1856 and reconstructed by the Italian colonial administration in the 1930s as a summer residence for Mussolini — who never used it. The interior mixes Byzantine mosaic floors (authentic, removed from Kos) with Fascist-era furniture, which creates an atmosphere of considerable historical dissonance. Worth seeing for this reason alone.",
      "The lower town, below the Street of the Knights, is the daily-life Rhodes: the market street of Sokrates is the commercial spine, flanked by shops selling herbs, sponges, ceramics, and excellent olive oil. The mosque of Süleyman — built in 1522 after the Ottoman conquest — still anchors the market area with its pink minaret, the only functioning architectural relic of 250 years of Ottoman administration.",
    ]
  },
  // PELION
  {
    title: "The Pelion Peninsula in Winter: A Forgotten Greece",
    slug: "the-pelion-peninsula-in-winter",
    category: "mountain", destSlug: "pelion", wikiTitle: "Pelion",
    excerpt: "The mountain peninsula where the centaurs lived is at its most itself in November. The chestnuts are falling, the sea is empty, and the stone-roofed villages have the quality of somewhere time genuinely stopped.",
    paragraphs: [
      "The Pelion Peninsula juts south from the Thessalian coast into the Aegean, a 52-kilometre thumb of forested mountain separating the Pagasetic Gulf from the open sea. In summer it functions as a weekender destination for Athenians and Volosans escaping the urban heat; the beaches of the eastern coast — Mylopotamos, Damouchari, Fakistra — are among the most beautiful in mainland Greece, accessible by footpath or boat, and known to a specific demographic of well-travelled Greeks who have determined that Pelion is the correct answer to the question of where to go without going to an island.",
      "In winter, between October and March, the peninsula reveals what it actually is. The beech and chestnut forests go through a transformation that the Aegean landscape rarely offers: genuine autumn colour, then bare grey branches, then sometimes snow on the upper slopes down to 600 metres, against which the stone villages — Makrinitsa, Vizitsa, Tsangarada — appear as illustrations from a Greek fairy tale that someone forgot to publish.",
      "Tsangarada is the highest village, at 550 metres on the eastern edge of the ridge, above the steep descent to the sea. It is built along a single long street through the forest, without a central plateia, the houses separated by gardens of enormous magnolias and ancient plane trees. The plane tree in the central square of Agia Kyriaki, which is claimed to be 1,000 years old and has a circumference of 18 metres, may be the largest tree in Greece. Sitting underneath it in November, in the silence of a Tuesday with no tourists, is an experience that has no obvious equivalent.",
      "The food of the Pelion in winter: hilopites (local egg pasta) with wild mushroom sauce, slow-braised rabbit, spoon sweets made from the bergamot citrus that grows uniquely in the area, and tsipouro from Volos — the local version of grappa, served warm with a spoon sweet and a glass of water, which is the correct format for the consumption of tsipouro in all seasons.",
    ]
  },
  // IKARIA
  {
    title: "A Week on Ikaria: And Why I Still Haven't Left",
    slug: "a-week-on-ikaria-and-why-i-still-havent-left",
    category: "sea", destSlug: "ikaria", wikiTitle: "Ikaria",
    excerpt: "Ikaria is one of the world's Blue Zones — places where people routinely live past 100. The locals attribute this to the wine, the afternoon nap, the refusal to hurry, and a certain philosophical indifference to what the rest of the world considers normal.",
    paragraphs: [
      "The ferry arrives at Ikaria's port of Agios Kirykos at a time that depends entirely on the weather, the mood of the captain, and the patience of the other passengers. When I arrived for what I planned to be a four-day stay, I had been on the boat for six hours from Piraeus and the island had kept itself invisible in sea mist for the entire approach. This is Ikaria's characteristic entrance: it makes you wait for it.",
      "Ikaria is a long, narrow island in the eastern Aegean, mountainous, densely forested in the west, bare and volcanic in the east, with a coastline of such geological aggression — sheer cliffs, narrow inlets, beaches accessible only by path or boat — that the entire road network was built as a single switchback that takes 3 hours to drive the island's 40-kilometre length.",
      "The panigiri — the village festival — is Ikaria's defining social institution. They happen throughout summer, announced only by word of mouth, held in village squares and church courtyards, and they typically begin around midnight and end when the musicians stop or pass out, whichever comes first. The music is traditional — tsampuna, violin, touberleki — and people dance in the old circular style for hours. Wine and food are served without charge; expenses are covered by the community. The philosophy behind this is that a festival from which someone profits is not a festival.",
      "The food: local wine from the barrel (a specific Ikarian wine with a particular tartness and a reputation for causing memory loss in the morning), wild horta (greens) dressed with local olive oil and lemon, fresh fish from the boats that come in at Agios Kirykos in the early morning, and revithada — the Ikarian chickpea soup, slow-cooked overnight in the clay pot, eaten at Sunday lunch. The Ikarians eat very little meat, a great deal of legumes, almost no processed food, and they take a long afternoon rest as a matter of serious cultural principle.",
      "I stayed for twelve days. The reason is not complicated: Ikaria is the only place I have been where the pace of life makes immediate, visceral sense. The urgency that animates most of the places I live and visit — the sense that time is finite and must be managed — simply does not operate here. This is not laziness. It is a different, arguably more accurate relationship with the fact of being alive.",
    ]
  },
];

async function getWikimediaImage(wikiTitle: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(wikiTitle)}`;
    const data = await (await fetch(url, { headers: { 'User-Agent': 'CYouInGreece/1.0' } })).json();
    const src = (Object.values(data.query?.pages ?? {})[0] as any)?.original?.source;
    if (!src) return null;
    const l = src.toLowerCase();
    if (l.endsWith('.svg') || l.includes('map') || l.includes('flag') || l.includes('locator')) return null;
    return src;
  } catch { return null; }
}

async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CYouInGreece/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 5000) throw new Error('Too small');
    const asset = await client.assets.upload('image', Buffer.from(buf), { filename: filename.substring(0, 80) });
    return asset._id;
  } catch (e: any) { console.error(`  ❌ ${e.message}`); return null; }
}

async function run() {
  // ── STEP 1: Link existing articles to destinations ──────────────────────
  console.log('\n🔗 Step 1: Linking articles to destinations...\n');

  for (const [artSlug, destSlugs] of Object.entries(ARTICLE_DESTINATION_LINKS)) {
    const artId = await client.fetch(`*[_type == "article" && slug.current == $s][0]._id`, { s: artSlug });
    if (!artId) { console.log(`  ⏭️  Article not found: ${artSlug}`); continue; }

    const destIds: string[] = [];
    for (const ds of destSlugs) {
      const id = await client.fetch(`*[_type == "destination" && slug.current == $s][0]._id`, { s: ds });
      if (id) destIds.push(id);
    }
    if (!destIds.length) { console.log(`  ⚠️  No destinations found for: ${artSlug}`); continue; }

    await client.patch(artId).set({
      related_destinations: destIds.map(id => ({ _type: 'reference', _ref: id, _key: uuidv4() }))
    }).commit();
    console.log(`  ✅ ${artSlug.substring(0, 50)} → [${destSlugs.join(', ')}]`);
    await new Promise(r => setTimeout(r, 300));
  }

  // ── STEP 2: Push new destination-specific articles ──────────────────────
  console.log('\n\n📰 Step 2: Pushing new destination articles...\n');

  for (const art of NEW_ARTICLES) {
    const exists = await client.fetch(`*[_type == "article" && slug.current == $s][0]._id`, { s: art.slug });
    if (exists) { console.log(`  ⏭️  Exists: "${art.title.substring(0, 50)}..."`); continue; }

    // Find destination reference
    const destId = await client.fetch(`*[_type == "destination" && slug.current == $s][0]._id`, { s: art.destSlug });

    // Get hero image
    console.log(`⏳ "${art.title.substring(0, 55)}..."`);
    let assetId: string | null = null;
    const imgUrl = await getWikimediaImage(art.wikiTitle);
    if (imgUrl) {
      console.log(`  📸 ${imgUrl.substring(0, 70)}...`);
      assetId = await uploadImage(imgUrl, `${art.slug.substring(0, 50)}-hero.jpg`);
    }

    const doc: any = {
      _type: 'article',
      title: art.title,
      slug: { _type: 'slug', current: art.slug },
      category: art.category,
      excerpt: art.excerpt,
      body: art.paragraphs.map(p => ({
        _type: 'block', _key: uuidv4(), style: 'normal',
        children: [{ _type: 'span', _key: uuidv4(), text: p, marks: [] }],
        markDefs: []
      })),
      published_at: new Date().toISOString(),
      ...(destId ? { related_destinations: [{ _type: 'reference', _ref: destId, _key: uuidv4() }] } : {}),
    };
    if (assetId) doc.hero_image = { _type: 'image', asset: { _type: 'reference', _ref: assetId } };

    await client.create(doc);
    console.log(`  ✅ Published!\n`);
    await new Promise(r => setTimeout(r, 800));
  }

  console.log('\n🎉 All done! Articles linked to destinations and new articles published.');
}

run();
