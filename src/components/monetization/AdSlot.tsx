'use client';
import { useEffect, useRef } from 'react';

interface AdSlotProps {
  /** Unique slot ID from your AdSense account */
  slotId?: string;
  /** Ad format */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  /** Display style */
  style?: React.CSSProperties;
  className?: string;
  /** Label shown above ad */
  label?: boolean;
}

/**
 * Google AdSense ad slot component.
 * 
 * SETUP:
 * 1. Apply at https://adsense.google.com (needs Privacy Policy, Terms, About pages ✅)
 * 2. Once approved, get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXXX)
 * 3. Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID in .env
 * 4. Create ad units in AdSense dashboard, get slot IDs
 * 5. Pass slotId prop to each AdSlot instance
 */
export default function AdSlot({
  slotId,
  format = 'auto',
  style,
  className = '',
  label = true,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!publisherId || !slotId) return;
    try {
      const pushAd = () => {
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } else {
          setTimeout(pushAd, 500); // Retry if script not loaded yet
        }
      };
      pushAd();
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, [publisherId, slotId]);

  // Don't render anything until publisher ID and slot ID are configured
  if (!publisherId || !slotId) {
    return (
      <div className={`border border-dashed border-[#D4A027]/40 bg-[#D4A027]/5 p-4 text-center ${className}`}>
        <p className="text-[#D4A027] text-[10px] uppercase tracking-widest font-bold">
          Ad Slot — Pending AdSense Approval
        </p>
        <p className="text-[#0A1628]/30 text-[10px] mt-1">
          Add NEXT_PUBLIC_ADSENSE_PUBLISHER_ID and slotId when approved
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <p className="text-[#0A1628]/25 text-[10px] uppercase tracking-widest text-center mb-1">
          Advertisement
        </p>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
