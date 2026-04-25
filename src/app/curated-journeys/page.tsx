

import Image from 'next/image';

export default function CuratedJourneys() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase mb-4">Curated Journeys</h1>
          <p className="text-white/60 max-w-2xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
            Meticulously designed itineraries that bypass the crowds and embrace the authentic soul of Greece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Journey 1 */}
          <div className="group relative overflow-hidden h-[600px] border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1601581975053-7680f7f9e01b?q=80&w=1200&auto=format&fit=crop" 
              alt="Cycladic Off-Grid"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <span className="text-brand-golden uppercase tracking-[0.3em] text-[10px] font-bold mb-2">7 Days • 3 Islands</span>
              <h2 className="text-3xl font-serif text-white tracking-wide uppercase mb-4">The Cycladic Off-Grid</h2>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">
                Discover the untamed beauty of Sikinos, Folegandros, and Kimolos. Leave the cruise ships behind and find true Aegean solitude.
              </p>
            </div>
          </div>

          {/* Journey 2 */}
          <div className="group relative overflow-hidden h-[600px] border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop" 
              alt="The Ionian Deep Blue"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <span className="text-brand-golden uppercase tracking-[0.3em] text-[10px] font-bold mb-2">10 Days • 2 Islands & Mainland</span>
              <h2 className="text-3xl font-serif text-white tracking-wide uppercase mb-4">The Ionian Deep Blue</h2>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">
                Sail through the lush green mountains and crystal waters of Paxos, Antipaxos, and the hidden coves of Epirus.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
