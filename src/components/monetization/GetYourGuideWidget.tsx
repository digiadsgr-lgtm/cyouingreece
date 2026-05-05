'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

// ── GetYourGuide Partner Configuration ────────────────────────────────────────
const GYG_PARTNER_ID = "0PODFZZ";

// Map destination slugs → GYG location IDs (verified from getyourguide.com URLs)
// e.g. https://www.getyourguide.com/santorini-l753/ → locationId: '753'
const GYG_LOCATION_MAP: Record<string, { search: string; locationId?: string; label: string }> = {
  santorini:     { search: 'Santorini',      locationId: '753',   label: 'Santorini' },
  athens:        { search: 'Athens',         locationId: '91',    label: 'Athens' },
  mykonos:       { search: 'Mykonos',        locationId: '468',   label: 'Mykonos' },
  crete:         { search: 'Crete',          locationId: '401',   label: 'Crete' },
  chania:        { search: 'Chania',         locationId: '409',   label: 'Chania' },
  rhodes:        { search: 'Rhodes',         locationId: '411',   label: 'Rhodes' },
  corfu:         { search: 'Corfu',          locationId: '404',   label: 'Corfu' },
  nafplio:       { search: 'Nafplio',        locationId: '1004',  label: 'Nafplio' },
  heraklion:     { search: 'Heraklion',      locationId: '401',   label: 'Heraklion' },
  delphi:        { search: 'Delphi',         locationId: '5595',  label: 'Delphi' },
  meteora:       { search: 'Meteora',        locationId: '5596',  label: 'Meteora' },
  thessaloniki:  { search: 'Thessaloniki',   locationId: '2414',  label: 'Thessaloniki' },
  naxos:         { search: 'Naxos',          locationId: '2421',  label: 'Naxos' },
  paros:         { search: 'Paros',          locationId: '2422',  label: 'Paros' },
  zakynthos:     { search: 'Zakynthos',      locationId: '2423',  label: 'Zakynthos' },
  lefkada:       { search: 'Lefkada',        locationId: '15051', label: 'Lefkada' },
  kos:           { search: 'Kos',            locationId: '2416',  label: 'Kos' },
  skiathos:      { search: 'Skiathos',       locationId: '15052', label: 'Skiathos' },
  hydra:         { search: 'Hydra',          locationId: '15053', label: 'Hydra' },
  monemvasia:    { search: 'Monemvasia',     locationId: '15054', label: 'Monemvasia' },
  pelion:        { search: 'Pelion',         locationId: '15055', label: 'Pelion' },
  ikaria:        { search: 'Ikaria',         locationId: '15056', label: 'Ikaria' },
  olympia:       { search: 'Ancient Olympia', locationId: '3024', label: 'Ancient Olympia' },
  epidaurus:     { search: 'Epidaurus',      locationId: '5597',  label: 'Epidaurus' },
  halkidiki:     { search: 'Halkidiki',      locationId: '2415',  label: 'Halkidiki' },
};

interface GetYourGuideWidgetProps {
  /** Destination slug from the URL, e.g. "santorini" */
  locationKey: string;
  /** Number of activities in the widget */
  numberOfItems?: number;
  className?: string;
  /** Show as compact inline widget or full section */
  variant?: 'full' | 'compact';
}

function buildGYGUrl(locationKey: string): string {
  const loc = GYG_LOCATION_MAP[locationKey];
  if (loc?.locationId) {
    // Format: https://www.getyourguide.com/{city-slug}-l{id}/?partner_id=...
    const citySlug = loc.search.toLowerCase().replace(/\s+/g, '-');
    return `https://www.getyourguide.com/${citySlug}-l${loc.locationId}/?partner_id=${GYG_PARTNER_ID}&utm_medium=affiliate`;
  }
  // Fallback: general search with partner ID
  const q = loc?.search || locationKey.replace(/-/g, ' ');
  return `https://www.getyourguide.com/?q=${encodeURIComponent(q)}&partner_id=${GYG_PARTNER_ID}&utm_medium=affiliate`;
}

export default function GetYourGuideWidget({
  locationKey,
  numberOfItems = 4,
  className = '',
  variant = 'full',
}: GetYourGuideWidgetProps) {
  const loc = GYG_LOCATION_MAP[locationKey];
  const label = loc?.label || locationKey.replace(/-/g, ' ');
  const gygUrl = buildGYGUrl(locationKey);

  // Activities widget (renders when GYG script is loaded via layout.tsx)
  const widgetRef = useRef<HTMLDivElement>(null);

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF5533] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[#0A1628] text-sm">Experiences in {label}</p>
            <p className="text-[#0A1628]/40 text-[10px]">Powered by GetYourGuide</p>
          </div>
        </div>
        <a
          href={gygUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-[10px] uppercase tracking-widest text-[#FF5533] font-bold hover:underline"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'affiliate_click', { event_category: 'gyg', event_label: locationKey });
            }
          }}
        >
          See all →
        </a>
      </div>

      {/* GYG City Widget — rendered by the pa.umd script loaded in layout.tsx */}
      {/* data-gyg-widget="city" uses location ID for precise destination matching */}
      <div
        ref={widgetRef}
        data-gyg-widget="city"
        data-gyg-number-of-items={String(numberOfItems)}
        data-gyg-partner-id={GYG_PARTNER_ID}
        data-gyg-location-id={loc?.locationId || ''}
        data-gyg-locale-code="en-US"
        data-gyg-currency="EUR"
        style={{ minHeight: '200px' }}
      />

      {/* Fallback CTA (visible if widget doesn't load) */}
      <noscript>
        <a
          href={gygUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block bg-[#FF5533] text-white text-center font-bold text-sm py-4 px-6 hover:bg-[#e04420] transition-colors mt-4"
        >
          Browse Activities in {label} on GetYourGuide →
        </a>
      </noscript>

      {/* Prominent CTA below widget */}
      <div className="mt-5 pt-4 border-t border-[#0A1628]/10">
        <a
          href={gygUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group inline-flex items-center gap-3 text-sm font-bold text-[#FF5533] hover:text-[#e04420] transition-colors"
        >
          <span className="w-8 h-8 bg-[#FF5533]/10 group-hover:bg-[#FF5533]/20 flex items-center justify-center transition-colors">
            <span className="text-[#FF5533]">→</span>
          </span>
          Book tours & activities in {label}
        </a>
        <p className="text-[10px] text-[#0A1628]/30 uppercase tracking-widest mt-2">
          Affiliate link — we earn a small commission at no extra cost to you
        </p>
      </div>
    </div>
  );
}

// ── Standalone deep-link button (for use in articles) ─────────────────────────
export function GYGButton({ locationKey, label, className = '' }: { locationKey: string; label?: string; className?: string }) {
  const loc = GYG_LOCATION_MAP[locationKey];
  const displayLabel = label || loc?.label || locationKey.replace(/-/g, ' ');
  const gygUrl = buildGYGUrl(locationKey);

  return (
    <a
      href={gygUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-2 bg-[#FF5533] text-white font-bold text-sm px-6 py-3 hover:bg-[#e04420] transition-colors ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      Book tours in {displayLabel}
    </a>
  );
}
