'use client';
import { useEffect, useRef } from 'react';

interface HotelWidgetProps {
  className?: string;
}

export default function HotelWidget({ className = '' }: HotelWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent multiple injections if React runs useEffect twice in strict mode
    if (containerRef.current && containerRef.current.innerHTML !== '') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = "https://tpemd.com/content?currency=EUR&trs=525708&shmarker=725317&locale=en&city_id=2&category=4&amount=3&powered_by=true&campaign_id=137&promo_id=4497";
    script.charset = "utf-8";

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className={`hotel-widget-container ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-[#0A1628] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold text-[#0A1628] text-sm">Where to Stay</p>
          <p className="text-[#0A1628]/40 text-[10px]">Recommended Hotels</p>
        </div>
      </div>
      <div ref={containerRef} className="min-h-[200px]" />
      <p className="text-[10px] text-[#0A1628]/30 uppercase tracking-widest mt-4">
        Powered by Travelpayouts
      </p>
    </div>
  );
}
