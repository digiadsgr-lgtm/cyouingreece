import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import NikosCTA from "@/components/NikosCTA";

export const dynamic = 'force-static';

const DESTINATIONS = [
  {
    id: 'santorini',
    name_en: 'Santorini',
    name_local: 'Σαντορίνη',
    slug: 'santorini',
    type: 'island',
    tagline: 'Where the caldera swallowed a civilisation.',
    intro_paragraph: 'I have watched the sun disappear into the caldera from Imerovigli — not Oia, where 4,000 tourists line the steps every evening — and I still cannot explain what happens to the light at that moment. It turns the white buildings amber, then rose, then a purple that has no name in any language I speak.',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1600&auto=format&fit=crop',
    nikos_tip: 'Take the coastal path from Fira to Imerovigli at 6am. You will have the caldera to yourself.',
  },
  {
    id: 'athens',
    name_en: 'Athens',
    name_local: 'Αθήνα',
    slug: 'athens',
    type: 'city',
    tagline: 'The city that invented everything, still arguing about it.',
    intro_paragraph: 'Athens smells of diesel and jasmine. Sometimes petrichor after afternoon storms in September. The Acropolis is not a museum — it is a living geological fact, a calcareous promontory that has been occupied for 5,000 years. The rest is context.',
    heroImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1600&auto=format&fit=crop',
    nikos_tip: 'Eat at Café Avyssinia in the Monastiraki flea market on a Sunday when the dealers are out. Order the saganaki.',
  },
  {
    id: 'mykonos',
    name_en: 'Mykonos',
    name_local: 'Μύκονος',
    slug: 'mykonos',
    type: 'island',
    tagline: 'Come in late September, when it finally exhales.',
    intro_paragraph: 'Everyone comes in August. I come in late September, when the ferry from Piraeus is half-full and the beach clubs have finally stopped pretending they are Ibiza. There is a Mykonos most people never find — the fishing port at Chora at 6am, the water that colour between teal and ultramarine.',
    heroImage: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=1600&auto=format&fit=crop',
    nikos_tip: 'Skip Paradise Beach. Go to Agios Sostis — no sunbeds, no bar, just sand. Take the Ornos road and keep left.',
  },
  {
    id: 'crete',
    name_en: 'Crete',
    name_local: 'Κρήτη',
    slug: 'crete',
    type: 'island',
    tagline: 'An island so large it forgot it was an island.',
    intro_paragraph: 'Crete is not one place. It is an archipelago of micro-cultures stitched together by a mountain spine. In the west, Chania still smells of Venetian stone and orange blossom. In the east, Siteia is unhurried and honest in the way only places without airports can afford to be.',
    heroImage: 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?q=80&w=1600&auto=format&fit=crop',
    nikos_tip: 'Drive the E75 coastal road from Rethymno to Chania at sunrise. Stop at the Georgioupoli lagoon. No agenda.',
  },
  {
    id: 'thessaloniki',
    name_en: 'Thessaloniki',
    name_local: 'Θεσσαλονίκη',
    slug: 'thessaloniki',
    type: 'city',
    tagline: 'Where Byzantine history eats breakfast at the waterfront.',
    intro_paragraph: 'I was born here and I am still discovering it. Thessaloniki is the city that Greeks themselves argue is the real cultural capital — and they are not wrong. The food is forensically better than Athens. The nightlife is longer. The Byzantine churches sit in traffic roundabouts with the nonchalance of a city that has stopped performing its history.',
    heroImage: 'https://images.unsplash.com/photo-1601928529049-e68dbf0d7c8a?q=80&w=1600&auto=format&fit=crop',
    nikos_tip: 'Go to Modiano market on a Saturday. Eat at one of the counters inside — no sign, no menu. Point at what the person next to you has.',
  },
  {
    id: 'rhodes',
    name_en: 'Rhodes',
    name_local: 'Ρόδος',
    slug: 'rhodes',
    type: 'island',
    tagline: 'The medieval city that time decided to keep.',
    intro_paragraph: 'Walk inside the walls at 11pm when the tour groups have gone. The cobblestones are so worn they are almost black. The Street of the Knights is empty. The sound is a cat somewhere. This is a city that has been continuously inhabited for 2,400 years and it feels like it.',
    heroImage: 'https://images.unsplash.com/photo-1540571306688-0f6e6c7c0651?q=80&w=1600&auto=format&fit=crop',
    nikos_tip: 'Eat at Ta Kardasia in the old town. Ask for the fish of the day — they will not have a menu for it, just tell you.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030b15] text-[#FAF9F6]">
      {/* HERO */}
      <Suspense fallback={
        <div className="w-full h-screen bg-[#030b15] flex items-center justify-center">
          <span className="text-[#D4A027] tracking-widest text-sm uppercase animate-pulse">Loading the Aegean…</span>
        </div>
      }>
        <HeroSection />
      </Suspense>

      {/* MANIFESTO */}
      <section className="w-full bg-[#FAF9F6] py-36 md:py-48">
        <div className="max-w-[1100px] mx-auto px-6 md:px-16 text-center">
          <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[11px] font-semibold inline-block mb-12">
            The Philosophy
          </span>
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-serif font-medium text-[#0A1628] leading-tight">
            Greece is not a destination.<br />
            <em className="text-[#C1440E]">It is a feeling.</em>
          </h2>
          <p className="mt-10 text-[clamp(1rem,1.6vw,1.25rem)] font-light text-[#4a4a4a] max-w-3xl mx-auto leading-[1.95] font-serif">
            The smell of oregano on a hillside at dusk. A fishing boat that hasn't moved since 1987.
            A grandmother who makes the same tiropita her mother made. Cold Mythos on a plastic chair
            facing the Aegean at noon. This is not TripAdvisor. This is someone who actually lives here.
          </p>
          <div className="mt-14 flex justify-center gap-2 items-center">
            <span className="h-px w-12 bg-[#D4A027]" />
            <span className="text-[#D4A027] text-[10px] tracking-[0.4em] uppercase font-bold">Est. 2026</span>
            <span className="h-px w-12 bg-[#D4A027]" />
          </div>
        </div>
      </section>

      {/* ENCYCLOPAEDIA */}
      <section id="destinations" className="w-full bg-[#FAF9F6] pb-48">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-[#0A1628]/10 pb-10">
            <h2 className="text-[clamp(2.8rem,7vw,6rem)] font-serif text-[#0A1628] leading-none">
              The Encyclopaedia.
            </h2>
            <p className="text-[#9a9890] text-xs font-sans tracking-[0.25em] uppercase mt-6 md:mt-0 text-right leading-relaxed max-w-[260px]">
              Every island. Every city. Every table worth finding.
            </p>
          </div>

          <div className="flex flex-col gap-32 md:gap-48">
            {DESTINATIONS.map((dest, i) => {
              const isEven = i % 2 === 0;
              return (
                <article key={dest.id}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 lg:gap-32 group`}
                >
                  {/* Image */}
                  <div className="w-full md:w-[55%] relative flex-shrink-0">
                    <div className="w-full overflow-hidden aspect-[4/5] bg-[#e0dad2]">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-[2500ms] ease-out group-hover:scale-[1.04]"
                        style={{ backgroundImage: `url('${dest.heroImage}')` }}
                      />
                    </div>
                    <div className={`absolute top-6 ${isEven ? 'left-6' : 'right-6'} bg-[#0A1628] px-4 py-2`}>
                      <span className="text-[10px] text-[#D4A027] font-bold tracking-[0.25em] uppercase">{dest.type}</span>
                    </div>
                    <div className={`absolute -bottom-6 ${isEven ? '-right-4 md:-right-8' : '-left-4 md:-left-8'} hidden lg:block bg-white border border-[#D4A027]/30 p-6 max-w-[260px] shadow-2xl`}>
                      <span className="text-[9px] text-[#D4A027] font-bold tracking-[0.2em] uppercase block mb-2">Nikos says</span>
                      <p className="font-serif italic text-[#0A1628] text-sm leading-relaxed">"{dest.nikos_tip}"</p>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center flex-1 pt-4 md:pt-10">
                    <div className="flex items-baseline gap-4 mb-5">
                      <span className="font-serif italic text-[#C1440E] text-4xl leading-none">{String(i + 1).padStart(2, '0')}</span>
                      <span className="h-px w-12 bg-[#0A1628]/20" />
                    </div>
                    <h3 className="text-[clamp(3rem,6vw,5.5rem)] font-serif text-[#0A1628] leading-none tracking-tight mb-2">{dest.name_en}</h3>
                    <p className="text-[#0A1628]/40 text-sm font-serif italic mb-5">{dest.name_local}</p>
                    <p className="font-serif italic text-[#C1440E] text-xl mb-7 leading-snug">"{dest.tagline}"</p>
                    <p className="text-[#4a4a4a] font-light text-lg leading-[1.85] mb-10 max-w-[440px]">
                      {dest.intro_paragraph.slice(0, 220)}…
                    </p>
                    <Link href={`/destinations/${dest.slug}`} className="inline-flex items-center gap-4 group/cta w-fit">
                      <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#0A1628] group-hover/cta:text-[#C1440E] transition-colors duration-300">Read the Guide</span>
                      <span className="h-px w-8 bg-[#0A1628] group-hover/cta:w-16 group-hover/cta:bg-[#C1440E] transition-all duration-500" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* NIKOS CTA */}
      <section className="w-full bg-[#0A1628] py-28">
        <div className="max-w-[860px] mx-auto px-6 text-center">
          <span className="text-[11px] text-[#D4A027] tracking-[0.4em] uppercase font-semibold block mb-7">Your personal guide</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-serif text-white leading-tight mb-7">
            Ask Nikos anything<br /><span className="italic text-[#D4A027]">about Greece.</span>
          </h2>
          <p className="text-white/45 font-light text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Which island in October? Best beach for children? Ferry from Piraeus to Folegandros?
            Nikos knows. Specific name, specific table, specific time.
          </p>
          <NikosCTA />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="w-full bg-[#FAF9F6] py-28 border-t border-[#0A1628]/8">
        <div className="max-w-[780px] mx-auto px-6 text-center">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-serif text-[#0A1628] mb-3">The Insider Greece PDF.</h2>
          <p className="font-serif italic text-[#C1440E] text-xl mb-8">Free. 47 pages of what Nikos actually knows.</p>
          <div className="flex flex-col sm:flex-row max-w-xl mx-auto border border-[#0A1628]/20">
            <input type="email" placeholder="your@email.com" className="flex-1 px-6 py-4 text-[#0A1628] font-light text-sm outline-none bg-white font-sans placeholder:text-[#aaa]" />
            <button className="px-8 py-4 bg-[#0A1628] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#C1440E] transition-colors duration-300 whitespace-nowrap">Send it to me</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#030b15] py-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16 pb-16 border-b border-white/8">
            <div>
              <p className="text-[clamp(2rem,4vw,3rem)] font-serif text-white leading-none mb-2">CYouInGreece</p>
              <p className="font-serif italic text-[#D4A027] text-lg">See you in Greece.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-5 text-sm">
              {['Islands', 'Cities', 'Gastronomy', 'Culture', 'Itineraries', 'About Nikos'].map(l => (
                <a key={l} href="#" className="font-serif text-white/50 hover:text-[#D4A027] transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/20 text-[11px] tracking-[0.2em] uppercase font-sans">© 2026 CYouInGreece</p>
            <p className="text-white/20 text-[11px] tracking-[0.15em] uppercase font-sans">En · De · Fr · It · Es · Ro · Pl · Ru · El</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
