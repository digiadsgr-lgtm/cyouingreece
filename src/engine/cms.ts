import { sanityClient } from '../lib/sanity';


export async function uploadImageFromUrl(imageUrl: string, filename: string): Promise<{ _type: 'image', asset: { _ref: string, _type: 'reference' } } | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload standard buffer to Sanity
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: filename
    });
    
    return {
      _type: 'image',
      asset: {
        _ref: asset._id,
        _type: 'reference'
      }
    };
  } catch (err) {
    console.error(`[Sanity Upload] Failed to upload image from ${imageUrl}:`, err instanceof Error ? err.message : String(err));
    return null;
  }
}


export async function pushToSanity(schemaType: string, documentPayload: any) {
  console.log(`[Sanity Injector] Syncing ${schemaType} -> ${documentPayload.title}`);
  
  try {
     // Production API Call block
     // Stripping out all non-alphanumeric characters for a safe Sanity ID
     const rawName = documentPayload.name || documentPayload.title || 'unnamed-doc';
     const safeName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '-');
     const docId = `cyouingreece-${schemaType.toLowerCase()}-${safeName}`;
     const doc = {
       _id: docId,
       _type: schemaType.toLowerCase(),
       ...documentPayload
     };
     await sanityClient.createOrReplace(doc);
    
    console.log(`[Sanity Injector] SUCCESS -> Pushed entity ID: ${documentPayload.name}`);
    return true;
  } catch (err) {
    console.error(`[Sanity Injector] FAILED to push ${documentPayload.title}. Ensure schema '${schemaType.toLowerCase()}' exists in Sanity Studio.`, err instanceof Error ? err.message : String(err));
    return false;
  }
}
