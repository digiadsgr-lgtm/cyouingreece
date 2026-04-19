import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

// CDN client for image URL building (no token needed)
const cdnClient = createClient({ projectId, dataset, useCdn: true, apiVersion: '2024-04-18' });
const builder = createImageUrlBuilder(cdnClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
