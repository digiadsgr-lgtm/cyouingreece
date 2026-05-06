import { fetchDestination, fetchAllDestinationSlugs, fetchEditorialArticles } from '@/lib/destination-queries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Destination } from '@/lib/destination-types';
import { urlFor } from '@/lib/sanity';
import { Link } from '@/i18n/routing';

// ── Import all destination components ──────────────────────────────────────────
import AtAGlanceCard from '@/components/destination/AtAGlanceCard';
import BodyContent from '@/components/destination/BodyContent';
import GastronomySpotlight from '@/components/destination/GastronomySpotlight';
import HiddenGems from '@/components/destination/HiddenGems';
import TopExperiences from '@/components/destination/TopExperiences';
import PhotoGallery from '@/components/destination/PhotoGallery';
import NearbyDestinations from '@/components/destination/NearbyDestinations';
import EditorialArticles from '@/components/destination/EditorialArticles';
import NewsletterCapture from '@/components/destination/NewsletterCapture';
import NikosDiary from '@/components/destination/NikosDiary';
import HistoryTracker from '@/components/destination/HistoryTracker';
import EncyclopediaContent from '@/components/destination/EncyclopediaContent';
import YouTubeEmbed from '@/components/destination/YouTubeEmbed';
import FadeInScroll from '@/components/ui/FadeInScroll';
import BookingWidget from '@/components/monetization/BookingWidget';
import GetYourGuideWidget from '@/components/monetization/GetYourGuideWidget';
import HotelWidget from '@/components/monetization/HotelWidget';
import RentACarWidget from '@/components/monetization/RentACarWidget';
import AffiliateLinkBar from '@/components/monetization/AffiliateLinks';
import MetasearchWidget from '@/components/monetization/MetasearchWidget';
import AdSlot from '@/components/monetization/AdSlot';
import { destinationJsonLd, breadcrumbJsonLd, JsonLdScript } from '@/lib/jsonld';

export const revalidate = 0; // Disabled for immediate review

// ── Static params ─────────────────────────────────────────────────────────────
import { routing } from '@/i18n/routing';

export async function generateStaticParams() {
  const slugs = await fetchAllDestinationSlugs();
  return routing.locales.flatMap((locale) => 
    slugs.map((slug) => ({ locale, slug }))
  );
}

import { getLocalizedContent, getLocalizedField } from '@/lib/i18n-utils';

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const dest = await fetchDestination(slug);
  if (!dest) return { title: 'Destination Not Found' };
  
  const metaTitle = getLocalizedField(dest, 'meta_title', locale) || dest.seo?.meta_title || `${dest.name_en} — CYouInGreece`;
  const metaDesc = getLocalizedField(dest, 'meta_description', locale) || dest.seo?.meta_description || dest.tagline;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: dest.hero_image?.asset?._ref
        ? [urlFor(dest.hero_image).width(1200).height(630).url()]
        : [],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [dest, articles] = await Promise.all([
    fetchDestination(slug),
    fetchEditorialArticles(slug),
  ]);

  if (!dest) return notFound();

  const localized = getLocalizedContent(dest, locale);

  // Build hero image URL
  const heroUrl = dest.hero_image?.asset?._ref
    ? urlFor(dest.hero_image).width(1920).height(1080).auto('format').url()
    : null;

  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      <HistoryTracker slug={slug} type={dest.type || 'unknown'} />
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] flex flex-col justify-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroUrl || 'https://images.unsplash.com/photo-1516483638261-f40af5bf2225?q=80&w=2000&auto=format&fit=crop'}
            alt={dest.name_en}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
          />
        </div>
        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#F4F0EA] via-transparent to-transparent opacity-80" />

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 pb-20 md:pb-24">
          {/* Type badge */}
          <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">
            {dest.type?.replace('_', ' ')} — Greece
          </span>

          <h1 className="text-[clamp(3rem,10vw,8.5rem)] font-serif font-light text-white leading-[0.85] mb-6 drop-shadow-2xl">
            {dest.name_en}
            {dest.name_local && dest.name_local !== dest.name_en && (
              <span className="block text-[0.4em] font-light text-white/70 tracking-[0.05em] mt-2">
                {dest.name_local}
              </span>
            )}
          </h1>

          {localized.tagline && (
            <p className="font-serif italic text-[clamp(1.1rem,2.2vw,1.6rem)] text-white/90 max-w-2xl leading-relaxed drop-shadow-lg">
              "{localized.tagline}"
            </p>
          )}
        </div>

        {/* JSON-LD structured data */}
        <JsonLdScript data={destinationJsonLd({ ...dest, hero_image: dest.hero_image as any })} />
        <JsonLdScript data={breadcrumbJsonLd([
          { name: 'Home', url: 'https://cyouingreece.com' },
          { name: 'Encyclopaedia', url: 'https://cyouingreece.com/encyclopaedia' },
          { name: dest.name_en, url: `https://cyouingreece.com/destination/${slug}` },
        ])} />
      </section>

      {/* ── ENCYCLOPEDIA CONTENT (Thematic Sections) ────────────────────── */}
      {(localized.thematic_sections || dest.thematic_sections) && (localized.thematic_sections || dest.thematic_sections).length > 0 ? (
        <FadeInScroll yOffset={50}>
          <EncyclopediaContent 
            sections={localized.thematic_sections || dest.thematic_sections} 
            destinationName={dest.name_en} 
          />
        </FadeInScroll>
      ) : (
        <>
          {/* Fallback to old layout if no thematic sections exist yet */}
          <section className="py-24 md:py-36 bg-[#F4F0EA]">
            <FadeInScroll>
              <div className="max-w-[1320px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  <div className="lg:col-span-7">
                    <span className="text-[#A43312] tracking-[0.3em] uppercase text-[10px] font-bold block mb-8">
                      Editorial Introduction
                    </span>
                    <p className="text-[clamp(1.15rem,2vw,1.45rem)] font-serif text-[#070A0F] leading-[1.8] italic">
                      {localized.intro}
                    </p>
                  </div>
                  <div className="lg:col-span-5">
                    {dest.at_a_glance && <AtAGlanceCard destination={dest} />}
                  </div>
                </div>
              </div>
            </FadeInScroll>
          </section>

          {localized.body && localized.body.length > 0 && (
            <section className="bg-[#F4F0EA] py-24 md:py-32">
              <FadeInScroll>
                <div className="max-w-[800px] mx-auto px-6 md:px-12">
                  <span className="text-[#A43312] tracking-[0.3em] uppercase text-[10px] font-bold block mb-10">
                    Full Editorial
                  </span>
                  <BodyContent blocks={localized.body as any} destinationName={dest.name_en} />
                </div>
              </FadeInScroll>
            </section>
          )}
        </>
      )}

      {/* ── DOCUMENTARY VIDEO (YouTube) ──────────────────────────────────── */}
      {dest.youtube_video_url && (
        <section className="bg-[#070A0F] py-24 md:py-36">
          <FadeInScroll yOffset={60}>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
              <span className="text-[#B6A996] tracking-[0.3em] uppercase text-[10px] font-bold block mb-4">
                Cinematic Journey
              </span>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-[#F4F0EA] font-light leading-tight">
                The Moving Image.<br />
                <span className="italic text-[#F4F0EA]/40">Watch the Documentary.</span>
              </h2>
            </div>
            <div className="max-w-[1100px] mx-auto px-6 md:px-12">
              <YouTubeEmbed url={dest.youtube_video_url} title={`Cinematic Journey: ${dest.name_en}`} />
            </div>
          </FadeInScroll>
        </section>
      )}

      {/* ── PHOTO GALLERY ────────────────────────────────────────────────── */}
      {dest.gallery && dest.gallery.length > 0 && (
        <section className="bg-[#F4F0EA] py-24 md:py-32">
          <FadeInScroll yOffset={60}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16 text-center lg:text-left">
              <span className="text-[#A43312] tracking-[0.3em] uppercase text-[10px] font-bold block mb-4">
                Golden Guide Archive
              </span>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-[#070A0F] font-light leading-tight">
                Visual Narrative.<br />
                <span className="italic text-[#070A0F]/40">Through the lens of history.</span>
              </h2>
            </div>
            <PhotoGallery images={dest.gallery} destinationName={dest.name_en} />
          </FadeInScroll>
        </section>
      )}

      {/* ── THE DIARY OF NIKOS (Now supplemental) ────────────────────────── */}
      {dest.diary_entries && dest.diary_entries.length > 0 && (
        <section className="bg-[#070A0F] py-24 md:py-32 border-b border-[#F4F0EA]/5">
          <FadeInScroll yOffset={60}>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16 text-center">
              <span className="text-[#B6A996] tracking-[0.3em] uppercase text-[10px] font-bold block mb-6">
                Local Perspective
              </span>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-[#F4F0EA] font-light leading-tight mb-4">
                The Diary of Nikos
              </h2>
              <p className="text-[#F4F0EA]/50 max-w-2xl mx-auto text-lg italic font-serif">
                "The secrets you won't find in the official archives."
              </p>
            </div>
            <div className="max-w-[1100px] mx-auto px-6 md:px-12">
              <NikosDiary entries={dest.diary_entries} />
            </div>
          </FadeInScroll>
        </section>
      )}

      {/* ── GASTRONOMY ───────────────────────────────────────────────────── */}
      {dest.gastronomy && dest.gastronomy.length > 0 && (
        <section className="bg-[#F4F0EA] py-24 md:py-36">
          <FadeInScroll yOffset={60}>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
              <span className="text-[#A43312] tracking-[0.3em] uppercase text-[10px] font-bold block mb-4">
                Gastronomy
              </span>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-[#070A0F] font-light leading-tight">
                What to Eat.<br />
                <span className="italic text-[#070A0F]/40">And Where to Find It.</span>
              </h2>
            </div>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12">
              <GastronomySpotlight items={dest.gastronomy} />
            </div>
          </FadeInScroll>
        </section>
      )}

      {/* ── HIDDEN GEMS ──────────────────────────────────────────────────── */}
      {dest.hidden_gems && dest.hidden_gems.length > 0 && (
        <section className="bg-[#070A0F] py-24 md:py-36">
          <FadeInScroll yOffset={60}>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
              <span className="text-[#B6A996] tracking-[0.3em] uppercase text-[10px] font-bold block mb-4">
                Off the Map
              </span>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-[#F4F0EA] font-light leading-tight">
                What the Guidebooks Miss.
              </h2>
            </div>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12">
              <HiddenGems gems={dest.hidden_gems} />
            </div>
          </FadeInScroll>
        </section>
      )}

      {/* ── TOP EXPERIENCES ──────────────────────────────────────────────── */}
      {dest.top_experiences && dest.top_experiences.length > 0 && (
        <section className="bg-[#F4F0EA] py-24 md:py-36">
          <FadeInScroll yOffset={60}>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
              <span className="text-[#A43312] tracking-[0.3em] uppercase text-[10px] font-bold block mb-4">
                Experiences
              </span>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-[#070A0F] font-light leading-tight">
                How to Spend Your Days.
              </h2>
            </div>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12">
              <TopExperiences experiences={dest.top_experiences} />
            </div>
          </FadeInScroll>
        </section>
      )}

      {/* ── EDITORIAL ARTICLES ───────────────────────────────────────────── */}
      {articles && articles.length > 0 && (
        <section className="bg-[#070A0F] py-24 md:py-32">
          <FadeInScroll yOffset={60}>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
              <span className="text-[#B6A996] tracking-[0.3em] uppercase text-[10px] font-bold block mb-4">
                From the Journal
              </span>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif text-[#F4F0EA] font-light leading-tight">
                Stories from {dest.name_en}
              </h2>
            </div>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12">
              <EditorialArticles articles={articles} />
            </div>
          </FadeInScroll>
        </section>
      )}

      {/* ── NEARBY DESTINATIONS ──────────────────────────────────────────── */}
      {dest.nearby_destinations && dest.nearby_destinations.length > 0 && (
        <section className="bg-[#F4F0EA] py-24 md:py-32">
          <FadeInScroll yOffset={60}>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
              <span className="text-[#A43312] tracking-[0.3em] uppercase text-[10px] font-bold block mb-4">
                Keep Exploring
              </span>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif text-[#070A0F] font-light leading-tight">
                You Might Also Love
              </h2>
            </div>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12">
              <NearbyDestinations destinations={dest.nearby_destinations} locale="en" />
            </div>
          </FadeInScroll>
        </section>
      )}

      {/* ── PLAN YOUR TRIP ─────────────────────────────────────────────────── */}
      <section className="bg-[#0A1628] py-20 md:py-28">
        <FadeInScroll yOffset={40}>
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <div className="mb-10">
              <span className="text-[#D4A027] tracking-[0.3em] uppercase text-[10px] font-bold block mb-3">Plan Your Trip</span>
              <h2 className="text-[clamp(1.8rem,3vw,3rem)] font-serif text-white font-light">
                Book your {dest.name_en} experience.
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <BookingWidget destination={`${dest.name_en}, Greece`} />
              <GetYourGuideWidget locationKey={slug} numberOfItems={4} locale={locale} />
            </div>
          </div>
          {/* Athens Exclusive: Metasearch Widget */}
          {slug === 'athens' && (
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 mt-20">
              <MetasearchWidget />
            </div>
          )}
        </FadeInScroll>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="bg-[#070A0F] py-24 md:py-32">
        <FadeInScroll yOffset={60}>
          <div className="max-w-[900px] mx-auto px-6 md:px-12">
            <NewsletterCapture />
          </div>
        </FadeInScroll>
      </section>

      {/* ── BACK TO ENCYCLOPAEDIA ────────────────────────────────────────── */}
      <section className="bg-[#F4F0EA] py-16 text-center border-t border-[#070A0F]/5">
        <Link
          href="/encyclopaedia"
          className="inline-block border border-[#070A0F] text-[#070A0F] px-10 py-4 uppercase tracking-[0.25em] text-xs hover:bg-[#070A0F] hover:text-[#F4F0EA] transition-colors duration-500"
        >
          ← Return to Encyclopaedia
        </Link>
      </section>
    </main>
  );
}
