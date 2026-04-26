import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  const destinations = await sanity.fetch(`*[_type == "destination"] {
    _id,
    name_en,
    "has_hero": defined(hero_image.asset),
    "has_body": defined(body_content) && length(body_content) > 0,
    "has_diary": defined(diary_entries) && length(diary_entries) > 0,
    "has_gallery": defined(gallery) && length(gallery) > 0
  }`);

  const missingHero = destinations.filter((d: any) => !d.has_hero).map((d: any) => d.name_en);
  const missingBody = destinations.filter((d: any) => !d.has_body).map((d: any) => d.name_en);
  const missingDiary = destinations.filter((d: any) => !d.has_diary).map((d: any) => d.name_en);

  console.log(`Total Destinations: ${destinations.length}`);
  console.log(`Missing Hero Images (${missingHero.length}):`, missingHero.slice(0, 10).join(', ') + (missingHero.length > 10 ? '...' : ''));
  console.log(`Missing Body Content (${missingBody.length}):`, missingBody.slice(0, 10).join(', ') + (missingBody.length > 10 ? '...' : ''));
  console.log(`Missing Diary Entries (${missingDiary.length}):`, missingDiary.slice(0, 10).join(', ') + (missingDiary.length > 10 ? '...' : ''));
}

run().catch(console.error);
