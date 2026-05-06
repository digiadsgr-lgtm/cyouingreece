import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const sanityClient = createClient({
  projectId: 'sntl6fxn',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-04-18',
});

async function run() {
  const athens = await sanityClient.fetch(`*[_type == "destination" && slug.current == "athens"][0] { body_content }`);
  const images = athens.body_content?.filter((b: any) => b._type === 'image') || [];
  console.log("Images found:", images.length);
  console.log(JSON.stringify(images, null, 2));
}

run();
