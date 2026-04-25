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
  "Rhodes", "Kos", "Patmos", "Symi", "Corfu", "Paxos", "Zakynthos", "Kefalonia", "Lefkada", "Athens"
];

const THEMES = [
  { category: 'Culture', keywords: ['culture', 'history', 'tradition', 'architecture'] },
  { category: 'Churches', keywords: ['church', 'monastery', 'religion', 'orthodox', 'chapel'] },
  { category: 'Museums', keywords: ['museum', 'archaeological', 'exhibition', 'ancient'] },
  { category: 'Gastronomy', keywords: ['cuisine', 'food', 'wine', 'gastronomy', 'restaurant', 'taverna'] },
  { category: 'Entertainment', keywords: ['nightlife', 'festival', 'entertainment', 'club'] }
];

async function getWikipediaFullText(query: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' Greece')}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query.search[0]?.title || query;

    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&format=json&titles=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const firstPage = Object.values(pages)[0] as any;
    return firstPage?.extract || '';
  } catch (e) {
    return '';
  }
}

async function getWikimediaImageForTheme(dest: string, theme: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(dest + ' ' + theme + ' Greece')}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query.search[0]?.title || dest;

    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const firstPage = Object.values(pages)[0] as any;
    return firstPage?.original?.source || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop';
  } catch (e) {
    return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop';
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
    return null;
  }
}

function extractRelevantParagraphs(text: string, keywords: string[]): string {
  const paragraphs = text.split('\n').filter(p => p.length > 50);
  const relevant = paragraphs.filter(p => keywords.some(k => p.toLowerCase().includes(k)));
  if (relevant.length === 0) return "Explore the local beauty and uncover hidden secrets.";
  return relevant.slice(0, 3).join('\n\n');
}

async function processDestinationThematic(dest: string) {
  console.log(`Enriching ${dest}...`);
  try {
    // Find existing doc
    const query = `*[_type == "destination" && name_en == $dest][0]`;
    const existingDoc = await sanityClient.fetch(query, { dest });
    
    if (!existingDoc) {
      console.log(`Skipping ${dest}, not found in Sanity.`);
      return;
    }

    const fullText = await getWikipediaFullText(dest);
    const thematic_sections = [];

    for (const theme of THEMES) {
      const contentText = extractRelevantParagraphs(fullText, theme.keywords);
      const imageUrl = await getWikimediaImageForTheme(dest, theme.category);
      const imageAssetId = await uploadImageToSanity(imageUrl, `${dest.toLowerCase()}-${theme.category.toLowerCase()}.jpg`);
      
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
        hero_image: imageAssetId ? {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAssetId }
        } : undefined
      });
    }

    // Update the document
    await sanityClient.patch(existingDoc._id)
      .set({ thematic_sections })
      .commit();
      
    console.log(`✅ Successfully enriched ${dest} with 5 thematic sections.`);
  } catch (error) {
    console.error(`❌ Failed to enrich ${dest}:`, error);
  }
}

async function run() {
  console.log(`Starting enrichment of destinations...`);
  for (let i = 0; i < DESTINATIONS.length; i += 2) {
    const batch = DESTINATIONS.slice(i, i + 2);
    await Promise.all(batch.map(d => processDestinationThematic(d)));
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('🎉 Enrichment complete!');
}

run();
