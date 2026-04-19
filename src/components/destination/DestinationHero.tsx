'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin, Users, Calendar } from 'lucide-react';
import type { Destination, CrowdLevel } from '@/lib/destination-types';
import ScoreRadialBadges from './ScoreRadialBadges';
import { urlFor } from '@/lib/sanity';

interface Props {
  destination: Destination;
  locale: string;
}

const CROWD_LABELS: Record<CrowdLevel, { label: string; color: string }> = {
  very_low: { label: 'Very Quiet', color: '#81C784' },
  low: { label: 'Quiet', color: '#AED581' },
  medium: { label: 'Moderate', color: '#FFD54F' },
  high: { label: 'Busy', color: '#FF8A65' },
  very_high: { label: 'Very Busy', color: '#EF5350' },
};

export default function DestinationHero({ destination, locale }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [chevronVisible, setChevronVisible] = useState(true);

  // IntersectionObserver for nav transparency toggle (at 80px)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
        // Signal header via custom event
        document.dispatchEvent(
          new CustomEvent('destination-scroll', { detail: { past80: !entry.isIntersecting } })
        );
      },
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Hide chevron on scroll
  useEffect(() => {
    const handleScroll = () => setChevronVisible(window.scrollY < 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { name_en, name_local, tagline, at_a_glance, hero_image, region, translations } = destination;

  // Pick translated tagline if available
  const translatedTagline =
    locale !== 'en' ? (translations as Record<string, { tagline?: string }>)[locale]?.tagline : undefined;
  const displayTagline = translatedTagline || tagline;

  // Build image URL with hotspot
  let heroSrc = hero_image?.asset?.url || '';
  if (hero_image?.asset?._ref) {
    heroSrc = urlFor(hero_image).width(1920).height(1080).auto('format').url();
  }

  const crowd = at_a_glance?.crowd_level ? CROWD_LABELS[at_a_glance.crowd_level] : null;
  const budget = at_a_glance?.avg_daily_budget;
  const bestMonths = at_a_glance?.best_months?.slice(0, 3) ?? [];

  // Hotspot-based CSS object-position
  const hotspotStyle = hero_image?.hotspot
    ? { objectPosition: `${hero_image.hotspot.x * 100}% ${hero_image.hotspot.y * 100}%` }
    : {};

  return (
    <section className="destination-hero" aria-label={`Hero section for ${name_en}`}>
      {/* Sentinel for nav IntersectionObserver */}
      <div ref={sentinelRef} className="hero-sentinel" />

      {/* Background image */}
      <div className="hero-image-container">
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt={`${name_en}, Greece`}
            fill
            priority
            sizes="100vw"
            className="hero-image"
            style={hotspotStyle}
            placeholder={hero_image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={hero_image?.asset?.metadata?.lqip}
          />
        ) : (
          <div className="hero-image-placeholder" />
        )}
        {/* Dark gradient overlay */}
        <div className="hero-overlay" />
      </div>

      {/* Bottom content grid */}
      <div className="hero-content">
        {/* Left: breadcrumb + title + tagline + pills */}
        <div className="hero-left">
          {/* Breadcrumb */}
          <nav className="hero-breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
              <li><a href={`/${locale}`}>Greece</a></li>
              <li aria-hidden="true">›</li>
              <li>
                <a href={`/${locale}/destinations?region=${region?.slug?.current}`}>
                  {region?.name || 'Region'}
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">{name_en}</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="hero-title">
            <span className="hero-title-local">{name_local}</span>
            {name_en !== name_local && (
              <span className="hero-title-en">{name_en}</span>
            )}
          </h1>

          {/* Tagline */}
          {displayTagline && (
            <p className="hero-tagline">{displayTagline}</p>
          )}

          {/* At-a-glance pills */}
          <div className="hero-pills" role="list" aria-label="Quick facts">
            {bestMonths.length > 0 && (
              <div className="hero-pill" role="listitem">
                <Calendar size={12} strokeWidth={2} />
                <span>{bestMonths.join(', ')}</span>
              </div>
            )}
            {crowd && (
              <div className="hero-pill" role="listitem" style={{ borderColor: crowd.color + '66' }}>
                <Users size={12} strokeWidth={2} />
                <span style={{ color: crowd.color }}>{crowd.label}</span>
              </div>
            )}
            {budget && (
              <div className="hero-pill" role="listitem">
                <span className="pill-euro">€</span>
                <span>€{budget.backpacker}–€{budget.luxury}/day</span>
              </div>
            )}
            <div className="hero-pill" role="listitem">
              <MapPin size={12} strokeWidth={2} />
              <span>{destination.type.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Right: radial score badges */}
        {at_a_glance?.scores && (
          <div className="hero-right" aria-label="Experience scores">
            <ScoreRadialBadges scores={at_a_glance.scores} />
          </div>
        )}
      </div>

      {/* Scroll chevron */}
      <button
        className={`hero-chevron ${chevronVisible ? 'hero-chevron--visible' : ''}`}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </button>

      <style>{`
        .destination-hero {
          position: relative;
          width: 100%;
          height: 90vh;
          min-height: 520px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
        }
        .hero-sentinel {
          position: absolute;
          top: 80px;
          left: 0;
          width: 100%;
          height: 1px;
          pointer-events: none;
        }
        .hero-image-container {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-image {
          object-fit: cover;
          filter: brightness(0.75) saturate(1.1);
        }
        .hero-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0A1628 0%, #1a2a40 100%);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(10,22,40,0.92) 100%);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          padding: 0 clamp(1.5rem, 5vw, 4rem) clamp(2rem, 5vh, 3.5rem);
          width: 100%;
        }
        .hero-left {
          flex: 1;
          max-width: 680px;
        }
        .hero-right {
          flex-shrink: 0;
          padding-bottom: 0.5rem;
        }
        @media (max-width: 640px) {
          .hero-right { display: none; }
          .hero-content { padding: 0 1.25rem 2rem; }
        }

        /* Breadcrumb */
        .hero-breadcrumb { margin-bottom: 1rem; }
        .breadcrumb-list {
          display: flex;
          align-items: center;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
        }
        .breadcrumb-list li { font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 0.08em; text-transform: uppercase; }
        .breadcrumb-list a { color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
        .breadcrumb-list a:hover { color: #D4A027; }
        .breadcrumb-list [aria-current="page"] { color: rgba(255,255,255,0.9); font-weight: 500; }

        /* Title */
        .hero-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(2.2rem, 6vw, 3.5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          margin: 0 0 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.1em;
        }
        .hero-title-local { display: block; }
        .hero-title-en {
          font-size: 0.55em;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.05em;
        }

        /* Tagline */
        .hero-tagline {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: clamp(1rem, 2vw, 1.125rem);
          color: rgba(255,255,255,0.78);
          margin: 0 0 1.25rem;
          max-width: 520px;
          line-height: 1.5;
        }

        /* Pills */
        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.04em;
          text-transform: capitalize;
          font-family: var(--font-inter), sans-serif;
        }
        .pill-euro { font-size: 12px; font-weight: 600; color: #D4A027; }

        /* Chevron */
        .hero-chevron {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.4s;
          animation: heroBounce 2s ease-in-out infinite;
          padding: 0;
        }
        .hero-chevron--visible { opacity: 1; }
        .hero-chevron:hover { color: #D4A027; }
        @keyframes heroBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
