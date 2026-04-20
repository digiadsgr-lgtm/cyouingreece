import HeroSection from "@/components/HeroSection";
import { sanityClient } from "@/lib/sanity";
import { Link } from '@/i18n/routing';
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function Home() {
  
  let destinations: any[] = [];
  try {
    destinations = await sanityClient.fetch(`*[_type == "destination"] | order(_updatedAt desc) [0...10] {
      _id,
      name_en,
      name_local,
      "slug": slug.current,
      type,
      tagline,
      intro_paragraph,
      "heroImage": hero_image.asset->url
    }`);
  } catch(e) {
    console.error("Failed to fetch from Sanity", e);
  }

  // Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "CYouInGreece",
    "description": "A world-class travel platform for Greece. The real Greece.",
    "url": "https://cyouingreece.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Athens",
      "addressCountry": "GR"
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative w-full bg-brand-navy font-sans text-brand-white selection:bg-brand-golden selection:text-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* 1. The 3D Mediterranean Commission Hero */}
      <HeroSection />

      {/* 2. The Manifesto (Magazine Spine) */}
      <section className="w-full py-40 bg-[#FAF9F6] text-[#0A1628] relative z-10 border-t border-[#D4A027]/20">
        <div className="container mx-auto px-6 lg:px-24 flex flex-col items-center text-center">
          <span className="text-[#C1440E] tracking-[0.4em] uppercase text-xs font-semibold mb-12 block">The Philosophy</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight max-w-5xl text-[#0A1628]">
            Greece is not a destination.<br/>
            <span className="italic text-[#C1440E]">It is a feeling.</span>
          </h2>
          <p className="mt-12 text-lg md:text-2xl font-light text-gray-600 max-w-3xl leading-relaxed font-serif">
            The smell of oregano on a hillside at dusk. A fishing boat that hasn't moved since 1987. 
            A grandmother who makes the same tiropita her mother made. Cold Mythos on a plastic chair facing the Aegean at noon.
            This site must capture that. This is someone who actually lives here, who loves this place, who wants to show it to you the way a friend would.
          </p>
        </div>
      </section>

      {/* 3. Asymmetric Destination Ledger */}
      <section id="regions" className="w-full bg-[#FAF9F6] pb-40">
        <div className="container mx-auto px-6 lg:px-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b-2 border-[#0A1628]/10 pb-12">
             <div className="max-w-2xl">
               <h2 className="text-5xl md:text-7xl font-serif text-[#0A1628]">The Encyclopaedia.</h2>
             </div>
             <p className="text-[#8c8c8c] font-sans tracking-[0.2em] uppercase text-xs mt-6 md:mt-0 max-w-xs text-right leading-relaxed">
               An untamed taxonomy of the true Hellenic regions.
             </p>
          </div>

          {/* Asymmetric Reading Grid */}
          <div className="flex flex-col gap-40 w-full">
            {destinations.length > 0 ? destinations.map((node, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={node._id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 lg:gap-32 group`}>
                  
                  {/* Image Column */}
                  <div className="w-full md:w-[55%] relative">
                    <div className="aspect-[4/5] w-full overflow-hidden bg-[#e0ded8]">
                      {node.heroImage && (
                        <div 
                           className="w-full h-full bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                           style={{ backgroundImage: `url('${node.heroImage}')` }}
                        />
                      )}
                    </div>
                    {/* Floating Meta Box */}
                    <div className={`absolute -bottom-8 ${isEven ? '-right-8' : '-left-8'} hidden lg:block bg-[#0A1628] text-[#FAF9F6] p-8 w-64 shadow-2xl`}>
                      <span className="text-[#D4A027] tracking-[0.2em] font-bold text-[10px] uppercase block mb-3">Region Data</span>
                      <span className="font-serif italic text-lg opacity-90 block">{node.type}</span>
                    </div>
                  </div>
                  
                  {/* Text Column */}
                  <div className="w-full md:w-[45%] flex flex-col px-4 md:px-0">
                    <div className="flex items-baseline space-x-4 mb-4">
                      <span className="text-[#C1440E] font-serif text-3xl italic">0{i + 1}</span>
                      <span className="h-[1px] w-12 bg-[#0A1628]/30"></span>
                    </div>
                    
                    <h3 className="text-5xl md:text-7xl font-serif text-[#0A1628] mb-6 tracking-tight">
                      {node.name_en}
                    </h3>
                    <p className="text-xl font-serif italic text-[#C1440E] mb-8">"{node.tagline}"</p>
                    
                    <p className="text-gray-600 font-light text-lg leading-[1.8] mb-12">
                      {node.intro_paragraph?.length > 200 ? node.intro_paragraph.substring(0, 200) + '...' : node.intro_paragraph}
                    </p>
                    
                    <Link href={`/destinations/${node.slug}`} className="inline-block">
                      <button className="flex items-center space-x-4 group/btn">
                        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#0A1628] relative overflow-hidden group-hover/btn:text-[#C1440E] transition-colors">
                          Access Location
                        </span>
                        <div className="w-8 h-[1px] bg-[#0A1628] group-hover/btn:w-16 group-hover/btn:bg-[#C1440E] transition-all duration-500"></div>
                      </button>
                    </Link>
                  </div>

                </div>
              )
            }) : (
              <div className="w-full py-32 text-center border border-dashed border-[#0A1628]/20 text-[#0A1628] font-serif italic text-2xl">
                The vault is empty. Awaiting the Nikos Intelligence...
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 4. Elegant Awwwards Footer aligned to new aesthetic */}
      <footer className="w-full py-32 bg-[#0A1628] text-center">
        <div className="container mx-auto px-6 flex flex-col justify-center items-center">
           <span className="text-5xl font-serif text-[#FAF9F6] mb-4 tracking-wide">CYouInGreece</span>
           <span className="text-[#D4A027] font-serif italic text-xl mb-16">See you in Greece.</span>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 mb-24 max-w-4xl text-left border-y border-white/10 py-16">
             <div className="flex flex-col space-y-4">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">The Journal</span>
               <a href="#" className="font-serif text-white hover:text-[#C1440E] transition-colors">Destinations</a>
               <a href="#" className="font-serif text-white hover:text-[#C1440E] transition-colors">Gastronomy</a>
               <a href="#" className="font-serif text-white hover:text-[#C1440E] transition-colors">Culture & Art</a>
             </div>
             <div className="flex flex-col space-y-4">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Services</span>
               <a href="#" className="font-serif text-white hover:text-[#C1440E] transition-colors">Private Aviation</a>
               <a href="#" className="font-serif text-white hover:text-[#C1440E] transition-colors">Yacht Charters</a>
               <a href="#" className="font-serif text-white hover:text-[#C1440E] transition-colors">Villa Access</a>
             </div>
             <div className="flex flex-col space-y-4 md:col-span-2">
               <span className="text-[10px] text-[#D4A027] uppercase tracking-widest font-bold mb-4">Connect with Nikos</span>
               <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
                 Join the inner circle. Receive the "Insider Greece" editorial PDF guide instantly upon subscribing.
               </p>
               <div className="flex border-b border-white/30 focus-within:border-white transition-colors pb-2">
                 <input type="email" placeholder="Your minimalist email..." className="bg-transparent text-white text-sm outline-none w-full font-serif italic placeholder:text-gray-600" />
                 <button className="text-[10px] uppercase tracking-widest font-bold text-white hover:text-[#D4A027]">Submit</button>
               </div>
             </div>
           </div>
           
           <p className="text-[10px] text-gray-600 font-light tracking-[0.2em] uppercase">
             © 2026 The Greek Voyage Commission. Architecture by Anthropic.
           </p>
        </div>
      </footer>
    </main>
  );
}
