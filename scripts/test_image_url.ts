import { createImageUrlBuilder } from '@sanity/image-url';
import { createClient } from '@sanity/client';

const cdnClient = createClient({ projectId: 'sntl6fxn', dataset: 'production', useCdn: true, apiVersion: '2024-04-18' });
const builder = createImageUrlBuilder(cdnClient);

try {
  console.log('Testing missing asset');
  const img = builder.image({ _type: 'image' });
  console.log(img.url());
} catch (e: any) {
  console.error('Error with missing asset:', e.message);
}
