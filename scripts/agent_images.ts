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

async function getWikipediaImageUrl(title: string): Promise<string | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId && pageId !== '-1' && pages[pageId].original?.source) {
        let url = pages[pageId].original.source;
        if (url.toLowerCase().endsWith('.svg') || url.toLowerCase().includes('map') || url.toLowerCase().includes('flag')) {
             return null;
        }
        return url;
      }
    }
    if (!title.includes('Greece')) {
      return await getWikipediaImageUrl(`${title}, Greece`);
    }
    return null;
  } catch (error) {
    console.error(`Wikipedia API error for ${title}:`, error);
    return null;
  }
}

async function runImageAgent() {
  console.log('🤖 IMAGE AGENT INITIALIZED');
  console.log('Scanning Sanity Database for missing or broken images...\n');

  // Check Destinations
  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en, hero_image}`);
  let missingDestinations = destinations.filter((d: any) => !d.hero_image?.asset);
  
  // Check Articles
  const articles = await sanityClient.fetch(`*[_type == "article"]{_id, title, hero_image}`);
  let missingArticles = articles.filter((a: any) => !a.hero_image?.asset);

  console.log(`📊 SCAN RESULTS:`);
  console.log(`- Destinations missing images: ${missingDestinations.length}`);
  console.log(`- Articles missing images: ${missingArticles.length}\n`);

  if (missingDestinations.length === 0 && missingArticles.length === 0) {
    console.log('✅ All documents have valid images. Agent is sleeping.');
    return;
  }

  console.log('🚀 Starting automated healing process...\n');

  // Heal Destinations
  for (const dest of missingDestinations) {
    console.log(`🔍 [DESTINATION] Finding image for: ${dest.name_en}`);
    const imageUrl = await getWikipediaImageUrl(dest.name_en);
    if (!imageUrl) {
      console.log(`❌ Could not find a suitable image. Skipping.`);
      continue;
    }

    try {
      console.log(`📥 Downloading: ${imageUrl}`);
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buffer = await imgRes.arrayBuffer();
      
      console.log(`⬆️ Uploading to Sanity...`);
      const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
        filename: `${dest.name_en.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_hero.jpg`
      });

      console.log(`🔗 Patching database entry...`);
      await sanityClient.patch(dest._id).set({
        hero_image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      }).commit();
        
      console.log(`✅ Healed: ${dest.name_en}\n`);
    } catch (e: any) {
      console.error(`❌ Failed: ${e.message}\n`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  // Heal Articles
  for (const article of missingArticles) {
    console.log(`🔍 [ARTICLE] Finding image for: ${article.title}`);
    const imageUrl = await getWikipediaImageUrl(article.title);
    if (!imageUrl) {
      console.log(`❌ Could not find a suitable image. Skipping.`);
      continue;
    }

    try {
      console.log(`📥 Downloading: ${imageUrl}`);
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buffer = await imgRes.arrayBuffer();
      
      console.log(`⬆️ Uploading to Sanity...`);
      const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
        filename: `article_${article._id}_hero.jpg`
      });

      console.log(`🔗 Patching database entry...`);
      await sanityClient.patch(article._id).set({
        hero_image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      }).commit();
        
      console.log(`✅ Healed: ${article.title}\n`);
    } catch (e: any) {
      console.error(`❌ Failed: ${e.message}\n`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('🎉 IMAGE AGENT HAS FINISHED ITS PATROL.');
}

runImageAgent();
