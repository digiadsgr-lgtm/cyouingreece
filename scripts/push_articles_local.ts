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
  {
    title: "The Forgotten Cyclades: Why Sikinos is the Last True Sanctuary",
    category: "sea",
    wikiQuery: "Sikinos",
    excerpt: "While its neighbors drown in the noise of summer, Sikinos remains an island of wind, stone, and deliberate slowness.",
    paragraphs: [
      "There is a moment when the ferry approaches Sikinos where the sea seems to grow darker, heavier. It is as if the Aegean itself recognizes the gravity of this place. You will not find the sprawling beach clubs of Mykonos here, nor the polished infinity pools of Santorini. What you will find is silence. The kind of silence that has texture.",
      "The Chora of Sikinos is a masterpiece of unpretentious Cycladic architecture. Whitewashed cubes spill down the hillside, their blue doors tightly shut against the meltemi winds. In the afternoon, the only sound is the rhythmic clacking of worry beads from the kafeneio and the distant braying of a donkey carrying supplies up the ancient stone paths.",
      "My secret? Walk past the main square just before sunset and take the narrow dirt trail toward the Monastery of Episkopi. It’s a Roman mausoleum converted into a Byzantine church, standing alone in a harsh, beautiful landscape. Sit there as the sun dips below the horizon. You will feel an profound isolation that is increasingly rare in the modern world.",
      "Sikinos does not beg to be loved. It demands to be understood. It is a sanctuary for those who travel not to escape, but to remember how to simply exist."
    ]
  },
  {
    title: "Silence in Meteora: Climbing the Monastic Pillars",
    category: "mountain",
    wikiQuery: "Meteora_monastery",
    excerpt: "Suspended between earth and sky, the monasteries of Meteora offer a spiritual isolation carved into the very stone of the Greek mainland.",
    paragraphs: [
      "To stand at the base of the Meteora pillars is to feel entirely insignificant. These colossal sandstone monoliths rise from the Thessalian plain like the fingers of a buried titan. For centuries, they have offered refuge to monks seeking proximity to the divine and isolation from the chaos of the world below.",
      "While most visitors arrive in air-conditioned coaches at noon, the true magic of Meteora is revealed at dawn. The morning mist wraps around the base of the rocks, leaving only the monasteries floating above the clouds. The air is crisp, smelling of damp earth and burning incense from the early morning liturgies.",
      "Forget the main paved roads. Take the old monk trails that weave through the forest at the base. You might stumble upon the ruined, abandoned hermitages—shallow caves where ascetics once lived their entire lives suspended in wooden baskets.",
      "Meteora is not just a geological wonder; it is a monument to human determination. It forces you to look up, both literally and spiritually, and wonder what kind of faith it takes to build a life in the clouds."
    ]
  },
  {
    title: "Delphi at Dawn: Hearing the Oracle in the Wind",
    category: "culture",
    wikiQuery: "Delphi",
    excerpt: "Before the tour buses arrive, the navel of the ancient world still whispers the secrets of Apollo to those willing to listen.",
    paragraphs: [
      "They called it the Omphalos, the navel of the earth. Even today, as you drive up the winding roads of Mount Parnassus, you can feel a shift in the atmosphere. The air grows thinner, colder, charged with a strange electricity. Delphi is a place where the veil between the human and the divine feels incredibly thin.",
      "If you walk the Sacred Way at first light, before the heat of the Greek sun bakes the marble, the silence is absolute. The Temple of Apollo sits ruined but majestic, overlooking a valley of olive trees that flows like a silver river down to the Gulf of Corinth.",
      "My advice: don't just look at the ruins. Sit on the stone bleachers of the ancient stadium above the temple. Close your eyes. Listen to the wind rushing through the pine trees. It was in this wind that the Pythia, the high priestess, heard the voice of Apollo. Some say, if you are quiet enough, you can still hear it.",
      "Delphi strips away your modern certainties. It leaves you standing on a mountainside, acutely aware of the deep, echoing history of the human search for meaning."
    ]
  },
  {
    title: "The Anatomy of True Fava: A Schinoussa Secret",
    category: "gastronomy",
    wikiQuery: "Schinoussa",
    excerpt: "Forget what you know about Greek dips. On the tiny island of Schinoussa, the humble yellow split pea is elevated to an art form.",
    paragraphs: [
      "In the Lesser Cyclades, luxury is not defined by thread counts or Michelin stars. Luxury is a bowl of warm fava, drizzled with olive oil that was pressed a few miles away, served with bread baked that morning. And nowhere is this luxury more profound than on the tiny island of Schinoussa.",
      "The soil here is arid, volcanic, seemingly inhospitable. Yet, it produces a rare variety of yellow split pea that is sweeter, earthier, and infinitely more complex than any you will find in an Athenian supermarket. The local farmers harvest it by hand, respecting a rhythm that has not changed in centuries.",
      "If you find yourself at the small taverna near the port of Mersini, order the fava. It arrives warm, the texture of velvet, topped with raw, sharp red onions and local capers that burst with the taste of the sea. It is a dish that tastes entirely of its terroir.",
      "True Greek gastronomy is not about complexity. It is about the absolute mastery of simplicity. It is the understanding that when your ingredients are born from the sun and the salt, they need nothing else."
    ]
  }
];

async function getWikimediaImage(query: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' Greece')}&utf8=&format=json`;
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
    console.error(`Failed to upload image ${imageUrl}:`, err);
    return null;
  }
}

async function run() {
  console.log(`🚀 Starting manual generation of ${ARTICLES.length} Journal Articles...`);
  
  for (const article of ARTICLES) {
    console.log(`\n⏳ Pushing article: "${article.title}"...`);
    try {
      let imageUrl = await getWikimediaImage(article.wikiQuery);
      let imageAssetId = null;
      
      if (imageUrl) {
        console.log(`   📸 Found Wikimedia image: ${imageUrl}`);
        imageAssetId = await uploadImageToSanity(imageUrl, `${article.title.replace(/[^a-z0-9]/gi, '_')}-hero.jpg`);
      }

      const portableTextBody = article.paragraphs.map(para => ({
        _type: 'block',
        _key: uuidv4(),
        style: 'normal',
        children: [{ _type: 'span', _key: uuidv4(), text: para, marks: [] }]
      }));

      const doc = {
        _type: 'article',
        title: article.title,
        slug: { _type: 'slug', current: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') },
        category: article.category,
        excerpt: article.excerpt,
        body: portableTextBody,
        hero_image: imageAssetId ? {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAssetId }
        } : undefined,
        published_at: new Date().toISOString()
      };

      await sanityClient.create(doc);
      console.log(`✅ Successfully published "${article.title}"`);
    } catch (error) {
      console.error(`❌ Failed to process "${article.title}":`, error);
    }
  }
  
  console.log('🎉 All manual articles generated and synced to Sanity!');
}

run();
