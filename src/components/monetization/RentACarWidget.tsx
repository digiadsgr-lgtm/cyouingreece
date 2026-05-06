'use client';
import { useEffect, useRef } from 'react';

interface RentACarWidgetProps {
  className?: string;
}

export default function RentACarWidget({ className = '' }: RentACarWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;

    const script = document.createElement('script');
    script.async = true;
    script.charset = 'utf-8';
    script.src = '//tpemd.com/content?trs=525708&shmarker=725317&locale=en&country=153&city=68511&powered_by=true&campaign_id=87&promo_id=2466';
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`rounded-2xl border border-[#D4A027]/20 bg-gradient-to-br from-[#0A1628] to-[#0d1f3c] p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#D4A027]/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A027" strokeWidth="1.5">
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5m-5 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            <path d="M16 3l1 5h4"/>
          </svg>
        </div>
        <div>
          <p className="font-bold text-white text-sm tracking-wide">Rent a Car in Greece</p>
          <p className="text-white/30 text-[10px] uppercase tracking-widest">Best rates · No hidden fees</p>
        </div>
      </div>

      {/* Widget container */}
      <div ref={containerRef} className="min-h-[120px]" />

      <p className="text-[9px] text-white/20 uppercase tracking-widest mt-4 text-center">
        Powered by Travelpayouts · We earn a small commission at no extra cost to you
      </p>
    </div>
  );
}
