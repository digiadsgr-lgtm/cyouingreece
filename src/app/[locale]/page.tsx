import HeroSection from "@/components/HeroSection";
import { sanityClient } from "@/lib/sanity";

export const dynamic = 'force-dynamic';

export default async function Home() {
  
  let sanityNodes = [];
  try {
    sanityNodes = await sanityClient.fetch('*[_type in ["region", "island", "poi"]] | order(updatedAt desc) [0...20]');
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
    <main className="min-h-screen flex flex-col relative w-full bg-[#0A0A0A] text-white selection:bg-[#E5D3B3] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Sovereign Hero Sector */}
      <HeroSection />

      {/* Philosophy Statement */}
      <section className="w-full py-40 bg-[#0A0A0A] border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="text-[#E5D3B3] tracking-[0.3em] uppercase text-xs font-semibold mb-8 block">Our Manifesto</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white font-light leading-snug">
            "We bypass the noise. We secure the untamed, the private, and the historically profound corners of Greece."
          </h2>
        </div>
      </section>
      
      {/* Featured Daily Sanctuary */}
      <section id="sanctuaries" className="w-full relative bg-[#0F0F0F] overflow-hidden py-32 border-t border-white/5">
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
                 <h3 className="text-5xl md:text-7xl font-serif text-white mb-4">{spotlightNode.name || spotlightNode.title}</h3>
                 <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed">{spotlightNode.description}</p>
                 <div className="mt-8">
                   <button className="text-xs uppercase tracking-[0.2em] font-medium text-white border-b border-white pb-1 hover:text-[#E5D3B3] hover:border-[#E5D3B3] transition-colors">
                     Unlock Destination
                   </button>
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
      <section id="regions" className="w-full py-32 bg-[#0A0A0A] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="mb-24 flex flex-col md:flex-row justify-between items-end pb-12 border-b border-white/10">
             <div className="max-w-2xl">
               <span className="text-[#E5D3B3] uppercase tracking-[0.3em] text-xs font-semibold block mb-4">Topological Taxonomy</span>
               <h2 className="text-4xl md:text-6xl font-serif text-white font-light">The Hellenic<br/>Regions</h2>
             </div>
             <button className="text-xs uppercase tracking-[0.2em] font-medium text-gray-400 hover:text-white transition-colors mb-2 md:mb-0">
               View Complete Map
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[500px]">
             {[
               {name: "Cyclades", img: "https://images.unsplash.com/photo-1613395877344-13d4a3215840?q=80&w=1000"},
               {name: "Ionian", img: "https://images.unsplash.com/photo-1522513476839-4d693f1fa68c?q=80&w=1000"},
               {name: "Peloponnese", img: "https://images.unsplash.com/photo-1596706013627-7cfd82bb776e?q=80&w=1000"},
               {name: "Dodecanese", img: "https://images.unsplash.com/photo-1606915159051-2fd5e35bd7f0?q=80&w=1000"}
             ].map((r, i) => (
                <div key={i} className="relative group overflow-hidden bg-[#111] cursor-pointer">
                   <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" style={{ backgroundImage: `url('${r.img}')` }}></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                   <div className="absolute bottom-8 left-8 z-10 flex items-center space-x-3">
                     <div className="w-8 h-[1px] bg-[#E5D3B3] transform origin-left transition-all duration-300 group-hover:w-16"></div>
                     <span className="text-xl font-serif text-white tracking-wider">{r.name}</span>
                   </div>
                </div>
             ))}
           </div>
        </div>
      </section>
      
      {/* Elevated Experiences Bento (New Architectural Layer) */}
      <section id="experiences" className="w-full py-32 bg-[#0A0A0A] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="text-center mb-24">
             <span className="text-[#E5D3B3] uppercase tracking-[0.3em] text-xs font-semibold block mb-4">Specialized Services</span>
             <h2 className="text-4xl md:text-5xl font-serif text-white font-light">Elevated Experiences</h2>
           </div>
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
              {/* Large Column */}
              <div className="md:col-span-2 relative group overflow-hidden bg-[#111]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1605342880053-157457d15655?q=80&w=2000&auto=format&fit=crop')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-10 left-10 z-10">
                  <span className="text-xs tracking-[0.2em] text-[#E5D3B3] uppercase font-semibold mb-2 block">Marine Asset</span>
                  <h3 className="text-3xl font-serif text-white">Private Yacht Charters</h3>
                </div>
              </div>
              
              {/* Small Columns */}
              <div className="flex flex-col gap-6">
                <div className="h-64 md:h-1/2 relative group overflow-hidden bg-[#111]">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000&auto=format&fit=crop')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 z-10">
                    <h3 className="text-xl font-serif text-white">Culinary Seclusion</h3>
                  </div>
                </div>
                <div className="h-64 md:h-1/2 relative group overflow-hidden bg-[#111]">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-70" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1000&auto=format&fit=crop')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 z-10">
                    <h3 className="text-xl font-serif text-white">Aviation Access</h3>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>
      
      {/* Elegant Awwwards Footer */}
      <footer className="w-full py-24 bg-[#050505] text-center border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col justify-center items-center">
           <span className="text-4xl font-serif text-white mb-8 tracking-wide">CYouInGreece</span>
           <div className="flex space-x-12 mb-12">
             <a href="#" className="text-sm text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Manifesto</a>
             <a href="#" className="text-sm text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Nodes</a>
             <a href="#" className="text-sm text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Neural Sync</a>
           </div>
           <p className="text-[10px] text-gray-600 font-light tracking-[0.2em] uppercase">
             © 2026 The Ultimate Hellenic Voyage. All Rights Reserved.
           </p>
        </div>
      </footer>
    </main>
  );
}
