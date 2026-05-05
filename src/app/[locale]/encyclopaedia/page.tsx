import { sanityClient, urlFor } from '@/lib/sanity';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'The Encyclopaedia — CYouInGreece',
  description: 'Our exhaustive, constantly updated directory of Greek islands and mainland destinations. No clichés. Only local knowledge.',
  openGraph: {
    title: 'The Encyclopaedia — CYouInGreece',
    description: 'Every island. Every table worth finding.',
  },
};

const TYPE_LABELS: Record<string, string> = {
  island: 'Island',
  mainland: 'Mainland',
  city: 'City',
  region: 'Region',
};

const REGION_ORDER = [
  'Cyclades',
  'Ionian',
  'Dodecanese',
  'Saronic Gulf',
  'Crete',
  'Epirus',
  'Thessaly',
  'Macedonia',
  'Peloponnese',
  'Central Greece',
  'Aegean',
];

async function getAllDestinations() {
  return sanityClient.fetch(`
    *[_type == "destination"] | order(region asc, name_en asc) {
      _id, name_en, name_local, slug, type, region, tagline,
      intro_paragraph, best_time, highlights, gastronomy, hidden_gem,
      hero_image { asset->{ _ref, url, metadata { lqip, dimensions } } }
    }
  `);
}

function DestinationCard({ dest, size = 'normal' }: { dest: any; size?: 'large' | 'normal' | 'small' }) {
  const heroUrl = dest.hero_image?.asset
    ? urlFor(dest.hero_image).width(size === 'large' ? 1400 : 700).height(size === 'large' ? 900 : 600).auto('format').url()
    : null;

  const lqip = dest.hero_image?.asset?.metadata?.lqip;

  const heights = {
    large: 'h-[600px]',
    normal: 'h-[400px]',
    small: 'h-[280px]',
  };

  return (
    <Link
      href={`/destination/${dest.slug?.current}`}
      className="group relative overflow-hidden block bg-[#0A1628]"
      style={{ height: undefined }}
    >
      <div className={`relative overflow-hidden w-full ${heights[size]}`}>
        {heroUrl ? (
          <img
            src={heroUrl}
            alt={dest.name_en}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-110"
            style={{ backgroundImage: lqip ? `url(${lqip})` : undefined }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] to-[#1a3060]" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-5 left-5 z-10">
          <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5">
            {TYPE_LABELS[dest.type] || dest.type}
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          {dest.region && (
            <span className="text-[#D4A027] text-[9px] uppercase tracking-[0.3em] font-bold block mb-2">
              {dest.region}
            </span>
          )}
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className={`font-serif text-white leading-none group-hover:text-[#D4A027] transition-colors duration-300 ${
              size === 'large' ? 'text-4xl md:text-5xl' : size === 'small' ? 'text-xl' : 'text-2xl md:text-3xl'
            }`}>
              {dest.name_en}
            </h3>
            {dest.name_local && (
              <span className="font-serif italic text-white/40 text-sm hidden md:block">{dest.name_local}</span>
            )}
          </div>
          {size !== 'small' && dest.tagline && (
            <p className={`text-white/70 font-serif italic leading-snug mt-1 ${size === 'large' ? 'text-base max-w-lg' : 'text-sm max-w-xs'}`}>
              "{dest.tagline}"
            </p>
          )}
          {size === 'large' && dest.intro_paragraph && (
            <p className="text-white/55 text-sm font-light leading-relaxed mt-3 max-w-2xl line-clamp-3">
              {dest.intro_paragraph}
            </p>
          )}
          {/* Arrow */}
          <div className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#D4A027] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore Guide
            <span className="w-5 h-px bg-[#D4A027] group-hover:w-8 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function RegionSection({ region, destinations }: { region: string; destinations: any[] }) {
  if (!destinations.length) return null;

  // Layout: first card large, rest normal
  const [first, ...rest] = destinations;

  return (
    <div className="mb-24 md:mb-36">
      {/* Region header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-8 h-px bg-[#D4A027]" />
        <span className="text-[#D4A027] text-[10px] uppercase tracking-[0.4em] font-bold">{region}</span>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/20 text-[10px] uppercase tracking-widest">{destinations.length} destination{destinations.length > 1 ? 's' : ''}</span>
      </div>

      {destinations.length === 1 ? (
        <DestinationCard dest={first} size="large" />
      ) : destinations.length === 2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DestinationCard dest={first} size="large" />
          <DestinationCard dest={rest[0]} size="normal" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Hero card — spans 7/12 */}
          <div className="md:col-span-7">
            <DestinationCard dest={first} size="large" />
          </div>
          {/* Side cards — spans 5/12 */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {rest.slice(0, 2).map((d: any) => (
              <DestinationCard key={d._id} dest={d} size={rest.length === 1 ? 'large' : 'normal'} />
            ))}
          </div>
          {/* Any remaining cards — full width row */}
          {rest.length > 2 && (
            <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rest.slice(2).map((d: any) => (
                <DestinationCard key={d._id} dest={d} size="small" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default async function EncyclopaediaPage() {
  const destinations = await getAllDestinations();

  // Group by region
  const byRegion: Record<string, any[]> = {};
  for (const dest of destinations) {
    const r = dest.region || 'Other';
    if (!byRegion[r]) byRegion[r] = [];
    byRegion[r].push(dest);
  }

  // Sort regions by predefined order
  const sortedRegions = [
    ...REGION_ORDER.filter(r => byRegion[r]),
    ...Object.keys(byRegion).filter(r => !REGION_ORDER.includes(r)).sort(),
  ];

  const totalCount = destinations.length;

  return (
    <main className="min-h-screen bg-[#030b15] text-white">
      {/* ── CINEMATIC HERO ──────────────────────────────── */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden bg-[#030b15]">
        {/* Decorative large BG text */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="text-[28vw] font-serif font-bold text-white/[0.02] leading-none whitespace-nowrap">
            Ελλάς
          </span>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#D4A027]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#C1440E]/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pb-20 pt-40 w-full">
          <div className="border-b border-white/10 pb-16">
            <span className="text-[#D4A027] tracking-[0.5em] uppercase text-[10px] font-bold block mb-10">
              CYouInGreece — The Encyclopaedia
            </span>
            <h1 className="text-[clamp(4rem,12vw,11rem)] font-serif font-light text-white leading-[0.85] tracking-tight">
              Every <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A027] to-[#C1440E]">island</em>.
              <br />
              Every <em className="not-italic italic text-white/50">table</em> worth finding.
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-8 mt-12">
              <p className="font-serif italic text-white/50 text-xl max-w-2xl leading-relaxed">
                Our exhaustive, constantly updated directory of Greek destinations. No clichés. 
                Only the knowledge of someone who actually lives here.
              </p>
              <div className="shrink-0 text-right">
                <span className="block text-[clamp(2.5rem,5vw,4rem)] font-serif text-[#D4A027] leading-none">{totalCount}</span>
                <span className="text-white/30 text-[10px] uppercase tracking-widest">Destinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALPHABET QUICK-JUMP / FILTER NAV ────────────── */}
      <nav className="sticky top-0 z-30 bg-[#030b15]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex gap-1 md:gap-2 overflow-x-auto py-4 scrollbar-hide">
            {sortedRegions.map(region => (
              <a
                key={region}
                href={`#region-${region.toLowerCase().replace(/\s+/g, '-')}`}
                className="shrink-0 px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-[#D4A027] hover:bg-white/5 rounded transition-colors duration-200 whitespace-nowrap"
              >
                {region}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── DESTINATIONS BY REGION ───────────────────────── */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {sortedRegions.map(region => (
            <div key={region} id={`region-${region.toLowerCase().replace(/\s+/g, '-')}`}>
              <RegionSection region={region} destinations={byRegion[region]} />
            </div>
          ))}

          {destinations.length === 0 && (
            <div className="text-center py-40">
              <p className="font-serif italic text-white/30 text-3xl mb-4">
                "The islands are being mapped…"
              </p>
              <p className="text-white/20 text-sm tracking-widest uppercase">
                Nikos is at his desk. Come back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────── */}
      <section className="py-32 border-t border-white/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#D4A027]/5 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-8">
            More To Explore
          </span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-serif text-white leading-tight mb-10">
            Read the stories behind<br />
            <span className="italic text-white/50">the destinations.</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/journal"
              className="inline-flex items-center gap-4 px-10 py-4 bg-[#D4A027] text-[#030b15] text-xs font-bold uppercase tracking-[0.25em] hover:bg-white transition-colors duration-300"
            >
              The Journal
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-4 px-10 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.25em] hover:border-[#D4A027] hover:text-[#D4A027] transition-colors duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
