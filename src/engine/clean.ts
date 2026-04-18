import 'dotenv/config';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

async function cleanSanity() {
  console.log("=== INITIATING SANITY MASS CLEANSING ===");
  try {
    const documents = await sanityClient.fetch('*[_type in ["region", "island", "poi"]][0...100]._id');
    if (documents.length === 0) {
      console.log("No documents found. Database is clean.");
      return;
    }
    
    console.log(`Found ${documents.length} garbage documents. Wiping...`);
    
    const transaction = sanityClient.transaction();
    documents.forEach((id: string) => {
      transaction.delete(id);
    });
    
    await transaction.commit();
    console.log("SUCCESS: All junk documents eradicated.");
  } catch(e) {
    console.error("Cleansing failed: ", e);
  }
}

cleanSanity();
