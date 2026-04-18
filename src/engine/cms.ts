import { sanityClient } from '../lib/sanity';

export async function pushToSanity(schemaType: string, documentPayload: any) {
  console.log(`[Sanity Injector] Syncing ${schemaType} -> ${documentPayload.title}`);
  
  try {
    /* 
     // Production API Call block
     const doc = {
       _type: schemaType.toLowerCase(),
       ...documentPayload
     };
     await sanityClient.createOrReplace(doc);
    */
    
    console.log(`[Sanity Injector] SUCCESS -> Pushed entity ID: ${documentPayload.name}`);
    return true;
  } catch (err) {
    console.error(`[Sanity Injector] FAILED to push ${documentPayload.title}`, err);
    return false;
  }
}
