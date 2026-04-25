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

const DESTINATIONS = [
  "Santorini", "Mykonos", "Naxos", "Paros", "Milos", "Chania", "Heraklion", "Rethymno", 
  "Rhodes", "Kos", "Patmos", "Symi", "Corfu", "Paxos", "Zakynthos", "Kefalonia", "Lefkada",
  "Ithaca", "Skiathos", "Skopelos", "Alonissos", "Skyros", "Thassos", "Samothrace", "Lemnos",
  "Lesvos", "Chios", "Samos", "Ikaria", "Syros", "Tinos", "Andros", "Sifnos", "Serifos",
  "Folegandros", "Amorgos", "Astypalaia", "Karpathos", "Kythira", "Aegina", "Hydra", "Spetses",
  "Poros", "Athens", "Thessaloniki", "Nafplio", "Delphi", "Meteora", "Zagori", "Mani", "Monemvasia", "Olympus"
];

const THEMES = [
  { category: 'Culture', keywords: ['culture', 'history', 'tradition', 'architecture'] },
  { category: 'Churches', keywords: ['church', 'monastery', 'religion', 'orthodox', 'chapel'] },
  { category: 'Museums', keywords: ['museum', 'archaeological', 'exhibition', 'ancient'] },
  { category: 'Gastronomy', keywords: ['cuisine', 'food', 'wine', 'gastronomy', 'restaurant', 'taverna'] },
  { category: 'Entertainment', keywords: ['nightlife', 'festival', 'entertainment', 'club'] }
];

async function getWikipediaData(query: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' Greece')}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query.search[0]?.title || query;

    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&explaintext=true&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const firstPage = Object.values(pages)[0] as any;
    
    return {
      extract: firstPage?.extract || `${query} is a beautiful destination in Greece.`,
      imageUrl: firstPage?.original?.source || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop'
    };
  } catch (e) {
    return {
      extract: `${query} is a beautiful destination in Greece.`,
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop'
    };
  }
}

async function getWikimediaImageForTheme(dest: string, theme: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(dest + ' ' + theme + ' Greece')}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    if (!searchData.query.search.length) return null;
    
    const title = searchData.query.search[0].title;
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const firstPage = Object.values(pages)[0] as any;
    return firstPage?.original?.source || null;
  } catch (e) {
    return null;
  }
}

async function uploadImageToSanity(imageUrl: string | null, filename: string) {
  if (!imageUrl) return null;
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), { filename });
    return asset._id;
  } catch (err) {
    return null;
  }
}

function extractRelevantParagraphs(text: string, keywords: string[]): string {
  const paragraphs = text.split('\n').filter(p => p.length > 50);
  const relevant = paragraphs.filter(p => keywords.some(k => p.toLowerCase().includes(k)));
  if (relevant.length === 0) return "Explore the rich local heritage and uncover hidden secrets of this amazing destination.";
  return relevant.slice(0, 3).join('\n\n');
}

async function processMasterDestination(dest: string) {
  console.log(`Building Master Profile for ${dest}...`);
  try {
    const wikiData = await getWikipediaData(dest);
    
    // 1. Upload Hero Image
    const heroAssetId = await uploadImageToSanity(wikiData.imageUrl, `${dest.toLowerCase()}-hero.jpg`);

    // 2. Build Thematic Sections
    const thematic_sections = [];
    for (const theme of THEMES) {
      const contentText = extractRelevantParagraphs(wikiData.extract, theme.keywords);
      const themeImageUrl = await getWikimediaImageForTheme(dest, theme.category);
      const themeAssetId = await uploadImageToSanity(themeImageUrl, `${dest.toLowerCase()}-${theme.category.toLowerCase()}.jpg`);
      
      thematic_sections.push({
        _key: Math.random().toString(),
        _type: 'thematicSection',
        category: theme.category,
        title: `${theme.category} in ${dest}`,
        content: [
          {
            _key: Math.random().toString(),
            _type: "block",
            style: "normal",
            children: [{"_type": "span", "_key": Math.random().toString(), "text": contentText}]
          }
        ],
        hero_image: themeAssetId ? {
          _type: 'image',
          asset: { _type: 'reference', _ref: themeAssetId }
        } : undefined
      });
    }

    const typeMapping: Record<string, string> = {
      "Athens": "city", "Thessaloniki": "city", "Chania": "city", "Heraklion": "city", "Nafplio": "city",
      "Delphi": "archaeological_site", "Meteora": "archaeological_site",
      "Olympus": "mountain", "Zagori": "village", "Mani": "peninsula", "Monemvasia": "village"
    };

    const firstSentence = wikiData.extract.split('. ')[0] + '.';

    // 3. Construct Document
    const doc = {
      _type: 'destination',
      name_en: dest,
      name_local: dest,
      slug: { _type: 'slug', current: dest.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      type: typeMapping[dest] || 'island',
      tagline: `Discover the authentic beauty of ${dest}.`,
      intro_paragraph: wikiData.extract.substring(0, 500) + '...',
      body_content: [
        {
          _key: Math.random().toString(),
          _type: "block",
          style: "normal",
          children: [{"_type": "span", "_key": Math.random().toString(), "text": wikiData.extract.substring(0, 1000)}]
        }
      ],
      thematic_sections: thematic_sections,
      hidden_gems: [
        { _key: "1", _type: "hiddenGem", title: "Local Trails", description: "Explore the ancient pathways." },
        { _key: "2", _type: "hiddenGem", title: "Secret Cove", description: "A pristine spot away from the crowds." },
        { _key: "3", _type: "hiddenGem", title: "Historic Ruin", description: "Unmarked history." }
      ],
      gastronomy: [
        { _key: "1", _type: "gastronomyItem", dish_name: "Fresh Catch", where_to_find: "Harbor Taverna", description: "Grilled perfectly." },
        { _key: "2", _type: "gastronomyItem", dish_name: "Local Cheese", where_to_find: "Village Market", description: "Artisan made." },
        { _key: "3", _type: "gastronomyItem", dish_name: "Wild Greens", where_to_find: "Mountain Taverna", description: "Foraged daily." }
      ],
      top_experiences: [
        { _key: "1", _type: "experience", title: "Sunset Hike", description: "Watch the sun dip below the Aegean." },
        { _key: "2", _type: "experience", title: "Village Walk", description: "Discover the architecture." },
        { _key: "3", _type: "experience", title: "Boat Tour", description: "See the coast from the water." }
      ],
      hero_image: heroAssetId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: heroAssetId }
      } : undefined,
      seo: {
        meta_title: `Explore ${dest} | CYouInGreece`,
        meta_description: firstSentence
      },
      review_status: 'ai_draft',
      ai_generated: true,
      editor_approved: false
    };

    await sanityClient.create(doc);
    console.log(`✅ Successfully published Master Profile for ${dest}`);
  } catch (error) {
    console.error(`❌ Failed to process ${dest}:`, error);
  }
}

async function run() {
  console.log(`Starting Master Pipeline for ${DESTINATIONS.length} articles...`);
  // Process 1 at a time to avoid rate limits (Wikipedia & Sanity)
  for (const dest of DESTINATIONS) {
    await processMasterDestination(dest);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('🎉 All destinations masterfully processed!');
}

run();
