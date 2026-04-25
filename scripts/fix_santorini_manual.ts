import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
});

async function run() {
  const query = `*[_type == "destination" && slug.current == "santorini"][0]`;
  const dest = await sanityClient.fetch(query);
  
  if (!dest) {
    console.log("Santorini not found!");
    return;
  }

  // Update thematic sections with beautiful, handmade text
  const updatedSections = dest.thematic_sections.map((section: any) => {
    let newText = "";
    if (section.category === 'Gastronomy') {
      newText = "Santorini's volcanic soil yields produce with incredibly concentrated flavors. From the world-famous cherry tomatoes and white eggplants to the crisp, mineral-rich Assyrtiko wines, every meal here is an authentic taste of the Aegean. Savour fresh seafood by the caldera or enjoy traditional fava in a hidden taverna.";
    } else if (section.category === 'Culture') {
      newText = "A tapestry of resilience and beauty, Santorini’s culture is carved directly into the caldera cliffs. The iconic whitewashed cycladic architecture and blue-domed houses stand as a testament to centuries of island life, harmonizing human ingenuity with the raw power of nature.";
    } else if (section.category === 'Churches') {
      newText = "Scattered across the island are hundreds of quintessential blue-domed churches and hidden chapels. Whether perched precariously on a cliff edge in Oia or nestled in the medieval alleys of Pyrgos, these sanctuaries offer moments of profound serenity and breathtaking views of the endless blue.";
    } else if (section.category === 'Museums') {
      newText = "Unearth the secrets of the 'Minoan Pompeii' at the archaeological site of Akrotiri, perfectly preserved under volcanic ash for millennia. The Museum of Prehistoric Thera in Fira houses the magnificent frescoes and artifacts that reveal the island's highly advanced ancient civilization.";
    } else if (section.category === 'Entertainment') {
      newText = "As the legendary sun sets over the caldera, Santorini transforms. Enjoy a sophisticated evening tasting rare vintages at a cliffside wine bar in Imerovigli, or experience the vibrant, pulsing nightlife of Fira where the music seamlessly blends with the rhythm of the Aegean sea.";
    }

    if (newText) {
      section.content = [
        {
          _key: Math.random().toString(),
          _type: "block",
          style: "normal",
          children: [{"_type": "span", "_key": Math.random().toString(), "text": newText}]
        }
      ];
    }
    return section;
  });

  const updatedDoc = {
    ...dest,
    tagline: "The Crown Jewel of the Aegean.",
    intro_paragraph: "Rising gracefully from the azure waters of the Aegean, Santorini is a masterclass in dramatic landscapes and romantic allure. Known for its mesmerizing sunsets, volcanic beaches, and cliff-clinging whitewashed villages, it is a destination that captures the heart instantly.",
    thematic_sections: updatedSections
  };

  await sanityClient.createOrReplace(updatedDoc);
  console.log("SUCCESS! Santorini has been beautifully restored.");
}

run();
