import { fetchDestination, fetchAllDestinationSlugs, fetchEditorialArticles } from '@/lib/destination-queries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Destination } from '@/lib/destination-types';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';

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

export const revalidate = 3600;

// ── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await fetchAllDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = await fetchDestination(slug);
  if (!dest) return { title: 'Destination Not Found' };
  return {
    title: dest.seo?.meta_title || `${dest.name_en} — CYouInGreece`,
    description: dest.seo?.meta_description || dest.tagline,
    openGraph: {
      title: dest.seo?.meta_title || dest.name_en,
      description: dest.seo?.meta_description || dest.tagline,
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [dest, articles] = await Promise.all([
    fetchDestination(slug),
    fetchEditorialArticles(slug),
  ]);

  if (!dest) return notFound();

  // Build hero image URL
  const heroUrl = dest.hero_image?.asset?._ref
    ? urlFor(dest.hero_image).width(1920).height(1080).auto('format').url()
    : null;

  return (
    <main className="bg-[#030b15] min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col justify-end overflow-hidden">
        {/* Background image */}
        {heroUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={heroUrl}
              alt={dest.name_en}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.42) saturate(1.1)' }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1628] to-[#030b15]" />
        )}
        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#030b15] via-[#030b15]/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-[1320px] mx-auto w-full px-6 md:px-16 pb-20 md:pb-28">
          {/* Type badge */}
          <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">
            {dest.type?.replace('_', ' ')} — Greece
          </span>

          <h1 className="text-[clamp(3rem,9vw,8rem)] font-serif font-light text-white leading-[0.9] mb-4"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
            {dest.name_en}
            {dest.name_local && dest.name_local !== dest.name_en && (
              <span className="block text-[0.45em] font-light text-white/50 tracking-[0.1em] mt-2">
                {dest.name_local}
              </span>
            )}
          </h1>

          {dest.tagline && (
            <p className="font-serif italic text-[clamp(1.1rem,2vw,1.5rem)] text-white/75 max-w-2xl leading-relaxed"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              "{dest.tagline}"
            </p>
          )}
        </div>

        {/* Scroll line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-[#D4A027]/60 to-transparent" />
        </div>
      </section>

      {/* ── INTRO + AT-A-GLANCE ──────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#FAF9F6]">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Intro text */}
            <div className="lg:col-span-7">
              <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-8">
                Editorial Introduction
              </span>
              <p className="text-[clamp(1.15rem,2vw,1.45rem)] font-serif text-[#0A1628] leading-[1.8] italic">
                {dest.intro_paragraph}
              </p>
            </div>
            {/* At a Glance */}
            <div className="lg:col-span-5">
              {dest.at_a_glance && <AtAGlanceCard destination={dest} />}
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTO GALLERY ────────────────────────────────────────────────── */}
      {dest.gallery && dest.gallery.length > 0 && (
        <section className="bg-[#0A1628] py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
            <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">
              Photography
            </span>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-serif text-white leading-tight">
              Through the Lens
            </h2>
          </div>
          <PhotoGallery images={dest.gallery} destinationName={dest.name_en} />
        </section>
      )}

      {/* ── BODY CONTENT ─────────────────────────────────────────────────── */}
      {dest.body_content && dest.body_content.length > 0 && (
        <section className="bg-[#FAF9F6] py-24 md:py-32">
          <div className="max-w-[800px] mx-auto px-6 md:px-12">
            <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-10">
              Full Editorial
            </span>
            <BodyContent blocks={dest.body_content as any} />
          </div>
        </section>
      )}

      {/* ── GASTRONOMY ───────────────────────────────────────────────────── */}
      {dest.gastronomy && dest.gastronomy.length > 0 && (
        <section className="bg-[#030b15] py-24 md:py-36">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
            <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">
              Gastronomy
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-white leading-tight">
              What to Eat.<br />
              <span className="italic text-white/40">And Where to Find It.</span>
            </h2>
          </div>
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <GastronomySpotlight items={dest.gastronomy} />
          </div>
        </section>
      )}

      {/* ── HIDDEN GEMS ──────────────────────────────────────────────────── */}
      {dest.hidden_gems && dest.hidden_gems.length > 0 && (
        <section className="bg-[#FAF9F6] py-24 md:py-36">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
            <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">
              Off the Map
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-[#0A1628] leading-tight">
              What the Guidebooks Miss.
            </h2>
          </div>
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <HiddenGems gems={dest.hidden_gems} />
          </div>
        </section>
      )}

      {/* ── TOP EXPERIENCES ──────────────────────────────────────────────── */}
      {dest.top_experiences && dest.top_experiences.length > 0 && (
        <section className="bg-[#0A1628] py-24 md:py-36">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
            <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">
              Experiences
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-white leading-tight">
              How to Spend Your Days.
            </h2>
          </div>
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <TopExperiences experiences={dest.top_experiences} />
          </div>
        </section>
      )}

      {/* ── EDITORIAL ARTICLES ───────────────────────────────────────────── */}
      {articles && articles.length > 0 && (
        <section className="bg-[#FAF9F6] py-24 md:py-32">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
            <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">
              From the Journal
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif text-[#0A1628] leading-tight">
              Stories from {dest.name_en}
            </h2>
          </div>
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <EditorialArticles articles={articles} />
          </div>
        </section>
      )}

      {/* ── NEARBY DESTINATIONS ──────────────────────────────────────────── */}
      {dest.nearby_destinations && dest.nearby_destinations.length > 0 && (
        <section className="bg-[#030b15] py-24 md:py-32">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 mb-16">
            <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">
              Keep Exploring
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif text-white leading-tight">
              You Might Also Love
            </h2>
          </div>
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <NearbyDestinations destinations={dest.nearby_destinations} locale="en" />
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="bg-[#0A1628] py-24 md:py-32">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <NewsletterCapture />
        </div>
      </section>

      {/* ── BACK TO ENCYCLOPAEDIA ────────────────────────────────────────── */}
      <section className="bg-[#030b15] py-16 text-center border-t border-white/5">
        <Link
          href="/encyclopaedia"
          className="inline-block border border-[#D4A027] text-[#D4A027] px-10 py-4 uppercase tracking-[0.25em] text-xs hover:bg-[#D4A027] hover:text-[#030b15] transition-colors duration-500"
        >
          ← Return to Encyclopaedia
        </Link>
      </section>
    </main>
  );
}
