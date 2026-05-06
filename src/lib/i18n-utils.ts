export function getLocalizedField(doc: any, field: string, locale: string) {
  if (locale === 'en') return doc[field];
  
  const translation = doc.translations?.[locale];
  if (translation && translation[field]) {
    return translation[field];
  }
  
  // Fallback to English
  return doc[field];
}

// Map specific fields for Article/Destination
export function getLocalizedContent(doc: any, locale: string) {
  if (doc._type === 'destination') {
    return {
      name: doc.name_en, // Name usually stays the same or has name_local
      tagline: getLocalizedField(doc, 'tagline', locale),
      intro: getLocalizedField(doc, 'intro_paragraph', locale),
      body: getLocalizedField(doc, 'body_content', locale),
      diary: getLocalizedField(doc, 'diary_entries', locale),
      thematic_sections: getLocalizedField(doc, 'thematic_sections', locale),
    };
  }
  
  if (doc._type === 'article') {
    return {
      title: getLocalizedField(doc, 'tagline', locale) || doc.title, // I stored article title in 'tagline' in translationSet
      excerpt: getLocalizedField(doc, 'intro_paragraph', locale) || doc.excerpt,
      body: getLocalizedField(doc, 'body_content', locale) || doc.body,
    };
  }
  
  return doc;
}
