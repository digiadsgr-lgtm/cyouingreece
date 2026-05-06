import { Suspense } from "react";
import SmartHero from "@/components/home/SmartHero";
import { Link } from '@/i18n/routing';
import { sanityClient, urlFor } from '@/lib/sanity';
import { websiteJsonLd, JsonLdScript } from '@/lib/jsonld';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getLocalizedContent } from '@/lib/i18n-utils';
import { ArrowRight } from 'lucide-react';

export const revalidate = 0; // Fresh content for testing

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Philosophy');

  const featuredSlugs = ['santorini', 'athens', 'mykonos', 'crete', 'paros'];
  const [dbDestinations, recentJourneys, allArticles] = await Promise.all([
    sanityClient.fetch(`*[_type == "destination" && slug.current in $slugs] {
      ..., translations
    }`, { slugs: featuredSlugs }),
    sanityClient.fetch(`*[_type == "journey"] | order(_createdAt desc)[0...3] {
      _id, title, slug, duration_days, summary, hero_image, translations
    }`),
    sanityClient.fetch(`*[_type == "article"] | order(published_at desc)[0...20] {
      _id, title, slug, category, excerpt, hero_image, translations
    }`)
  ]);

  const featuredArticle = allArticles?.[0] ?? null;
  const CATS = ['sea', 'mountain', 'culture', 'gastronomy'] as const;
  const articlesByCategory: Record<string, any[]> = {};
  for (const cat of CATS) {
    articlesByCategory[cat] = (allArticles ?? []).filter((a: any) => a.category === cat).slice(0, 3);
  }
  
  const destinations = featuredSlugs.map(slug => dbDestinations.find((d: any) => d.slug.current === slug)).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#030b15] text-[#FAF9F6] selection:bg-[#D4A027] selection:text-[#0A1628]">
      {/* SMART HERO */}
      <SmartHero destinations={destinations} />

      {/* MANIFESTO - MAGAZINE SPREAD */}
      <section className="relative w-full bg-[#FAF9F6] py-24 md:py-48 overflow-hidden">
        {/* Decorative background typography */}
        <div className="absolute top-10 -left-10 text-[20vw] font-serif font-bold text-[#0A1628]/[0.02] select-none pointer-events-none leading-none whitespace-nowrap">
          The Aegean
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Left Image */}
            <div className="w-full lg:w-5/12 order-2 lg:order-1">
              <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden w-full group shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-[#e0dad2] rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop"
                  alt="Editor's Desk"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 border border-white/30 m-3 md:m-4 pointer-events-none z-10 rounded-sm" />
              </div>
            </div>

            {/* Right Text */}
            <div className="w-full lg:w-7/12 relative mt-8 lg:mt-0 order-1 lg:order-2">
              <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-8 pl-1">
                {t('title')}
              </span>
              
              <h2 className="text-[clamp(2rem,5vw,5rem)] font-serif text-[#0A1628] leading-[1.1] md:leading-[1.05] tracking-tight mb-10">
                Greece is not a destination. <span className="italic text-[#C1440E]">It is a feeling.</span>
              </h2>
              
              <div className="pl-0 md:pl-10 border-l-0 md:border-l border-[#D4A027]/40 relative">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#D4A027] hidden md:block" />
                <p className="text-[clamp(1.05rem,1.8vw,1.35rem)] font-light text-[#4a4a4a] leading-[1.8] md:leading-[1.9] font-serif">
                  <span className="text-4xl md:text-6xl text-[#0A1628] float-left pr-3 md:pr-4 mt-1 md:mt-2 font-bold leading-[0.8]">T</span>{t('text1')} {t('text2')} {t('text3')}
                </p>
                <div className="mt-10 md:mt-14 flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/encyclopaedia" className="inline-flex items-center justify-center w-full sm:w-auto gap-4 px-8 py-4 md:px-10 md:py-5 bg-[#0A1628] text-white text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-[#D4A027] hover:text-[#0A1628] transition-all duration-500 shadow-xl">
                    Explore the Archive
                  </Link>
                  <Link href="/journal" className="text-[#0A1628] text-[10px] tracking-widest uppercase font-bold border-b border-[#0A1628]/20 pb-1 hover:border-[#D4A027] transition-all">
                    Read the Journal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED ITINERARIES - HORIZONTAL SCROLL CONCEPT */}
      <section className="w-full bg-[#0A1628] py-32 md:py-48 text-white overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20 md:mb-32">
          <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">Curated Journeys</span>
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-serif leading-[0.95] max-w-3xl">
              Don't just visit. <br/><span className="italic text-white/50">Experience.</span>
            </h2>
            <Link href="/curated-journeys" className="text-xs uppercase tracking-[0.2em] hover:text-[#D4A027] transition-colors border-b border-white/20 pb-1 mb-2">
              All Journeys
            </Link>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {recentJourneys && recentJourneys.map((itin: any) => (
              <Link key={itin._id} href={`/curated-journeys/${itin.slug.current}`} className="group relative overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-[#0A1628] block">
                {itin.hero_image?.asset && (
                  <img 
                    src={urlFor(itin.hero_image).width(800).url()}
                    alt={itin.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/20 to-transparent opacity-90" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[#D4A027] text-[10px] uppercase tracking-widest mb-3 block">{itin.duration_days} Days</span>
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 group-hover:text-[#D4A027] transition-colors">{itin.title}</h3>
                  <p className="text-white/60 font-light text-sm max-w-[280px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">{itin.summary}</p>
                  <div className="mt-6 w-10 h-px bg-[#D4A027] group-hover:w-16 transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL — DYNAMIC CATEGORY FEATURE */}
      <section className="w-full bg-[#FAF9F6] py-32 md:py-48 border-t border-[#0A1628]/10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 md:mb-24">
            <div>
              <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">The Journal</span>
              <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-serif text-[#0A1628] leading-[0.95]">
                Stories worth<br /><span className="italic">reading slowly.</span>
              </h2>
            </div>
            <Link href="/journal" className="shrink-0 text-xs uppercase tracking-[0.2em] hover:text-[#C1440E] transition-colors border-b border-[#0A1628]/20 pb-1 mb-2 text-[#0A1628]">
              Archive →
            </Link>
          </div>

          {featuredArticle && (
            <Link href={`/journal/${featuredArticle.slug?.current}`} className="group block mb-24 lg:mb-36">
              <div className="relative w-full aspect-[16/10] md:aspect-video lg:h-[75vh] overflow-hidden bg-[#0A1628] rounded-xl shadow-2xl">
                {featuredArticle.hero_image?.asset && (
                  <img
                    src={urlFor(featuredArticle.hero_image).width(1800).height(900).auto('format').url()}
                    alt={featuredArticle.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/20 to-transparent" />
                <div className="absolute top-6 left-6 md:top-10 md:left-10">
                  <span className="bg-[#C1440E] text-white text-[9px] font-bold uppercase tracking-[0.3em] px-4 py-2">
                    {featuredArticle.category ? featuredArticle.category.charAt(0).toUpperCase() + featuredArticle.category.slice(1) : 'Featured'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-20">
                  <h3 className="font-serif text-white text-[clamp(1.5rem,4vw,4rem)] leading-[1.05] mb-6 max-w-4xl group-hover:text-[#D4A027] transition-colors duration-700">
                    {getLocalizedContent(featuredArticle, locale).title}
                  </h3>
                  <p className="text-white/60 font-serif italic text-lg md:text-xl max-w-2xl mb-8 line-clamp-2 hidden sm:block">
                    {getLocalizedContent(featuredArticle, locale).excerpt}
                  </p>
                  <span className="inline-flex items-center gap-4 text-[#D4A027] text-[10px] font-bold uppercase tracking-[0.4em] group-hover:gap-6 transition-all">
                    Dive into Feature
                    <span className="w-12 h-px bg-[#D4A027]" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {(['sea', 'mountain', 'culture', 'gastronomy'] as const).map((cat) => {
            const catArticles = articlesByCategory[cat] ?? [];
            if (!catArticles.length) return null;
            const catMeta: Record<string, { label: string; color: string; icon: string }> = {
              sea:        { label: 'Sea & Islands',  color: '#4A7FA5', icon: '~' },
              mountain:   { label: 'Mountain',       color: '#6B8F47', icon: '↑' },
              culture:    { label: 'Culture',        color: '#8B6B47', icon: '◈' },
              gastronomy: { label: 'Gastronomy',     color: '#C1440E', icon: '◉' },
            };
            const meta = catMeta[cat];
            return (
              <div key={cat} className="mb-24">
                <div className="flex items-center gap-6 mb-12">
                  <span className="font-serif text-3xl" style={{ color: meta.color }}>{meta.icon}</span>
                  <h3 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] text-[#0A1628]">{meta.label}</h3>
                  <div className="flex-1 h-px bg-[#0A1628]/10" />
                  <Link href={`/journal`} className="text-[9px] uppercase tracking-[0.3em] font-black hover:text-[#C1440E] transition-colors text-[#0A1628]/30">
                    Discover More
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {catArticles.map((article: any) => (
                    <Link key={article._id} href={`/journal/${article.slug?.current}`} className="group flex flex-col">
                      <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-[#e0dad2] rounded-lg shadow-lg">
                        {article.hero_image?.asset ? (
                          <img
                            src={urlFor(article.hero_image).width(800).height(600).auto('format').url()}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0" style={{ backgroundColor: meta.color, opacity: 0.1 }} />
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <h4 className="font-serif text-[#0A1628] text-xl md:text-2xl leading-snug mb-3 group-hover:text-[#C1440E] transition-colors duration-300">
                        {getLocalizedContent(article, locale).title}
                      </h4>
                      <p className="text-[#4a4a4a]/80 font-serif italic text-sm leading-relaxed flex-1 line-clamp-3">
                        {getLocalizedContent(article, locale).excerpt}
                      </p>
                      <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-[#0A1628]/40 group-hover:text-[#C1440E] transition-colors">
                        Read <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THE ENCYCLOPAEDIA - ASYMMETRICAL GRID */}
      <section id="destinations" className="w-full bg-[#FAF9F6] py-32 md:py-48">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-32">
            <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">
              The Archive
            </span>
            <h2 className="text-[clamp(3rem,8vw,7.5rem)] font-serif text-[#0A1628] leading-[0.9] tracking-tight">
              Every island.<br/>
              <span className="italic text-[#0A1628]/30 font-light">Every table worth finding.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-24 md:gap-y-36">
            {destinations.map((dest: any, i) => {
              const isLarge = i % 3 === 0;
              const colSpan = isLarge ? "lg:col-span-8" : "lg:col-span-4";
              
              return (
                <article key={dest._id} className={`${colSpan} group flex flex-col`}>
                  <Link href={`/destination/${dest.slug?.current}`} className="w-full relative overflow-hidden block aspect-[4/5] md:aspect-[16/10] lg:aspect-[16/10] mb-10 bg-[#e0dad2] rounded-xl shadow-2xl">
                    {dest.hero_image?.asset ? (
                      <img
                        src={urlFor(dest.hero_image).width(1400).url()}
                        alt={dest.name_en}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#0A1628]" />
                    )}
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-2 shadow-xl z-10 rounded-sm">
                      <span className="text-[10px] text-[#0A1628] font-black tracking-[0.3em] uppercase">{dest.type}</span>
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col px-2">
                    <div className="flex items-baseline gap-6 mb-6">
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0A1628] leading-none">{dest.name_en}</h3>
                      <span className="text-[#0A1628]/20 font-serif italic text-2xl">{dest.name_local}</span>
                    </div>
                    <p className="font-serif italic text-[#C1440E] text-xl md:text-2xl mb-8 leading-tight">
                      "{getLocalizedContent(dest, locale).tagline}"
                    </p>
                    <p className="text-[#4a4a4a] font-light text-base md:text-lg leading-[1.8] mb-10 flex-1">
                      {isLarge ? getLocalizedContent(dest, locale).intro : `${getLocalizedContent(dest, locale).intro?.slice(0, 160)}...`}
                    </p>
                    <Link href={`/destination/${dest.slug?.current}`} className="inline-flex items-center gap-4 w-fit text-[11px] uppercase tracking-[0.4em] font-black text-[#0A1628] group-hover:text-[#C1440E] transition-colors group/link">
                      Open Dossier
                      <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER & NEWSLETTER BLOCK */}
      <footer className="w-full bg-[#030b15] pt-32">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="w-full bg-[#0A1628] border border-[#D4A027]/20 p-10 md:p-20 relative overflow-hidden mb-32 flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A027] rounded-full blur-[120px] opacity-10 pointer-events-none" />
            
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif text-white leading-tight mb-4 relative z-10">
              The Insider Greece PDF.
            </h2>
            <p className="font-serif italic text-[#D4A027] text-xl mb-12 relative z-10">
              Free. 47 pages of what Nikos actually knows.
            </p>
            
            <div className="flex flex-col sm:flex-row w-full max-w-2xl relative z-10 gap-2 sm:gap-0">
              <input 
                type="email" 
                placeholder="Where should we send it?" 
                className="flex-1 px-8 py-5 text-white bg-white/5 border border-white/20 font-light text-sm outline-none focus:border-[#D4A027] transition-colors placeholder:text-white/40" 
              />
              <button className="px-10 py-5 bg-[#D4A027] text-[#0A1628] text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300 whitespace-nowrap">
                Unlock Now
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20 pb-20 border-b border-white/10">
            <div className="md:w-1/3">
              <p className="text-4xl font-serif text-white leading-none mb-3">CYouInGreece</p>
              <p className="font-serif italic text-[#D4A027] text-xl mb-8">See you in Greece.</p>
              <p className="text-white/40 text-sm font-light leading-relaxed max-w-sm">
                Built for the travelers who want to see the real Aegean. Curated by locals, powered by an obsession with authenticity.
              </p>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-sm">
              <div className="flex flex-col gap-4">
                <span className="text-[#D4A027] text-[10px] tracking-widest uppercase font-bold mb-2">Regions</span>
                {['Cyclades', 'Ionian', 'Dodecanese', 'Crete'].map(l => <a key={l} href="#" className="font-serif text-white/60 hover:text-white transition-colors">{l}</a>)}
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#D4A027] text-[10px] tracking-widest uppercase font-bold mb-2">Experiences</span>
                {['Gastronomy', 'History', 'Sailing', 'Seclusion'].map(l => <a key={l} href="#" className="font-serif text-white/60 hover:text-white transition-colors">{l}</a>)}
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#D4A027] text-[10px] tracking-widest uppercase font-bold mb-2">Company</span>
                <Link href="/about" className="font-serif text-white/60 hover:text-white transition-colors">About Us</Link>
                <a href="mailto:hello@cyouingreece.com" className="font-serif text-white/60 hover:text-white transition-colors">Contact Nikos</a>
                <Link href="/journal" className="font-serif text-white/60 hover:text-white transition-colors">Journal</Link>
                <Link href="/encyclopaedia" className="font-serif text-white/60 hover:text-white transition-colors">Encyclopaedia</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#D4A027] text-[10px] tracking-widest uppercase font-bold mb-2">Social</span>
                {['Instagram', 'Pinterest', 'Spotify', 'Vimeo'].map(l => <a key={l} href="#" className="font-serif text-white/60 hover:text-white transition-colors">{l}</a>)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-sans">© 2026 CYouInGreece. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-white/20 text-[10px] tracking-[0.1em] uppercase font-sans hover:text-[#D4A027] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-white/20 text-[10px] tracking-[0.1em] uppercase font-sans hover:text-[#D4A027] transition-colors">Terms</Link>
              <Link href="/about" className="text-white/20 text-[10px] tracking-[0.1em] uppercase font-sans hover:text-[#D4A027] transition-colors">About</Link>
            </div>
          </div>
          <JsonLdScript data={websiteJsonLd()} />
        </div>
      </footer>
    </main>
  );
}
