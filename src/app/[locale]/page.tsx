import HeroSection from "@/components/HeroSection";
import HolidayGuide from "@/components/HolidayGuide";
import InteractiveMap from "@/components/InteractiveMap";
import { sanityClient } from "@/lib/sanity";

export const revalidate = 15; // Revalidate every 15 seconds to catch new AI articles

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
          
          <div className="flex flex-col space-y-32">
            {displayNodes.map((node, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 group`}>
                {/* Massive Image Container */}
                <div className="w-full md:w-3/5 h-[600px] relative overflow-hidden rounded-sm">
                  <div className="absolute inset-0 bg-[#001122] z-10 opacity-30 group-hover:opacity-0 transition-opacity duration-1000 mix-blend-multiply"></div>
                  <img 
                    src={node.img} 
                    alt={node.title}
                    className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                </div>
                
                {/* Floating Typography Block */}
                <div className={`w-full md:w-2/5 flex flex-col ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-[10px] font-bold mb-4 border-l-2 border-[#D4AF37] pl-3 py-1">
                    {node.tag}
                  </span>
                  <h3 className="text-5xl font-serif text-white mb-6 group-hover:text-[#D4AF37] transition-colors duration-500">{node.title}</h3>
                  <p className="text-gray-400 font-light text-lg leading-relaxed mb-10">{node.desc}</p>
                  
                  <button className="self-start relative group/btn overflow-hidden border border-white/20 px-8 py-4">
                    <span className="relative z-10 text-white text-xs tracking-widest uppercase font-semibold group-hover/btn:text-[#000814] transition-colors duration-500">
                      Explore Parameter
                    </span>
                    <div className="absolute inset-0 bg-white transform -translate-x-[101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
