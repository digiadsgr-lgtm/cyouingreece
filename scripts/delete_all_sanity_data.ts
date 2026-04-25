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
  console.log('Fetching all destinations...');
  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id}`);
  console.log(`Found ${destinations.length} destinations to delete.`);
  
  for (const dest of destinations) {
    try {
      await sanityClient.delete(dest._id);
      console.log(`Deleted ${dest._id}`);
    } catch (e: any) {
      console.log(`Failed to delete ${dest._id}: ${e.message}`);
    }
  }

  console.log('Clean complete!');
}

run();
