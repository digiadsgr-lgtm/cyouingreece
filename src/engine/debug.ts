import 'dotenv/config';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

async function checkSanity() {
  const docs = await sanityClient.fetch('*[_type in ["region", "island", "poi"]]');
  console.log(`Found ${docs.length} documents in Sanity.`);
  if (docs.length > 0) {
    console.log("First document heroImage:", docs[0].heroImage);
  }
}
checkSanity();
