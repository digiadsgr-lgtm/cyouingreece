import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';
const client = createClient({ projectId: 'sntl6fxn', dataset: 'production', useCdn: false, token: process.env.SANITY_API_TOKEN, apiVersion: '2024-04-18' });

async function resetIncomplete() {
  const docs = await client.fetch('*[_type == "destination" && review_status == "needs_review" && !defined(youtube_video_url)]{_id, name_en}');
  console.log(`Found ${docs.length} incomplete destinations.`);
  for (const doc of docs) {
    console.log(`Resetting ${doc.name_en}...`);
    await client.patch(doc._id).set({ review_status: 'ai_draft' }).commit();
  }
}
resetIncomplete().catch(console.error);
