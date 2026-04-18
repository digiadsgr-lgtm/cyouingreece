'use client';
import Image from 'next/image';

export default function InteractiveMap() {
  return (
    <section className="py-24 relative w-full flex flex-col items-center bg-[#FCFDFF]">
      <div className="w-full max-w-6xl mb-12 text-center px-6">
        <h2 className="text-4xl font-serif text-[#003366] mb-4">Curated Territories</h2>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mb-6"></div>
        <p className="text-slate-500 font-light max-w-2xl mx-auto">
          Navigate our meticulously verified portfolio of Hellenic regions. From the wind-swept Cyclades to the aristocratic Ionian.
        </p>
      </div>
      
      <div className="w-full max-w-6xl h-[600px] relative overflow-hidden rounded-2xl shadow-2xl mx-6">
        
        {/* Placeholder High-Res Map/Aerial Background */}
        <Image 
          src="https://images.unsplash.com/photo-1605153864431-a2795a1b2f95?q=80&w=2574&auto=format&fit=crop"
          alt="Aerial View of Greek Islands"
          fill
          className="object-cover"
        />
        
        {/* Elegant overlay to make markers pop */}
        <div className="absolute inset-0 bg-[#003366] bg-opacity-20"></div>

        {/* Geographic Markers */}
        <div className="absolute top-[35%] left-[45%] text-center group cursor-pointer transition-transform hover:-translate-y-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-transparent group-hover:border-[#D4AF37] transition-all">
            <div className="w-3 h-3 bg-[#003366] rounded-full"></div>
          </div>
          <div className="mt-4 bg-white px-4 py-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            <p className="font-serif text-[#003366] font-bold">Mykonos</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Cosmopolitan Node</p>
          </div>
        </div>
        
        <div className="absolute top-[65%] left-[55%] text-center group cursor-pointer transition-transform hover:-translate-y-2">
          <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,51,102,0.4)] border-2 border-[#D4AF37] relative z-10">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div className="mt-4 bg-[#003366] px-5 py-3 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 min-w-[150px]">
            <p className="font-serif text-white font-bold text-lg">Santorini</p>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest mt-1 mb-2">Prime Region</p>
            <button className="text-xs text-white border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors">Explore</button>
          </div>
        </div>

        {/* Floating UI overlay */}
        <div className="absolute bottom-8 left-8 glass-light p-6 rounded-lg max-w-xs shadow-xl">
          <h3 className="font-serif text-[#003366] text-xl mb-2">Geospatial Engine</h3>
          <p className="text-sm text-gray-600 font-light">Interactive node exploration currently routing via prototype data.</p>
        </div>
      </div>
    </section>
  );
}
