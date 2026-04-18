import { sanityClient } from '../lib/sanity';

export async function pushToSanity(schemaType: string, documentPayload: any) {
  console.log(`[Sanity Injector] Syncing ${schemaType} -> ${documentPayload.title}`);
  
  try {
     // Production API Call block
     // Stripping out all non-alphanumeric characters for a safe Sanity ID
     const safeName = documentPayload.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
     const docId = `cyouingreece-${safeName}`;
     const doc = {
       _id: docId,
       _type: schemaType.toLowerCase(),
       ...documentPayload
     };
     await sanityClient.createOrReplace(doc);
    
    console.log(`[Sanity Injector] SUCCESS -> Pushed entity ID: ${documentPayload.name}`);
    return true;
  } catch (err) {
    console.error(`[Sanity Injector] FAILED to push ${documentPayload.title}. Ensure schema '${schemaType.toLowerCase()}' exists in Sanity Studio.`, err.message);
    return false;
  }
}
