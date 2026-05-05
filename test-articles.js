const { createClient } = require('@sanity/client');
const client = createClient({ projectId: 'sntl6fxn', dataset: 'production', useCdn: false, apiVersion: '2024-04-18' });

async function check() {
  try {
    const articles = await client.fetch('*[_type == "article"] { _id, title, "hasHero": defined(hero_image.asset), "hasExcerpt": defined(excerpt), "hasBody": defined(body) }');
    console.log("Total articles:", articles.length);
    console.log("Articles:");
    articles.forEach(a => {
      console.log(`- ${a.title} (ID: ${a._id}) [Hero: ${a.hasHero}, Excerpt: ${a.hasExcerpt}, Body: ${a.hasBody}]`);
    });
  } catch (err) {
    console.error(err);
  }
}
check();
