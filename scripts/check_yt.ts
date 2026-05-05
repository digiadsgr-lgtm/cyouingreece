import { createClient } from '@sanity/client';
const client = createClient({ projectId: 'sntl6fxn', dataset: 'production', useCdn: false, apiVersion: '2024-04-18' });
client.fetch('*[_type == "destination" && name_en == "Samothrace"]{name_en, youtube_video_url, review_status, nearby_destinations}').then(console.log);
