import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'sntl6fxn', dataset: 'production',
  useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18',
});

// Re-use existing uploaded Sanity image assets to cover missing items
// These image _refs are already in Sanity CDN — no external download needed
async function run() {
  // Get all existing image asset refs from destinations that DO have images
  const withImages = await client.fetch(
    `*[_type == "destination" && defined(hero_image.asset._ref)]{ name_en, slug, "ref": hero_image.asset._ref } | order(name_en asc)`
  );
  
  const bySlug: Record<string, string> = {};
  for (const d of withImages) bySlug[d.slug?.current] = d.ref;

  console.log(`Found ${withImages.length} destinations with images to re-use from\n`);

  // Map: slug_to_fix → donor_slug (pick a visually similar destination)
  const REUSE_MAP: Record<string, string> = {
    // Destinations
    'thessaloniki':  'nafplio',        // mainland city
    'zagori':        'epirus',         // same region
    'olympus':       'pelion',         // mountain
    // Articles
    'folegandros-the-island-that-perfected-the-art-of-doing-nothing': 'folegandros',
    'amorgos-at-the-edge-of-the-world': 'sikinos',
    'the-art-of-the-greek-ferry-a-field-guide-to-slow-travel': 'ithaca',
    'arachova-the-mountain-village-that-lives-at-1-000-metres': 'pelion',
    'prespa-lakes-the-hidden-wilderness-at-the-triple-frontier': 'zagori',
    "crete-s-wild-interior-the-shepherd-s-kitchen": 'crete',
    'the-wine-regions-of-greece-that-france-doesn-t-want-you-to-know': 'santorini',
    'the-oldest-taverna-in-the-mani-still-serves-one-dish': 'epirus',
    'the-ferry-route-nobody-takes-but-should': 'ithaca',
    'hydra-the-island-that-banned-cars-in-1950-and-never-looked-back': 'hydra',
    'the-lost-villages-of-mani-where-greece-kept-its-secrets': 'nafplio',
  };

  // Also get article image refs for donation
  const artWithImages = await client.fetch(
    `*[_type == "article" && defined(hero_image.asset._ref)]{ "slug": slug.current, "ref": hero_image.asset._ref }`
  );
  for (const a of artWithImages) bySlug[a.slug] = a.ref;

  // Apply the reuse map
  for (const [targetSlug, donorSlug] of Object.entries(REUSE_MAP)) {
    const donorRef = bySlug[donorSlug];
    if (!donorRef) { console.log(`⚠️  No donor image for: ${donorSlug}`); continue; }

    // Find target document (could be destination or article)
    let docId = await client.fetch(
      `*[(_type == "destination" || _type == "article") && slug.current == $slug && !defined(hero_image.asset._ref)][0]._id`,
      { slug: targetSlug }
    );

    if (!docId) { 
      console.log(`⏭️  ${targetSlug} — already has image or not found`); 
      continue; 
    }

    await client.patch(docId).set({
      hero_image: { _type: 'image', asset: { _type: 'reference', _ref: donorRef } }
    }).commit();
    console.log(`✅ ${targetSlug} ← image from ${donorSlug}`);
  }

  console.log('\n🎉 Reuse complete!');
}

run();
