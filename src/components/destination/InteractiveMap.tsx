'use client';
import { useEffect, useRef, useState } from 'react';
import type { GeoCoordinates, MapPin, MapPinCategory } from '@/lib/destination-types';

// ─── Dynamic import for Leaflet (SSR-safe) ────────────────────────────────────

interface Props {
  center: GeoCoordinates;
  pins: MapPin[];
  destinationName: string;
}

const CATEGORY_COLORS: Record<MapPinCategory, string> = {
  beach: '#4DD0E1',
  restaurant: '#FF8A65',
  viewpoint: '#81C784',
  accommodation: '#D4A027',
  hidden_gem: '#CE93D8',
};

const CATEGORY_LABELS: Record<MapPinCategory, string> = {
  beach: '🏖 Beaches',
  restaurant: '🍽 Restaurants',
  viewpoint: '📷 Viewpoints',
  accommodation: '🏨 Stay',
  hidden_gem: '💎 Hidden Gems',
};

export default function InteractiveMap({ center, pins, destinationName }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Set<MapPinCategory>>(
    new Set<MapPinCategory>(['beach', 'restaurant', 'viewpoint', 'accommodation', 'hidden_gem'])
  );
  const markersRef = useRef<Map<string, { marker: any; category: MapPinCategory }>>(new Map());

  // Lazy-load Leaflet only when scrolled into view — saves ~150KB on initial load
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loaded) return;
        setLoaded(true);
        observerRef.current?.disconnect();

        // Dynamically import Leaflet
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        // Fix Leaflet default icon path (broken in bundlers)
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Init map
        const map = L.map(container, {
          center: [center.lat, center.lng],
          zoom: 12,
          zoomControl: true,
          attributionControl: true,
        });
        mapRef.current = map;

        // OpenStreetMap tile layer — 100% free, no API key
        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }
        ).addTo(map);

        // Add custom coloured circle markers for each pin
        pins.forEach((pin) => {
          const color = CATEGORY_COLORS[pin.category];

          const icon = L.divIcon({
            className: '',
            html: `<div style="
              width:14px; height:14px; border-radius:50%;
              background:${color}; border:2.5px solid #fff;
              box-shadow:0 2px 8px rgba(0,0,0,0.45);
              cursor:pointer;
            "></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -10],
          });

          const popupContent = `
            <div style="font-family:system-ui,sans-serif;padding:4px;min-width:140px;max-width:200px;">
              ${pin.thumbnail ? `<img src="${pin.thumbnail}" alt="${pin.name}" style="width:100%;height:72px;object-fit:cover;border-radius:6px;margin-bottom:6px;" />` : ''}
              <strong style="font-size:13px;color:#0A1628;display:block;margin-bottom:3px;">${pin.name}</strong>
              ${pin.description ? `<p style="font-size:11px;color:#555;margin:0 0 5px;">${pin.description}</p>` : ''}
              ${pin.link ? `<a href="${pin.link}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#D4A027;text-decoration:none;">View →</a>` : ''}
            </div>
          `;

          const marker = L.marker([pin.lat, pin.lng], { icon })
            .bindPopup(popupContent, { maxWidth: 210 })
            .addTo(map);

          markersRef.current.set(pin.id, { marker, category: pin.category });
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(container);
    return () => {
      observerRef.current?.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle category visibility
  const toggleCategory = (cat: MapPinCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      const wasActive = next.has(cat);
      if (wasActive) next.delete(cat); else next.add(cat);

      markersRef.current.forEach(({ marker, category }) => {
        if (category === cat) {
          if (wasActive) marker.getElement?.()?.style && (marker.getElement().style.display = 'none');
          else marker.getElement?.()?.style && (marker.getElement().style.display = '');
        }
      });

      return next;
    });
  };

  return (
    <section className="map-section" aria-labelledby="map-heading">
      <h2 id="map-heading" className="map-title">Explore {destinationName}</h2>

      {/* Layer toggles */}
      <div className="map-filters" role="group" aria-label="Map layer filters">
        {(Object.entries(CATEGORY_LABELS) as [MapPinCategory, string][]).map(([cat, label]) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`map-filter-btn ${activeCategories.has(cat) ? 'map-filter-btn--active' : ''}`}
            style={{ '--accent': CATEGORY_COLORS[cat] } as React.CSSProperties}
            aria-pressed={activeCategories.has(cat)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} className="map-container" aria-label={`Map of ${destinationName}`}>
        {!loaded && (
          <div className="map-placeholder">
            <div className="map-placeholder-spinner" aria-hidden="true" />
            <span>Loading map…</span>
          </div>
        )}
      </div>

      <style>{`
        .map-section { padding: 3rem 0; }
        .map-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #FAF9F6;
          margin: 0 0 1.25rem;
        }
        .map-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1rem;
        }
        .map-filter-btn {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 6px 12px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-inter), sans-serif;
        }
        .map-filter-btn--active {
          border-color: var(--accent);
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 10%, transparent);
        }
        .map-container {
          width: 100%;
          height: 440px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          z-index: 0;
        }
        /* Override Leaflet's z-index conflicts with our sticky header */
        .leaflet-control-zoom { z-index: 400 !important; }
        .leaflet-popup { z-index: 500 !important; }

        .map-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          font-family: var(--font-inter), sans-serif;
        }
        .map-placeholder-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: #D4A027;
          border-radius: 50%;
          animation: mapSpin 0.8s linear infinite;
        }
        @keyframes mapSpin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
