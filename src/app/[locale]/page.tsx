import HeroSection from "@/components/HeroSection";
import { sanityClient } from "@/lib/sanity";
import { Link } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export default async function Home() {
  
  let sanityNodes: any[] = [];
  try {
    sanityNodes = await sanityClient.fetch(`*[_type == "destination"] | order(_updatedAt desc) [0...20] {
      _id,
      name_en,
      name_local,
      "slug": slug.current,
      type,
      tagline,
      description,
      "heroImage": hero_image.asset->url
    }`);
  } catch(e) {
    console.error("Failed to fetch from Sanity", e);
  }
  // Mathematical rotation based on the current hour (ensures dynamic change without tracking state)
  const currentHour = new Date().getHours();
  const spotlightIndex = sanityNodes.length > 0 ? (currentHour % sanityNodes.length) : 0;
  const spotlightNode = sanityNodes.length > 0 ? sanityNodes[spotlightIndex] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "CYouInGreece",
    "image": "https://cyouingreece.com/bg-hero.png",
    "description": "Ultra-Luxury Concierge and Private VIP Access to the Aegean's highest-tier topological nodes, private yachts, and secluded villas.",
    "url": "https://cyouingreece.com",
    "priceRange": "$$$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Athens",
      "addressCountry": "GR"
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative w-full bg-brand-navy text-brand-white selection:bg-brand-golden selection:text-brand-navy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 3D Immersive Hero */}
      <HeroSection />

      {/* Philosophy Statement - Magazine Editorial Style */}
      <section className="w-full py-40 bg-brand-navy border-t border-brand-white/5 relative z-10">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="text-brand-golden tracking-[0.3em] uppercase text-xs font-semibold mb-8 block font-inter">CYouInGreece Manifesto</span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-white font-light leading-snug drop-shadow-md">
            "We bypass the noise. We secure the untamed, the private, and the historically profound corners of Greece."
          </h2>
        </div>
      </section>
      
      {/* Featured Daily Sanctuary */}
      <section id="sanctuaries" className="w-full relative bg-[#070D18] overflow-hidden py-32 border-t border-brand-white/5 shadow-inner">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end pb-12">
            <div className="max-w-2xl">
              <span className="text-[#E5D3B3] uppercase tracking-[0.3em] text-xs font-semibold block mb-4">Spotlight • Curated Hourly</span>
              <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">Sanctuary<br/>Of The Hour.</h2>
              <p className="text-gray-400 font-light text-xl leading-relaxed">
                A meticulously selected destination from our private vault, demanding your immediate attention.
              </p>
            </div>
          </div>
          
          {spotlightNode ? (
            <div className="relative w-full h-[70vh] group overflow-hidden cursor-pointer">
               <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105" style={{ backgroundImage: `url('${spotlightNode.heroImage || '/bg-hero.png'}')` }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
               <div className="absolute bottom-12 left-12 z-10 max-w-2xl">
                 <span className="text-[#E5D3B3] tracking-[0.2em] font-semibold text-xs border border-[#E5D3B3]/40 px-3 py-1 mb-6 inline-block uppercase">
                   {spotlightNode._type}
                 </span>
                 <h3 className="text-5xl md:text-7xl font-serif text-white mb-4">{spotlightNode.name_en || spotlightNode.title}</h3>
                 <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed">{spotlightNode.tagline || spotlightNode.description}</p>
                 <div className="mt-8">
                   <Link href={`/destinations/${spotlightNode.slug}`}>
                     <button className="text-xs uppercase tracking-[0.2em] font-medium text-white border-b border-white pb-1 hover:text-[#E5D3B3] hover:border-[#E5D3B3] transition-colors">
                       Unlock Destination
                     </button>
                   </Link>
                 </div>
               </div>
            </div>
          ) : (
            <div className="w-full h-[70vh] flex items-center justify-center border border-white/10">
              <span className="text-gray-500 tracking-[0.2em] uppercase text-sm">Synchronizing with the Vault...</span>
            </div>
          )}
        </div>
      </section>

      {/* The Hellenic Regions Grid */}
      <section id="regions" className="w-full py-32 bg-brand-navy border-t border-brand-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="mb-24 flex flex-col md:flex-row justify-between items-end pb-12 border-b border-brand-white/10">
             <div className="max-w-2xl">
               <span className="text-brand-golden uppercase tracking-[0.3em] text-xs font-semibold block mb-4">Topological Taxonomy</span>
               <h2 className="text-4xl md:text-6xl font-serif text-brand-white font-light">The Hellenic<br/>Regions</h2>
             </div>
             <button className="text-xs uppercase tracking-[0.2em] font-medium text-gray-400 hover:text-brand-white transition-colors mb-2 md:mb-0">
               View Complete Map
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[500px]">
             {sanityNodes.slice(0, 8).map((node, i) => (
                <Link href={`/destinations/${node.slug}`} key={i} className="relative group overflow-hidden bg-[#050C16] cursor-pointer block h-full">
                   <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" style={{ backgroundImage: `url('${node.heroImage || "https://images.unsplash.com/photo-1613395877344-13d4a3215840?q=80&w=1000"}')` }}></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                   <div className="absolute bottom-8 left-8 z-10 flex flex-col items-start">
                     <div className="flex items-center space-x-3 mb-2">
                       <div className="w-8 h-[1px] bg-brand-golden transform origin-left transition-all duration-300 group-hover:w-16"></div>
                       <span className="text-xl font-serif text-brand-white tracking-wider drop-shadow-md">{node.name_en}</span>
                     </div>
                     <span className="text-[10px] text-brand-white/80 uppercase tracking-widest bg-black/40 px-2 py-1 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                       {node.type}
                     </span>
                   </div>
                </Link>
             ))}
           </div>
        </div>
      </section>
      
      {/* Elevated Experiences Bento (New Architectural Layer) */}
      <section id="experiences" className="w-full py-32 bg-[#050C16] border-t border-brand-white/5 shadow-inner">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="text-center mb-24">
             <span className="text-brand-golden uppercase tracking-[0.3em] text-xs font-semibold block mb-4">Specialized Services</span>
             <h2 className="text-4xl md:text-5xl font-serif text-brand-white font-light drop-shadow-md">Elevated Experiences</h2>
           </div>
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
              {/* Large Column */}
              <div className="md:col-span-2 relative group overflow-hidden bg-[#0A1628] border border-brand-white/5">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1605342880053-157457d15655?q=80&w=2000&auto=format&fit=crop')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-brand-navy/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 z-10">
                  <span className="text-xs tracking-[0.2em] text-brand-golden uppercase font-semibold mb-2 block">Marine Asset</span>
                  <h3 className="text-3xl font-serif text-brand-white drop-shadow-md">Private Yacht Charters</h3>
                </div>
              </div>
              
              {/* Small Columns */}
              <div className="flex flex-col gap-6">
                <div className="h-64 md:h-1/2 relative group overflow-hidden bg-[#0A1628] border border-brand-white/5">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000&auto=format&fit=crop')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-brand-navy/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 z-10">
                    <h3 className="text-xl font-serif text-brand-white drop-shadow-md">Culinary Seclusion</h3>
                  </div>
                </div>
                <div className="h-64 md:h-1/2 relative group overflow-hidden bg-[#0A1628] border border-brand-white/5">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-70" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1000&auto=format&fit=crop')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-brand-navy/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 z-10">
                    <h3 className="text-xl font-serif text-brand-white drop-shadow-md">Aviation Access</h3>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>
      
      {/* Elegant Awwwards Footer */}
      <footer className="w-full py-24 bg-[#03060B] text-center border-t border-brand-white/5 shadow-2xl">
        <div className="container mx-auto px-6 flex flex-col justify-center items-center">
           <span className="text-4xl font-serif text-brand-white mb-8 tracking-wide drop-shadow-md">CYouInGreece</span>
           <div className="flex space-x-12 mb-12">
             <a href="#" className="text-sm text-gray-500 hover:text-brand-white uppercase tracking-widest transition-colors">Manifesto</a>
             <a href="#" className="text-sm text-gray-500 hover:text-brand-white uppercase tracking-widest transition-colors">Nodes</a>
             <a href="#experiences" className="text-sm text-gray-500 hover:text-brand-golden uppercase tracking-widest transition-colors">Neural Sync</a>
           </div>
           <p className="text-[10px] text-gray-600 font-light tracking-[0.2em] uppercase">
             © 2026 The Ultimate Hellenic Voyage. All Rights Reserved.
           </p>
        </div>
      </footer>
    </main>
  );
}
