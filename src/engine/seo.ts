export function generateSchema(nodeType: string, nodeName: string, description: string) {
  // Mapping to precise Schema.org taxonomy
  const typeMap: Record<string, string> = {
    'Region': 'TouristDestination',
    'Island': 'TouristDestination',
    'Restaurant': 'CulinaryEstablishment',
    'Museum': 'Museum',
    'Festival': 'Event',
  };

  const schemaType = typeMap[nodeType] || 'Place';

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": nodeName,
    "description": description,
    "url": `https://cyouingreece.com/destinations/${nodeName.toLowerCase().replace(/ /g, '-')}`
  };
}

export function generateLocalizedKeys(baseContent: any) {
  // Placeholder LLM translation routing logic
  // In production, this proxies out to Gemini to generate [EN, DE, FR, IT, ES, RO, RU, PL, EL]
  return {
    en: baseContent,
    de: { ...baseContent, _translated: true, _lang: 'de' },
    fr: { ...baseContent, _translated: true, _lang: 'fr' }
    // ... maps all 9 languages
  };
}
