'use client';

interface BookingWidgetProps {
  destination: string;         // e.g. "Santorini, Greece"
  affiliateId?: string;        // Your Booking.com affiliate ID — add when approved
  className?: string;
}

/**
 * Booking.com affiliate search widget.
 * Renders a search box + branded CTA that deep-links to Booking.com with your affiliate ID.
 * 
 * SETUP:
 * 1. Sign up at https://affiliate.booking.com
 * 2. Get your affiliate ID (aid=XXXXXXX)
 * 3. Set NEXT_PUBLIC_BOOKING_AFFILIATE_ID in your .env
 */
export default function BookingWidget({ destination, affiliateId, className = '' }: BookingWidgetProps) {
  const aid = affiliateId || process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID || '';
  
  const buildUrl = (dest: string) => {
    const base = 'https://www.booking.com/searchresults.html';
    const params = new URLSearchParams({
      ss: dest,
      lang: 'en-gb',
      ...(aid ? { aid } : {}),
    });
    return `${base}?${params.toString()}`;
  };

  return (
    <div className={`bg-[#003580] rounded-none p-6 md:p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
          <span className="text-[#003580] font-black text-sm">B.</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm">Find Hotels in {destination}</p>
          <p className="text-white/60 text-xs">via Booking.com — free cancellation on most rooms</p>
        </div>
      </div>

      {/* Search CTA */}
      <a
        href={buildUrl(destination)}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full bg-[#FFB700] text-[#003580] font-bold text-sm text-center py-4 px-6 hover:bg-[#FFC300] transition-colors duration-200 tracking-wide"
        onClick={() => {
          // Track affiliate click
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'affiliate_click', {
              event_category: 'booking_com',
              event_label: destination,
            });
          }
        }}
      >
        Search Available Hotels →
      </a>

      <p className="text-white/30 text-[10px] text-center mt-3 uppercase tracking-widest">
        Affiliate link — we earn a small commission at no extra cost to you
      </p>
    </div>
  );
}
