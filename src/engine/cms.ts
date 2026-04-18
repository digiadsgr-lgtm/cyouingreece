import { sanityClient } from '../lib/sanity';

export async function pushToSanity(schemaType: string, documentPayload: any) {
  console.log(`[Sanity Injector] Syncing ${schemaType} -> ${documentPayload.title}`);
  
  try {
     // Production API Call block
     // Assuming documentPayload has an id or we create one
     const docId = `cyouingreece-${documentPayload.name.toLowerCase().replace(/\\s+/g, '-')}`;
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
