'use client';

export default function InteractiveMap() {
  return (
    <section className="py-24 relative w-full flex flex-col items-center">
      <div className="w-full max-w-5xl mb-8 text-center">
        <h2 className="text-3xl font-space tracking-[0.3em] neon-text uppercase">Topological Radar Grid</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#0ff] to-transparent mx-auto mt-4"></div>
      </div>
      
      <div className="w-full max-w-5xl h-[500px] glass-panel rounded-3xl relative overflow-hidden flex items-center justify-center p-8">
        
        {/* Holographic Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)', 
               backgroundSize: '40px 40px',
               backgroundPosition: 'center center'
             }}
        />

        {/* Central Radar Sweep */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -mt-[400px] -ml-[400px] rounded-full border border-[rgba(0,255,255,0.1)] opacity-30 pointer-events-none">
           <div className="w-1/2 h-1/2 bg-gradient-to-tr from-transparent via-[#0ff] to-transparent origin-bottom-right animate-[spin_4s_linear_infinite] opacity-40"></div>
        </div>

        {/* Geographic Node Markers (Simulated Islands) */}
        <div className="absolute top-[30%] left-[40%] text-center group cursor-pointer">
          <div className="w-3 h-3 bg-[#b026ff] rounded-full shadow-[0_0_15px_#b026ff] animate-ping mx-auto"></div>
          <div className="mt-2 text-[10px] font-space text-[#b026ff] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-[rgba(0,0,0,0.8)] px-2 py-1 rounded border border-[#b026ff]">NODE_MYC</div>
        </div>
        
        <div className="absolute top-[60%] left-[60%] text-center group cursor-pointer">
          <div className="w-4 h-4 bg-[#0ff] rounded-full shadow-[0_0_20px_#0ff] mx-auto z-10 relative"></div>
          <div className="absolute -inset-2 rounded-full border border-[#0ff] animate-ping opacity-50"></div>
          <div className="mt-2 text-[10px] font-space text-[#0ff] uppercase tracking-widest bg-[rgba(0,0,0,0.8)] px-2 py-1 rounded border border-[#0ff]">NODE_JTR</div>
        </div>

        <div className="absolute top-[75%] left-[30%] text-center group cursor-pointer">
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] mx-auto opacity-50"></div>
          <div className="mt-2 text-[10px] font-space text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-[rgba(0,0,0,0.8)] px-2 py-1 rounded">NODE_CHQ</div>
        </div>

        {/* UI Overlay */}
        <div className="z-10 bg-[rgba(0,0,0,0.7)] backdrop-blur-md px-8 py-6 rounded-lg text-center border border-[rgba(0,255,255,0.2)]">
          <p className="text-[#0ff] font-space mb-2 tracking-widest text-sm">[ MAP SUBSYSTEM OFFLINE ]</p>
          <p className="text-gray-400 font-light text-xs max-w-xs mx-auto">Awaiting integration with Mapbox/Google API for live geospatial rendering.</p>
        </div>
      </div>
    </section>
  );
}
