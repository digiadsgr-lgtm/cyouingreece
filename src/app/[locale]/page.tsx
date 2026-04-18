import HeroSection from "@/components/HeroSection";
import HolidayGuide from "@/components/HolidayGuide";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <HeroSection />
      
      {/* Decorative Seam */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
      
      {/* Holiday Guide Application Layer */}
      <HolidayGuide />
      
      {/* Features Outline Matrix Section */}
      <section className="w-full py-24 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Uncompromising Luxury</h2>
            <p className="text-slate-400 max-w-2xl">Access our highly guarded network of secluded villas, private charters, and native experiences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Curated Villas",
                desc: "Verified high-end properties spanning Cycladic minimalism to Ionian mansions.",
                slug: "Villas"
              },
              {
                title: "Private Navigations",
                desc: "Catamarans and yachts deployed from major Hellenic marinas.",
                slug: "Charters"
              },
              {
                title: "Cultural Autonomy",
                desc: "Expertly sourced gastronomic and archaeological immersions without the crowds.",
                slug: "Experiences"
              }
            ].map((feature) => (
              <div key={feature.title} className="glass p-8 rounded-2xl flex flex-col hover:border-slate-500 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-blue-600 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 flex-grow font-light text-sm leading-relaxed mb-6">{feature.desc}</p>
                <div className="mt-auto flex items-center text-blue-400 text-sm font-semibold uppercase tracking-wider group-hover:text-blue-300">
                  <span className="mr-2">Explore {feature.slug}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full bg-slate-950 py-12 border-t border-slate-900 border-opacity-50">
        <div className="container mx-auto px-6 flex flex-col justify-between items-center opacity-60">
           <span className="text-2xl font-bold text-white tracking-tighter mb-4">CYOUINGREECE</span>
           <p className="text-xs text-slate-500 uppercase tracking-widest text-center">
             © 2026 CYOUINGREECE ENTERPRISE. ALL RIGHTS RESERVED. AI RECOMMENDER SYSTEM V1.0.
           </p>
        </div>
      </footer>
    </main>
  );
}
