import HeroSection from "@/components/HeroSection";
import HolidayGuide from "@/components/HolidayGuide";
import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative w-full overflow-hidden">
      
      <HeroSection />
      
      {/* Decorative Energy Seam */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0ff] to-transparent opacity-50 relative z-20"></div>
      
      {/* Map Radar Subsystem */}
      <InteractiveMap />

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#b026ff] to-transparent opacity-50 relative z-20"></div>
      
      {/* Oracle Console Layer */}
      <HolidayGuide />
      
      {/* Matrix Node Hub */}
      <section className="w-full py-24 relative z-10 glass-panel border-t border-[rgba(0,255,255,0.2)] mt-12 text-center">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-space font-bold uppercase neon-text mb-6">Database Nodes</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light mb-16 text-lg">Secure your topological parameters. Engaging our deep-water encrypted array.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Architectural Arrays",
                desc: "Quantified extraction of high-value minimalist geometries and neoclassical ruins.",
                slug: "AX-1"
              },
              {
                title: "Navigational Subsystems",
                desc: "Encrypted routing via autonomous catamaran and advanced nautical vessels.",
                slug: "NAV-2"
              },
              {
                title: "Cultural Decryption",
                desc: "Real-time decoding of indigenous gastronomy and isolated local frequencies.",
                slug: "CUL-3"
              }
            ].map((feature) => (
              <div key={feature.title} className="glass-extreme p-8 md:p-10 flex flex-col group cursor-crosshair border border-[rgba(0,255,255,0.1)] hover:border-[#0ff] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] transition-all duration-500">
                <div className="w-full flex justify-between items-center mb-6 border-b border-[rgba(255,255,255,0.1)] pb-4">
                  <span className="text-[#0ff] font-space tracking-[0.3em] text-xs">MODULE // {feature.slug}</span>
                  <div className="w-2 h-2 bg-[#b026ff] group-hover:bg-[#0ff] shadow-[0_0_10px_#b026ff] rounded-full transition-colors"></div>
                </div>
                <h3 className="text-xl font-space uppercase text-white mb-4 group-hover:text-[#0ff] transition-colors">{feature.title}</h3>
                <p className="text-gray-400 flex-grow font-light text-sm leading-relaxed mb-8">{feature.desc}</p>
                <div className="mt-auto inline-block border border-[#0ff] text-[#0ff] font-space text-xs tracking-[0.2em] uppercase py-2 px-4 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:bg-[#0ff] hover:text-black transition-colors">
                  [ INITIATE LINK ]
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer System */}
      <footer className="w-full py-16 bg-[#02040a] border-t border-[rgba(0,255,255,0.2)] relative z-10 text-center">
        <div className="container mx-auto px-6 opacity-50 flex flex-col justify-center items-center">
           <span className="text-xl font-space text-white tracking-[0.5em] mb-4 neon-text">CYOUINGREECE // TERMINAL</span>
           <p className="text-[10px] text-gray-500 font-space tracking-widest uppercase">
             SECURE CHANNEL. QUANTUM NETWORK OPERATION. ALL BYTES RESERVED 2026.
           </p>
           <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#b026ff] to-transparent mt-8"></div>
        </div>
      </footer>
    </main>
  );
}
