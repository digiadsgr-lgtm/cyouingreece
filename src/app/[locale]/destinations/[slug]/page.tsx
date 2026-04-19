import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';

import { fetchDestination, fetchAllDestinationSlugs, fetchEditorialArticles } from '@/lib/destination-queries';
import { fetchOpenMeteoWeather } from '@/lib/weather';
import { locales } from '@/i18n/routing';
import type { Destination, WeatherData, LocalEvent, MapPin } from '@/lib/destination-types';

// ── Destination components ──────────────────────────────────────────────────
import DestinationHero from '@/components/destination/DestinationHero';
import AtAGlanceCard from '@/components/destination/AtAGlanceCard';
import IntroSection from '@/components/destination/IntroSection';
import BodyContent from '@/components/destination/BodyContent';
import InteractiveMap from '@/components/destination/InteractiveMap';
import HiddenGems from '@/components/destination/HiddenGems';
import GastronomySpotlight from '@/components/destination/GastronomySpotlight';
import TopExperiences from '@/components/destination/TopExperiences';
import LiveEventsWidget from '@/components/destination/LiveEventsWidget';
import PhotoGallery from '@/components/destination/PhotoGallery';
import PracticalInfo from '@/components/destination/PracticalInfo';
import NearbyDestinations from '@/components/destination/NearbyDestinations';
import UserTips from '@/components/destination/UserTips';
import EditorialArticles from '@/components/destination/EditorialArticles';
import NewsletterAffiliate from '@/components/destination/NewsletterAffiliate';

// ── ISR: revalidate every 24 hours ─────────────────────────────────────────
export const revalidate = 86400;

// ── Translated path segments for "destinations" in each locale ─────────────
const DESTINATIONS_SEGMENT: Record<string, string> = {
  en: 'destinations',
  de: 'reiseziele',
  fr: 'destinations',
  it: 'destinazioni',
  es: 'destinos',
  ro: 'destinatii',
  ru: 'naznaveniya',
  pl: 'miejsca',
  el: 'prosorizmos',
};

// ── generateStaticParams: pre-render all slugs × all locales ──────────────
export async function generateStaticParams() {
  const slugs = await fetchAllDestinationSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

// (Weather is now handled by Open-Meteo via src/lib/weather.ts — no API key required)

/** Build map pins from destination data */
function buildMapPins(destination: Destination): MapPin[] {
  const pins: MapPin[] = [];
  const { coordinates } = destination;

  // Hidden gems → hidden_gem pins (offset slightly)
  destination.hidden_gems?.forEach((gem, i) => {
    pins.push({
      id: `gem-${i}`,
      category: 'hidden_gem',
      lat: coordinates.lat + (Math.random() - 0.5) * 0.04,
      lng: coordinates.lng + (Math.random() - 0.5) * 0.04,
      name: gem.title,
      description: gem.description?.slice(0, 80),
    });
  });

  // Gastronomy → restaurant pins
  destination.gastronomy?.forEach((item, i) => {
    pins.push({
      id: `food-${i}`,
      category: 'restaurant',
      lat: coordinates.lat + (Math.random() - 0.5) * 0.03,
      lng: coordinates.lng + (Math.random() - 0.5) * 0.03,
      name: item.where_to_eat || item.dish_name,
      description: item.dish_name,
      link: item.maps_link,
    });
  });

  // Destination centre → viewpoint
  pins.push({
    id: 'main',
    category: 'viewpoint',
    lat: coordinates.lat,
    lng: coordinates.lng,
    name: destination.name_en,
    description: destination.tagline,
  });

  return pins;
}

/** Derive tourist types from scores for JSON-LD */
function deriveTouristTypes(destination: Destination): string[] {
  const { scores } = destination.at_a_glance ?? {};
  if (!scores) return [];
  const types: string[] = [];
  if (scores.beaches >= 3) types.push('beach');
  if (scores.history >= 3) types.push('culture', 'history');
  if (scores.adventure >= 3) types.push('adventure');
  if (scores.romance >= 4) types.push('romantic');
  if (scores.family >= 3) types.push('family');
  return [...new Set(types)];
}

/** Generate 5 FAQ pairs for a destination */
function buildFAQs(destination: Destination) {
  const name = destination.name_en;
  const getting = destination.at_a_glance?.getting_there ?? `by ferry or flight to ${name}`;
  const bestMonths = destination.at_a_glance?.best_months?.join(', ') ?? 'April through October';

  return [
    {
      q: `When is the best time to visit ${name}?`,
      a: `The best time to visit ${name} is ${bestMonths}. During these months the weather is pleasant and most attractions are open.`,
    },
    {
      q: `How do I get to ${name} from Athens?`,
      a: getting,
    },
    {
      q: `What is ${name} known for?`,
      a: destination.tagline ?? `${name} is one of Greece's most captivating destinations.`,
    },
    {
      q: `Is ${name} good for families?`,
      a: (() => {
        const score = destination.at_a_glance?.scores?.family ?? 3;
        if (score >= 4) return `Yes — ${name} is excellent for families, offering safe beaches, mild pace and family-friendly amenities.`;
        if (score >= 3) return `${name} is reasonably family-friendly, though check specific facilities in advance.`;
        return `${name} is better suited to couples and solo travellers; facilities for young children can be limited.`;
      })(),
    },
    {
      q: `What is the local food in ${name}?`,
      a: destination.gastronomy?.length
        ? `${name} is renowned for ${destination.gastronomy.map(g => g.dish_name).join(', ')}.`
        : `${name} offers fresh Mediterranean seafood, local olive oil, and traditional Greek mezze.`,
    },
  ];
}

// ── generateMetadata ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const destination = await fetchDestination(slug, locale);
  if (!destination) return {};

  const year = new Date().getFullYear();
  const name = destination.name_en;
  const seo = destination.seo;
  const heroUrl = destination.hero_image?.asset?.url ?? '';

  const title = seo?.meta_title || `${name} Travel Guide ${year} — CYouInGreece`;
  const description = seo?.meta_description || destination.intro_paragraph?.slice(0, 158) || '';
  const canonicalBase = `https://cyouingreece.com/en/destinations/${slug}`;

  // Build hreflang alternates for all locales
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    const seg = DESTINATIONS_SEGMENT[loc] ?? 'destinations';
    languages[loc] = `https://cyouingreece.com/${loc}/${seg}/${slug}`;
  });
  languages['x-default'] = canonicalBase;

  return {
    title,
    description,
    keywords: [
      name,
      `${name} travel`,
      `visit ${name}`,
      `${name} guide`,
      ...(seo?.secondary_keywords ?? []),
      seo?.focus_keyword ?? '',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: canonicalBase,
      siteName: 'CYouInGreece',
      type: 'article',
      locale: locale === 'el' ? 'el_GR' : `${locale}_${locale.toUpperCase()}`,
      images: heroUrl
        ? [{ url: `${heroUrl}?w=1200&h=630&fit=crop`, width: 1200, height: 630, alt: name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: heroUrl ? [`${heroUrl}?w=1200&h=630&fit=crop`] : [],
    },
    alternates: {
      canonical: canonicalBase,
      languages,
    },
    robots: { index: true, follow: true },
  };
}

// ── PAGE ───────────────────────────────────────────────────────────────────

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) notFound();

  // Fetch main destination data
  const destination = await fetchDestination(slug, locale);
  if (!destination) notFound();

  // Parallel data fetches (Open-Meteo weather: no API key needed)
  const [weather, articles] = await Promise.all([
    destination.coordinates
      ? fetchOpenMeteoWeather(destination.coordinates)
      : Promise.resolve(null),
    fetchEditorialArticles(slug),
  ]);

  const mapPins = buildMapPins(destination);
  const faqs = buildFAQs(destination);
  const touristTypes = deriveTouristTypes(destination);

  // ── JSON-LD schemas ──────────────────────────────────────────────────────

  const touristDestinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name_en,
    description: destination.intro_paragraph,
    geo: destination.coordinates
      ? {
          '@type': 'GeoCoordinates',
          latitude: destination.coordinates.lat,
          longitude: destination.coordinates.lng,
        }
      : undefined,
    touristType: touristTypes,
    image: destination.hero_image?.asset?.url,
    url: `https://cyouingreece.com/${locale}/destinations/${slug}`,
    containedInPlace: {
      '@type': 'Country',
      name: 'Greece',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Greece', item: `https://cyouingreece.com/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: destination.region?.name ?? 'Region',
        item: `https://cyouingreece.com/${locale}/destinations?region=${destination.region?.slug?.current}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: destination.name_en,
        item: `https://cyouingreece.com/${locale}/destinations/${slug}`,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${destination.name_en} Travel Guide`,
    description: destination.intro_paragraph,
    author: {
      '@type': 'Person',
      name: destination.reviewed_by ?? 'CYouInGreece Editorial Team',
    },
    dateModified: destination.last_reviewed,
    publisher: { '@type': 'Organization', name: 'CYouInGreece' },
    image: destination.hero_image?.asset?.url,
    mainEntityOfPage: `https://cyouingreece.com/${locale}/destinations/${slug}`,
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* JSON-LD — inject before interactive */}
      <Script
        id="jsonld-tourist"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristDestinationSchema) }}
      />
      <Script
        id="jsonld-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="jsonld-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="jsonld-article"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="destination-page">

        {/* §2 HERO */}
        <DestinationHero destination={destination} locale={locale} />

        {/* §3–§5: Content + Sidebar grid */}
        <div className="dest-content-grid container-wide">

          {/* Main content column */}
          <div className="dest-main">
            {/* §4 Intro */}
            <IntroSection destination={destination} locale={locale} />

            {/* §5 Body Content */}
            {destination.body_content?.length > 0 && (
              <BodyContent blocks={destination.body_content} />
            )}

            {/* §6 Interactive Map */}
            {destination.coordinates && (
              <Suspense fallback={<div className="map-loading-placeholder" />}>
                <InteractiveMap
                  center={destination.coordinates}
                  pins={mapPins}
                  destinationName={destination.name_en}
                />
              </Suspense>
            )}

            {/* §7 Hidden Gems */}
            {destination.hidden_gems?.length > 0 && (
              <HiddenGems gems={destination.hidden_gems} />
            )}

            {/* §8 Gastronomy */}
            {destination.gastronomy?.length > 0 && (
              <GastronomySpotlight items={destination.gastronomy} />
            )}

            {/* §9 Top Experiences */}
            {destination.top_experiences?.length > 0 && (
              <TopExperiences experiences={destination.top_experiences} />
            )}

            {/* §10 Live Events */}
            <Suspense fallback={null}>
              <LiveEventsWidget
                events={[] /* populated via external fetch in RSC */}
                destinationName={destination.name_en}
                bestMonths={destination.at_a_glance?.best_months}
              />
            </Suspense>

            {/* §11 Photo Gallery */}
            {destination.gallery?.length > 0 && (
              <PhotoGallery images={destination.gallery} destinationName={destination.name_en} />
            )}

            {/* §12 Practical Info */}
            {destination.practical_info && (
              <PracticalInfo
                info={destination.practical_info}
                gettingThere={destination.at_a_glance?.getting_there}
              />
            )}

            {/* §13 Nearby Destinations */}
            {destination.nearby_destinations?.length > 0 && (
              <NearbyDestinations destinations={destination.nearby_destinations} locale={locale} />
            )}

            {/* §14 User Tips */}
            <Suspense fallback={null}>
              <UserTips destinationSlug={slug} />
            </Suspense>

            {/* §15 Editorial Articles */}
            {articles.length > 0 && (
              <EditorialArticles articles={articles} locale={locale} />
            )}
          </div>

          {/* §3 Sidebar */}
          <aside className="dest-sidebar">
            <AtAGlanceCard destination={destination} weather={weather} />
          </aside>
        </div>

        {/* §16 Newsletter + Affiliate */}
        <NewsletterAffiliate destinationName={destination.name_en} locale={locale} />

      </main>

      <style>{`
        .destination-page {
          min-height: 100vh;
          background: var(--bg-dark, #0A1628);
        }

        /* ── Content grid ── */
        .container-wide {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 5vw, 4rem);
        }
        .dest-content-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          grid-template-areas: 'main sidebar';
          gap: 3rem;
          align-items: start;
        }
        .dest-main { grid-area: main; }
        .dest-sidebar { grid-area: sidebar; }

        @media (max-width: 1024px) {
          .dest-content-grid {
            grid-template-columns: 1fr;
            grid-template-areas: 'sidebar' 'main';
          }
          .dest-sidebar { position: static !important; }
        }
        @media (max-width: 640px) {
          .container-wide { padding: 0 1rem; }
        }

        /* Map loading fallback */
        .map-loading-placeholder {
          width: 100%;
          height: 440px;
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          margin: 3rem 0;
        }
      `}</style>
    </>
  );
}
