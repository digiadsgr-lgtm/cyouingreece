import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import { sanityClient, urlFor } from '@/lib/sanity';

export const revalidate = 60;

export default async function Home() {
  const featuredSlugs = ['santorini', 'athens', 'mykonos', 'crete'];
  const [dbDestinations, recentJourneys, recentArticles] = await Promise.all([
    sanityClient.fetch(`*[_type == "destination" && slug.current in $slugs]`, { slugs: featuredSlugs }),
    sanityClient.fetch(`*[_type == "journey"] | order(_createdAt desc)[0...3] {
      _id, title, slug, duration_days, summary, hero_image
    }`),
    sanityClient.fetch(`*[_type == "article"] | order(published_at desc)[0...3] {
      _id, title, slug, category, excerpt, hero_image
    }`)
  ]);
  
  // Sort them in the exact order
  const destinations = featuredSlugs.map(slug => dbDestinations.find((d: any) => d.slug.current === slug)).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#030b15] text-[#FAF9F6] selection:bg-[#D4A027] selection:text-[#0A1628]">
      {/* HERO */}
      <Suspense fallback={
        <div className="w-full h-screen bg-[#030b15] flex items-center justify-center">
          <span className="text-[#D4A027] tracking-widest text-sm uppercase animate-pulse">Loading the Aegean…</span>
        </div>
      }>
        <HeroSection />
      </Suspense>

      {/* MANIFESTO - MAGAZINE SPREAD */}
      <section className="relative w-full bg-[#FAF9F6] py-32 md:py-48 overflow-hidden">
        {/* Decorative background typography */}
        <div className="absolute top-10 -left-10 text-[20vw] font-serif font-bold text-[#0A1628]/[0.02] select-none pointer-events-none leading-none whitespace-nowrap">
          The Aegean
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            {/* Left Image */}
            <div className="w-full lg:w-5/12">
              <div className="relative aspect-[3/4] overflow-hidden w-full group shadow-2xl bg-[#e0dad2]">
                <img 
                  src="https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop"
                  alt="Editor's Desk"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 border border-white/20 m-4 pointer-events-none z-10" />
              </div>
            </div>

            {/* Right Text */}
            <div className="w-full lg:w-7/12 relative">
              <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-10 pl-1">
                The Philosophy
              </span>
              
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-serif text-[#0A1628] leading-[1.05] tracking-tight mb-12">
                Greece is not a destination. <span className="italic text-[#C1440E]">It is a feeling.</span>
              </h2>
              
              <div className="pl-0 md:pl-12 border-l-0 md:border-l border-[#D4A027]/40 relative">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#D4A027] hidden md:block" />
                <p className="text-[clamp(1.1rem,1.5vw,1.35rem)] font-light text-[#4a4a4a] leading-[1.9] font-serif">
                  <span className="text-4xl md:text-6xl text-[#0A1628] float-left pr-4 mt-2 font-bold leading-[0.8]">T</span>he smell of oregano on a hillside at dusk. A fishing boat that hasn't moved since 1987.
                  A grandmother who makes the same tiropita her mother made. Cold Mythos on a plastic chair
                  facing the Aegean at noon. This is not TripAdvisor. This is someone who actually lives here.
                </p>
                <div className="mt-14 flex items-center gap-6">
                  <Link href="/encyclopaedia" className="inline-flex items-center gap-4 px-10 py-5 border border-[#0A1628]/20 text-[#0A1628] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#0A1628] hover:text-[#FAF9F6] transition-all duration-300">
                    Read the Encyclopaedia
                  </Link>
                  <span className="text-[#0A1628]/40 text-xs tracking-widest uppercase">Or keep reading ↓</span>
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
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-serif leading-[0.95] max-w-3xl">
              Don't just visit. <br/><span className="italic text-white/50">Experience.</span>
            </h2>
            <Link href="#destinations" className="text-xs uppercase tracking-[0.2em] hover:text-[#D4A027] transition-colors border-b border-white/20 pb-1 mb-2">
              View all 50+ Guides
            </Link>
          </div>
        </div>

        {/* Horizontal Slider Area (CSS grid fallback for now) */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentJourneys && recentJourneys.map((itin: any) => (
              <Link key={itin._id} href={`/curated-journeys/${itin.slug.current}`} className="group relative overflow-hidden h-[500px] bg-[#0A1628] block">
                {itin.hero_image?.asset && (
                  <img 
                    src={urlFor(itin.hero_image).width(800).url()}
                    alt={itin.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent opacity-80" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-[#D4A027] text-[10px] uppercase tracking-widest mb-3 block">{itin.duration_days} Days</span>
                  <h3 className="text-3xl font-serif text-white mb-3 group-hover:text-[#D4A027] transition-colors">{itin.title}</h3>
                  <p className="text-white/70 font-light text-sm max-w-[280px]">{itin.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL PREVIEW */}
      {(() => {
        return (
          <section className="w-full bg-[#FAF9F6] py-32 md:py-48 border-t border-[#0A1628]/10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 md:mb-28">
                <div>
                  <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">
                    The Journal
                  </span>
                  <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-serif text-[#0A1628] leading-[0.95]">
                    Stories worth<br />
                    <span className="italic">reading slowly.</span>
                  </h2>
                </div>
                <Link href="/journal" className="text-xs uppercase tracking-[0.2em] hover:text-[#C1440E] transition-colors border-b border-[#0A1628]/20 pb-1 mb-2 text-[#0A1628]">
                  All Articles →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {recentArticles && recentArticles.map((item: any) => (
                  <Link key={item._id} href={`/journal/${item.slug.current}`} className="group flex flex-col">
                    <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-[#e0dad2]">
                      {item.hero_image?.asset && (
                        <img
                          src={urlFor(item.hero_image).width(900).url()}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-105"
                        />
                      )}
                      <div className="absolute top-4 left-4 bg-[#C1440E] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white">
                        {item.category || 'Editorial'}
                      </div>
                    </div>
                    <h3 className="font-serif text-[#0A1628] text-xl md:text-2xl leading-tight mb-4 group-hover:text-[#C1440E] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[#4a4a4a] font-light text-sm leading-relaxed flex-1">
                      {item.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-[0.2em] text-[#0A1628] font-bold group-hover:text-[#C1440E] transition-colors">
                      Read
                      <span className="w-6 h-px bg-current group-hover:w-10 transition-all" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* THE ENCYCLOPAEDIA - ASYMMETRICAL GRID */}
      <section id="destinations" className="w-full bg-[#FAF9F6] py-32 md:py-48">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="text-center mb-32">
            <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">
              The Encyclopaedia
            </span>
            <h2 className="text-[clamp(3.5rem,8vw,7rem)] font-serif text-[#0A1628] leading-[0.9]">
              Every island.<br/>
              <span className="italic">Every table worth finding.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-24 md:gap-y-32">
            {destinations.map((dest: any, i) => {
              // Staggered layout logic
              const isLarge = i % 3 === 0;
              const colSpan = isLarge ? "lg:col-span-8" : "lg:col-span-4";
              const colStart = isLarge ? (i % 2 === 0 ? "lg:col-start-1" : "lg:col-start-5") : "lg:col-auto";
              
              return (
                <article key={dest._id} className={`${colSpan} ${colStart} group flex flex-col`}>
                  <Link href={`/destination/${dest.slug?.current}`} className="w-full relative overflow-hidden block aspect-[4/3] md:aspect-[3/4] mb-8 bg-[#e0dad2]">
                    {dest.hero_image?.asset ? (
                      <img
                        src={urlFor(dest.hero_image).width(1200).url()}
                        alt={dest.name_en}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#0A1628]" />
                    )}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 shadow-lg z-10">
                      <span className="text-[9px] text-[#0A1628] font-bold tracking-[0.25em] uppercase">{dest.type}</span>
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-4xl md:text-5xl font-serif text-[#0A1628] leading-none">{dest.name_en}</h3>
                      <span className="text-[#0A1628]/30 font-serif italic text-xl">{dest.name_local}</span>
                    </div>
                    <p className="font-serif italic text-[#C1440E] text-lg md:text-xl mb-6">"{dest.tagline}"</p>
                    <p className="text-[#4a4a4a] font-light text-base leading-relaxed mb-8 flex-1">
                      {isLarge ? dest.intro_paragraph : `${dest.intro_paragraph?.slice(0, 150)}...`}
                    </p>
                    <Link href={`/destination/${dest.slug?.current}`} className="inline-flex items-center gap-3 w-fit text-xs uppercase tracking-[0.2em] font-bold text-[#0A1628] hover:text-[#C1440E] transition-colors group/link">
                      Read Guide
                      <span className="w-8 h-px bg-[#0A1628] group-hover/link:w-12 group-hover/link:bg-[#C1440E] transition-all" />
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
          
          {/* Newsletter Box */}
          <div className="w-full bg-[#0A1628] border border-[#D4A027]/20 p-10 md:p-20 relative overflow-hidden mb-32 flex flex-col items-center text-center">
            {/* Minimalist sun vector */}
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
                {['About Us', 'Contact Nikos', 'Press', 'Journal'].map(l => <a key={l} href="#" className="font-serif text-white/60 hover:text-white transition-colors">{l}</a>)}
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#D4A027] text-[10px] tracking-widest uppercase font-bold mb-2">Social</span>
                {['Instagram', 'Pinterest', 'Spotify', 'Vimeo'].map(l => <a key={l} href="#" className="font-serif text-white/60 hover:text-white transition-colors">{l}</a>)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-sans">© 2026 CYouInGreece. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-white/20 text-[10px] tracking-[0.1em] uppercase font-sans hover:text-[#D4A027] transition-colors">Privacy</a>
              <a href="#" className="text-white/20 text-[10px] tracking-[0.1em] uppercase font-sans hover:text-[#D4A027] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
