import * as dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-04-18',
  token: process.env.SANITY_API_TOKEN,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function getUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' Greece')}&orientation=landscape&per_page=1`, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });
    if (!res.ok) {
      console.warn(`⚠️ Unsplash API Error: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch (e) {
    return null;
  }
}

async function getWikimediaImage(query: string) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' Greece')}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query.search[0]?.title || query;

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

async function fetchYoutubeLink(destinationName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  let retries = 3;
  while(retries > 0) {
    try {
      const result = await model.generateContent(`Find a realistic YouTube URL for a high-quality travel documentary or 4K drone video of ${destinationName}, Greece. Return ONLY the URL string, nothing else. No markdown.`);
      const text = result.response.text().trim();
      if (text.startsWith('http')) return text;
      return null;
    } catch (err: any) {
      if (err.message && err.message.includes('429')) {
        console.log("⏳ Rate limit hit while fetching YT link. Sleeping...");
        await sleep(30000);
        retries--;
      } else {
        return null;
      }
    }
  }
  return null;
}

async function run() {
  console.log("🔧 MEDIA FIXER IS ON DUTY.");

  // 1. Fix missing YouTube URLs in Destinations
  const missingYT = await sanityClient.fetch(`*[_type == "destination" && !defined(youtube_video_url)]{_id, name_en}`);
  console.log(`Found ${missingYT.length} destinations missing YouTube URLs.`);
  
  for (const doc of missingYT) {
    console.log(`Fixing YouTube URL for ${doc.name_en}...`);
    const ytLink = await fetchYoutubeLink(doc.name_en);
    if (ytLink) {
      await sanityClient.patch(doc._id).set({ youtube_video_url: ytLink }).commit();
      console.log(`   ✅ Sourced: ${ytLink}`);
    } else {
      console.log(`   ❌ Could not source video.`);
    }
    await sleep(2000);
  }

  // 2. Fix missing Hero Images in Destinations
  const missingImages = await sanityClient.fetch(`*[_type == "destination" && !defined(hero_image)]{_id, name_en}`);
  console.log(`\nFound ${missingImages.length} destinations missing Hero Images.`);
  
  for (const doc of missingImages) {
    console.log(`Fixing Hero Image for ${doc.name_en}...`);
    let imgUrl = await getUnsplashImage(doc.name_en);
    
    if (imgUrl) {
      console.log(`   - 📸 Sourced Premium Unsplash Image`);
    } else {
      console.log(`   - ⚠️ Unsplash failed or Rate Limited. Falling back to Wikimedia.`);
      imgUrl = await getWikimediaImage(doc.name_en);
    }

    if (imgUrl) {
      const assetId = await uploadImageToSanity(imgUrl, `${doc.name_en}-hero.jpg`);
      if (assetId) {
        await sanityClient.patch(doc._id).set({ hero_image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } } }).commit();
        console.log(`   ✅ Image uploaded and linked.`);
      }
    } else {
      console.log(`   ❌ Could not find image anywhere.`);
    }
    await sleep(2000); // Breathe
  }

  console.log("🏁 MEDIA FIXER SHIFT COMPLETE.");
}

run();
