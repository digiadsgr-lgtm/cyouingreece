'use client';
import { useEffect, useRef } from 'react';

export default function MetasearchWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Safely inject the Travelpayouts script only on the client side
    // avoiding Next.js hydration crashes
    const script = document.createElement('script');
    script.async = true;
    script.type = 'module';
    script.src = 'https://tpemd.com/wl_web/main.js?wl_id=17144';
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#0A1628] rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10 mt-12 mb-12 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4A027]/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 mb-8">
        <span className="text-[#D4A027] tracking-[0.3em] uppercase text-[10px] font-bold block mb-2">Search & Book</span>
        <h3 className="font-serif text-white text-3xl">Find your flights & stays</h3>
      </div>

      {/* Travelpayouts Containers */}
      <div className="relative z-10">
        <div id="tpwl-search" className="mb-8 min-h-[100px]" />
        <div id="tpwl-tickets" className="min-h-[200px]" />
      </div>

      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-8 text-center border-t border-white/10 pt-4">
        Powered by Travelpayouts
      </p>
    </div>
  );
}
