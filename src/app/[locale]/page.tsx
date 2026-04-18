import HeroSection from "@/components/HeroSection";
import HolidayGuide from "@/components/HolidayGuide";
import InteractiveMap from "@/components/InteractiveMap";
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
    title: node.name || node.title || "Unknown Destination",
    tag: String(node._type).toUpperCase(),
    desc: node.description || "Detailed narrative continuously constructed by the Hellenic AI Engine.",
    img: node.heroImage || "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2000&auto=format&fit=crop"
  })) : [
    { 
      title: "System Booting", 
      tag: "ORACLE ONLINE",
      desc: "The Autonomous Engine has been ignited. Content generation for the Hellenic archipelago is currently underway. Refresh shortly.",
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col relative w-full bg-[#000814] text-white">
      
      {/* 3D WebGL Shader Hero */}
      <HeroSection />
      
      {/* AI Concierge Layer - Dark Mode Override */}
      <div className="relative z-20 bg-[#001122]">
        <HolidayGuide />
      </div>
      
      {/* Map Exploration Subsystem */}
      <InteractiveMap />
      
      {/* Massive Awwwards Level Editorial Hub */}
      <section className="w-full relative bg-[#000814] overflow-hidden py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12">
            <div className="max-w-2xl">
              <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-semibold block mb-4">Autonomous Architecture</span>
              <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">Curated<br/>Nodes_</h2>
              <p className="text-gray-400 font-light text-xl leading-relaxed">
                The Hellenic archipelago decoded. Scroll through the AI-verified destinations below, generated in real-time by the Autonomous Engine.
              </p>
            </div>
          </div>
          
          <ScrollNodes displayNodes={displayNodes} />
        </div>
      </section>
      
      {/* Elegant Awwwards Footer */}
      <footer className="w-full py-24 bg-[#00040A] text-center border-t border-white/5">
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
