'use client';
import { useEffect, useRef } from 'react';

const PUBLISHER_ID = "ca-pub-7060949710564119";

function useAdSense() {
  useEffect(() => {
    try {
      const pushAd = () => {
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } else {
          setTimeout(pushAd, 500);
        }
      };
      pushAd();
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);
}

export function AdInArticle({ className = "" }: { className?: string }) {
  useAdSense();
  return (
    <div className={`w-full my-12 border border-dashed border-white/10 bg-white/5 rounded-lg p-4 min-h-[120px] flex flex-col items-center justify-center ${className}`}>
      <p className="text-[#D4A027]/40 text-[10px] uppercase tracking-widest text-center mb-2 font-bold">AdSense — In-Article Slot</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', width: '100%', minHeight: '90px' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={PUBLISHER_ID}
        data-ad-slot="4706017448"
      />
    </div>
  );
}

export function AdDisplay({ className = "" }: { className?: string }) {
  useAdSense();
  return (
    <div className={`w-full my-12 border border-dashed border-white/10 bg-white/5 rounded-lg p-4 min-h-[280px] flex flex-col items-center justify-center ${className}`}>
      <p className="text-[#D4A027]/40 text-[10px] uppercase tracking-widest text-center mb-2 font-bold">AdSense — Display Slot</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '250px' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot="7252289730"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdMultiplex({ className = "" }: { className?: string }) {
  useAdSense();
  return (
    <div className={`w-full my-16 border border-dashed border-[#1855a5]/20 bg-[#1855a5]/5 rounded-xl p-8 min-h-[300px] flex flex-col items-center justify-center ${className}`}>
      <p className="text-[#1855a5]/40 text-[10px] uppercase tracking-widest text-center mb-6 font-bold tracking-[0.3em]">AdSense — Multiplex Grid</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '280px' }}
        data-ad-format="autorelaxed"
        data-ad-client={PUBLISHER_ID}
        data-ad-slot="7789749891"
      />
    </div>
  );
}

// Fallback default AdSlot export to not break existing imports
export default function AdSlot({ className = "" }: { className?: string; format?: string; slotId?: string }) {
  return <AdDisplay className={className} />;
}
