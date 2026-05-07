import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

// Helper function to normalize strings for comparison (e.g., "Epirus Highlands" -> "epirushighlands")
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function runReservoirAgent() {
  console.log('=============================================');
  console.log('🌊 RESERVOIR AGENT INITIALIZED');
  console.log('=============================================\n');

  const reservoirPath = path.join(process.cwd(), 'scripts', 'reservoir');
  
  if (!fs.existsSync(reservoirPath)) {
    console.log(`❌ Reservoir directory not found at: ${reservoirPath}`);
    return;
  }

  // Get all files in the reservoir
  const files = fs.readdirSync(reservoirPath).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    console.log('💧 The reservoir is empty. Please add image files to the "scripts/reservoir" folder.');
    return;
  }

  console.log(`📸 Found ${files.length} images in the reservoir. Analyzing...\n`);

  // Fetch all destinations
  const destinations = await sanityClient.fetch(`*[_type == "destination"]{_id, name_en}`);
  
  // Create a normalized map of destinations for quick lookup
  const destMap = new Map();
  destinations.forEach((d: any) => {
    destMap.set(normalizeName(d.name_en), d);
  });

  for (const file of files) {
    const filePath = path.join(reservoirPath, file);
    const parsed = path.parse(file);
    const normalizedFilename = normalizeName(parsed.name);

    console.log(`🔍 Checking match for image: "${file}"...`);
    
    const matchedDest = destMap.get(normalizedFilename);

    if (!matchedDest) {
      console.log(`   ⚠️ No matching destination found in Sanity for "${parsed.name}". Skipping.\n`);
      continue;
    }

    console.log(`   🎯 Match found! Destination: "${matchedDest.name_en}"`);
    console.log(`   ⬆️ Uploading to Sanity Database...`);

    try {
      const buffer = fs.readFileSync(filePath);
      
      const asset = await sanityClient.assets.upload('image', buffer, {
        filename: `${normalizedFilename}_reservoir${parsed.ext}`
      });

      console.log(`   🔗 Linking image to "${matchedDest.name_en}"...`);
      await sanityClient.patch(matchedDest._id).set({
        hero_image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      }).commit();
        
      console.log(`   ✅ Success! Image processed.\n`);
      
      // Optional: Move file to a 'processed' folder or delete it so it doesn't get processed twice
      const processedPath = path.join(reservoirPath, 'processed');
      if (!fs.existsSync(processedPath)) fs.mkdirSync(processedPath);
      fs.renameSync(filePath, path.join(processedPath, file));

    } catch (e: any) {
      console.error(`   ❌ Failed to upload/link: ${e.message}\n`);
    }
  }

  console.log('🎉 RESERVOIR AGENT HAS COMPLETED ITS WORK.');
}

runReservoirAgent().catch(console.error);
