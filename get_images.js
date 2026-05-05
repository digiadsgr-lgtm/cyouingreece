const { createClient } = require('@sanity/client');
const client = createClient({ projectId: 'sntl6fxn', dataset: 'production', useCdn: false, apiVersion: '2024-04-18' });

async function getImages() {
  const res = await client.fetch('*[_type == "destination" && defined(hero_image.asset)] { name_en, type, "url": hero_image.asset->url }');
  console.log('Destinations:', res.filter(d => d.type !== 'mountain' && d.type !== 'sea').slice(0, 3));
  console.log('Mountain:', res.filter(d => d.type === 'mountain').slice(0, 3));
  console.log('Sea:', res.filter(d => ['island', 'beach', 'peninsula'].includes(d.type)).slice(0, 3));
}
getImages();
