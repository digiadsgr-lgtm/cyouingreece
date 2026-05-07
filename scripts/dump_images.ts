import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-04-18',
});

async function run() {
  const data = await sanityClient.fetch(`*[_type == "destination" && defined(hero_image.asset)] { name_en, "url": hero_image.asset->url }`);
  console.log(JSON.stringify(data, null, 2));
}
run();
