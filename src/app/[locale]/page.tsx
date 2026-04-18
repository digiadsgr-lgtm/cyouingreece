import HeroSection from "@/components/HeroSection";
import HolidayGuide from "@/components/HolidayGuide";
import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative w-full bg-[#FCFDFF]">
      
      <HeroSection />
      
      {/* AI Concierge Layer */}
      <HolidayGuide />
      
      {/* Map Exploration Subsystem */}
      <InteractiveMap />
      
      {/* Editorial Content Hub */}
      <section className="w-full py-24 relative bg-slate-50 border-t border-gray-200 text-center">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16">
            <span className="text-[#D4AF37] uppercase tracking-widest text-sm font-semibold">The Core Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#003366] mt-4 mb-6">Autonomous Insight</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-light text-lg">
              Our continuous AI engine curates, verifies, and publishes exclusive travel paradigms. Sourcing local culture directly into your itinerary.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Architectural Vistas",
                desc: "Discover centuries of heritage fused directly into exclusive properties and local estates.",
                slug: "Estates"
              },
              {
                title: "Nautical Exclusivity",
                desc: "Private routes spanning the Aegean and Ionian seas, avoiding the congested mainframes.",
                slug: "Charters"
              },
              {
                title: "Gastronomic Depth",
                desc: "Real-time insights into Michelin-tier and ultra-local hidden dining experiences.",
                slug: "Culture"
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-10 flex flex-col group cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-500 rounded-2xl">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:bg-[#003366] transition-colors duration-300">
                  <div className="w-6 h-6 border-2 border-[#003366] rounded-full group-hover:border-[#D4AF37]"></div>
                </div>
                <h3 className="text-2xl font-serif text-[#003366] mb-4 group-hover:text-[#D4AF37] transition-colors">{feature.title}</h3>
                <p className="text-gray-500 flex-grow font-light text-base leading-relaxed mb-8">{feature.desc}</p>
                <div className="mt-auto mx-auto border-b-2 border-transparent group-hover:border-[#D4AF37] pb-1 text-[#003366] font-semibold text-sm tracking-wider uppercase transition-all duration-300">
                  Explore {feature.slug}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Elegant Footer */}
      <footer className="w-full py-16 bg-[#003366] text-center">
        <div className="container mx-auto px-6 flex flex-col justify-center items-center">
           <span className="text-3xl font-serif text-white mb-6">CYouInGreece</span>
           <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mb-8"></div>
           <p className="text-xs text-blue-200 font-light tracking-widest uppercase">
             © 2026 The Ultimate Hellenic Voyage. All Rights Reserved.
           </p>
        </div>
      </footer>
    </main>
  );
}
