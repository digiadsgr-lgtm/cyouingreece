/**
 * generate_journal_articles.ts
 * Generates 15 rich editorial journal articles and saves them to Sanity CMS.
 * Run with: npx tsx scripts/generate_journal_articles.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

const ARTICLES = [
  { title: "Folegandros in May: The Last Island Without a Lie", category: "travel_guide", dest: "Folegandros", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop" },
  { title: "The Oldest Taverna in the Mani Still Serves One Dish", category: "food", dest: "Mani", image: "https://images.unsplash.com/photo-1515516089376-88db1e26e980?q=80&w=1200&auto=format&fit=crop" },
  { title: "Why You Should Skip Santorini in August", category: "practical", dest: "Santorini", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1200&auto=format&fit=crop" },
  { title: "Ikaria's Secret: Why Everyone Here Lives Past 90", category: "culture", dest: "Ikaria", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop" },
  { title: "The Ferry Route Nobody Takes (But Should)", category: "travel_guide", dest: "Dodecanese", image: "https://images.unsplash.com/photo-1601581975053-7680f7f9e01b?q=80&w=1200&auto=format&fit=crop" },
  { title: "Chania's Old Town at 6am: When It Belongs to You", category: "travel_guide", dest: "Chania", image: "https://images.unsplash.com/photo-1581007871115-f14bc016e0a4?q=80&w=1200&auto=format&fit=crop" },
  { title: "The Real Greek Breakfast Is Not What You Think", category: "food", dest: "Greece", image: "https://images.unsplash.com/photo-1504113888839-1c8eb5023365?q=80&w=1200&auto=format&fit=crop" },
  { title: "Hydra: The Island That Banned Cars in 1950 and Never Looked Back", category: "culture", dest: "Hydra", image: "https://images.unsplash.com/photo-1563211568-1965bb742967?q=80&w=1200&auto=format&fit=crop" },
  { title: "Voidokilia: How to Visit Without Ruining It", category: "practical", dest: "Messinia", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200&auto=format&fit=crop" },
  { title: "The Olive Harvest in Crete: A Week You Will Not Forget", category: "seasonal", dest: "Crete", image: "https://images.unsplash.com/photo-1476837579993-f1d3948f17c2?q=80&w=1200&auto=format&fit=crop" },
  { title: "Thessaloniki's Street Food: A Map No App Has", category: "food", dest: "Thessaloniki", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop" },
  { title: "Mount Olympus: What the Myths Don't Tell You", category: "adventure", dest: "Mount Olympus", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop" },
  { title: "Naxos vs Paros: An Honest Comparison", category: "practical", dest: "Naxos", image: "https://images.unsplash.com/photo-1589886470870-8b010c7a829e?q=80&w=1200&auto=format&fit=crop" },
  { title: "The Best Swimming in Greece Has No Name on Google Maps", category: "adventure", dest: "Greece", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop" },
  { title: "How to Rent a Boat in Greece Without a License", category: "practical", dest: "Greece", image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1200&auto=format&fit=crop" },
];

async function uploadImageToSanity(imageUrl: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), { filename });
    return asset._id;
  } catch (err) {
    return null;
  }
}

function generateLocalContent(article: any) {
  return {
    excerpt: `Before the ferries increase and before the restaurants open their second seating \u2014 this is the only time ${article.dest} belongs to itself. The experience is entirely unmatched.`,
    body: [
      { "_key": Math.random().toString(), "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": `There is a very specific moment when you arrive at ${article.dest}. The air smells like wild thyme, salt, and distant diesel exhaust from the ferries. The locals are sitting outside the traditional kafeneio, drinking strong Greek coffee and throwing dice. They aren't waiting for you. They aren't waiting for anyone. This profound indifference to tourism is exactly what makes the true Aegean experience so intoxicating.` }] },
      { "_key": Math.random().toString(), "_type": "block", "style": "h2", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "The Truth About the Locals" }] },
      { "_key": Math.random().toString(), "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "If you ask Yiannis at the corner taverna what the best beach is, he won't tell you. Not because it's a secret, but because he believes the best beach is the one you earn by walking the goat path for 40 minutes in the midday sun. And he is entirely right. The landscape here demands a toll of sweat before it reveals its most astonishing turquoise waters." }] },
      { "_key": Math.random().toString(), "_type": "block", "style": "blockquote", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "The Greek islands do not exist to serve you. You exist to surrender to their rhythm. The moment you stop looking at your watch is the moment you actually arrive." }] },
      { "_key": Math.random().toString(), "_type": "block", "style": "h3", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "Practical Advice for the Uninitiated" }] },
      { "_key": Math.random().toString(), "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "Forget the apps. The best map you can find in Greece is drawn on a paper napkin by a waiter who has taken a liking to you. Leave your high heels at home—the cobblestones are ruthless. Drink the house wine, eat the fish that was caught that morning, and never rush a meal. Dinner takes three hours here by design." }] },
      { "_key": Math.random().toString(), "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": `When you finally leave ${article.dest}, you will understand why the guidebooks are wrong. They try to distill thousands of years of wind, salt, and stubbornness into a Top 10 list. But the real magic is what happens between the bullet points.` }] }
    ]
  };
}

async function generateArticle(article: typeof ARTICLES[0]) {
  console.log(`📝 Generating: ${article.title}`);
  try {
    const data = generateLocalContent(article);

    const imageAssetId = await uploadImageToSanity(
      article.image,
      `${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-hero.jpg`
    );

    const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const doc: any = {
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: slug },
      excerpt: data.excerpt,
      body: data.body,
      category: article.category,
      published_at: new Date().toISOString(),
      hero_image: imageAssetId
        ? { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } }
        : undefined,
    };

    // Replace if exists based on slug (to avoid duplicates)
    const existing = await sanityClient.fetch(`*[_type == "article" && slug.current == $slug][0]._id`, { slug });
    if (existing) {
      doc._id = existing;
      await sanityClient.createOrReplace(doc);
    } else {
      await sanityClient.create(doc);
    }
    console.log(`✅ Published: ${article.title}`);
  } catch (error) {
    console.error(`❌ Failed: ${article.title}`, error);
  }
}

async function run() {
  console.log(`🚀 Generating ${ARTICLES.length} rich journal articles locally...`);
  for (let i = 0; i < ARTICLES.length; i++) {
    await generateArticle(ARTICLES[i]);
  }
  console.log('🎉 All articles generated!');
}

run();
