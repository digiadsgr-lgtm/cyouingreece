import HeroSection from "@/components/HeroSection";
import { sanityClient } from "@/lib/sanity";
import ScrollNodes from "@/components/ScrollNodes";

export const dynamic = 'force-dynamic';

export default async function Home() {
  
  let sanityNodes = [];
  try {
    sanityNodes = await sanityClient.fetch('*[_type in ["region", "island", "poi"]] | order(updatedAt desc) [0...20]');
  } catch(e) {
    console.error("Failed to fetch from Sanity", e);
  }
  
  const displayNodes = sanityNodes.length > 0 ? sanityNodes.map((node: any) => ({
    title: node.name || node.title || "Unknown Sanctuary",
    tag: String(node._type).toUpperCase(),
    desc: node.description || "A meticulously curated destination. Details are reserved for private clientele.",
    img: node.heroImage || "/bg-hero.png"
  })) : [
    { 
      title: "Loading Archive...", 
      tag: "ACCESSING",
      desc: "Synchronizing with the Hellenic Vault. Please wait while we retrieve the curated sanctuaries.",
      img: "/bg-hero.png"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col relative w-full bg-[#0A0A0A] text-white selection:bg-[#E5D3B3] selection:text-black">
      
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
      
      {/* The Vault - Curated Assets */}
      <section className="w-full relative bg-[#0F0F0F] overflow-hidden py-32 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end pb-12">
            <div className="max-w-2xl">
              <span className="text-[#E5D3B3] uppercase tracking-[0.3em] text-xs font-semibold block mb-4">The Reserve</span>
              <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">Curated<br/>Assets.</h2>
              <p className="text-gray-400 font-light text-xl leading-relaxed">
                Explore our handpicked collection of private villas, isolated topological nodes, and elite Aegean experiences.
              </p>
            </div>
          </div>
          
          <ScrollNodes displayNodes={displayNodes} />
        </div>
      </section>
      
      {/* Elevated Experiences Bento (New Architectural Layer) */}
      <section className="w-full py-32 bg-[#0A0A0A] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="text-center mb-24">
             <span className="text-[#E5D3B3] uppercase tracking-[0.3em] text-xs font-semibold block mb-4">Specialized Services</span>
             <h2 className="text-4xl md:text-5xl font-serif text-white font-light">Elevated Experiences</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
             {/* Large Column */}
             <div className="md:col-span-2 relative group overflow-hidden bg-[#111]">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605342880053-157457d15655?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
               <div className="absolute bottom-10 left-10 z-10">
                 <span className="text-xs tracking-[0.2em] text-[#E5D3B3] uppercase font-semibold mb-2 block">Marine Asset</span>
                 <h3 className="text-3xl font-serif text-white">Private Yacht Charters</h3>
               </div>
             </div>
             
             {/* Small Columns */}
             <div className="flex flex-col gap-6">
               <div className="h-64 md:h-1/2 relative group overflow-hidden bg-[#111]">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 <div className="absolute bottom-6 left-6 z-10">
                   <h3 className="text-xl font-serif text-white">Culinary Seclusion</h3>
                 </div>
               </div>
               <div className="h-64 md:h-1/2 relative group overflow-hidden bg-[#111]">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-70"></div>
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
