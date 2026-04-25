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
  const query = `*[_type == "destination" && slug.current == "santorini"][0]{hero_image, thematic_sections}`;
  const dest = await sanityClient.fetch(query);
  console.log(JSON.stringify(dest, null, 2));
}

run();
