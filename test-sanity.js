const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: 'sntl6fxn',
  dataset: 'production',
  useCdn: false,
  token: 'skXiyciG2V7kFodQB6ZwP6yEb5y42sASNJ0BfW1vcgCamcuSWwgREP4dWebJe8qOaAk3uqXrkFpQCxnPnaK7tvvaouGPhghPx7sHNalPN394eMMt1ETGtWSMUsIWcB7hNK6RF8edkKNg7e7SXBzvBMtSdiGnTS6oEHBhPljK3C8sua7TITHB',
  apiVersion: '2024-04-18',
});

async function run() {
  const result = await sanityClient.fetch('*[_type in ["region", "island", "poi"]] | order(updatedAt desc) [0...20]');
  console.log("Documents Found:", result.length);
  if (result.length > 0) {
    console.log("First document:", result[0]._id, result[0]._type, result[0].title || result[0].name);
  }
}

run();
