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

async function run() {
  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en, hero_image}`);
  let missing = destinations.filter((d: any) => !d.hero_image?.asset);
  console.log(`Total destinations: ${destinations.length}`);
  console.log(`Missing hero_image: ${missing.length}`);
  if (missing.length > 0) {
    missing.forEach((m: any) => console.log('- ' + m.name_en));
  }
}
run();
