/**
 * JSON-LD structured data generators for CYouInGreece.
 * Helps Google understand and rank our content for rich results.
 */

// ── TouristDestination schema ───────────────────────────────────────────────
export function destinationJsonLd(dest: {
  name_en: string;
  name_local?: string;
  tagline?: string;
  intro_paragraph?: string;
  slug: { current: string };
  type?: string;
  hero_image?: { asset?: { url?: string } };
}) {
  const url = `https://cyouingreece.com/destination/${dest.slug.current}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: dest.name_en,
    alternateName: dest.name_local,
    description: dest.tagline || dest.intro_paragraph,
    url,
    image: dest.hero_image?.asset?.url || undefined,
    touristType: [
      { '@type': 'Audience', audienceType: 'Travelers' }
    ],
    containedInPlace: {
      '@type': 'Country',
      name: 'Greece',
    },
  };
}

// ── Article schema ──────────────────────────────────────────────────────────
export function articleJsonLd(article: {
  title: string;
  excerpt?: string;
  slug: { current: string };
  published_at?: string;
  hero_image?: { asset?: { url?: string } };
}) {
  const url = `https://cyouingreece.com/journal/${article.slug.current}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url,
    datePublished: article.published_at || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'Nikos',
      url: 'https://cyouingreece.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CYouInGreece',
      url: 'https://cyouingreece.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cyouingreece.com/logo.png',
      },
    },
    image: article.hero_image?.asset?.url || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

// ── WebSite schema (for homepage) ───────────────────────────────────────────
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CYouInGreece',
    url: 'https://cyouingreece.com',
    description: 'The most complete travel guide to Greece — editorial content, destination guides, food, culture, and travel advice written by people who live there.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://cyouingreece.com/journal?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CYouInGreece',
      url: 'https://cyouingreece.com',
    },
  };
}

// ── BreadcrumbList schema ───────────────────────────────────────────────────
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ── FAQ schema ──────────────────────────────────────────────────────────────
export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ── Helper: render JSON-LD as script tag ────────────────────────────────────
export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
    />
  );
}
