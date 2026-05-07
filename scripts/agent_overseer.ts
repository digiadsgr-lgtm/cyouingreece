import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

const isMissing = (val: any) => !val || (typeof val === 'string' && val.trim().length < 5);
const LOCALES = ['el', 'de', 'fr', 'ru'];

async function runOverseer() {
  console.log('=============================================');
  console.log('🦅 OVERSEER AGENT (System Diagnostics Director)');
  console.log('=============================================\n');

  console.log('📡 Fetching global state from Sanity Database...');
  
  const [destinations, articles] = await Promise.all([
    sanityClient.fetch(`*[_type == "destination"]{_id, name_en, hero_image, intro_paragraph, tagline, body_content, translations}`),
    sanityClient.fetch(`*[_type == "article"]{_id, title, hero_image, translations}`)
  ]);

  let imagesToHeal = 0;
  let translationsToHeal = 0;

  // Check Images
  destinations.forEach((d: any) => { if (!d.hero_image?.asset) imagesToHeal++; });
  articles.forEach((a: any) => { if (!a.hero_image?.asset) imagesToHeal++; });

  // Check Translations (Destinations only for quick scan)
  destinations.forEach((dest: any) => {
    const tl = dest.translations || {};
    for (const lang of LOCALES) {
      const locTl = tl[lang] || {};
      if (isMissing(locTl.intro_paragraph) || isMissing(locTl.tagline) || !locTl.body_content) {
        translationsToHeal++;
        break; // Only count the destination once if it has any translation issues
      }
    }
  });

  console.log('\n📊 OVERSEER REPORT:');
  console.log(`- Missing or Broken Hero Images: ${imagesToHeal}`);
  console.log(`- Documents missing localized content: ${translationsToHeal}\n`);

  if (imagesToHeal > 0) {
    console.log(`⚠️ OVERSEER SIGNAL: Activating Image Agent...`);
    console.log('Use: npx ts-node scripts/agent_images.ts');
  } else {
    console.log(`✅ Image Matrix: Healthy.`);
  }

  if (translationsToHeal > 0) {
    console.log(`⚠️ OVERSEER SIGNAL: Activating Content Agent...`);
    console.log('Use: npx ts-node scripts/agent_content.ts');
  } else {
    console.log(`✅ Content Matrix: Healthy.`);
  }

  console.log('\n🦅 Overseer patrol complete. Next check scheduled by system cron.');
}

runOverseer().catch(console.error);
