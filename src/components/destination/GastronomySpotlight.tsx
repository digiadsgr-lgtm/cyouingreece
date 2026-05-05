'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';
import type { GastronomyItem } from '@/lib/destination-types';
import { urlFor } from '@/lib/sanity';

interface Props {
  items: GastronomyItem[];
}

// Animated SVG fork
function ForkIcon() {
  return (
    <motion.svg
      width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      whileHover={{ rotate: 25 }}
      transition={{ type: 'spring', stiffness: 300, damping: 14 }}
      aria-hidden="true"
    >
      <path d="M5 2v7a4 4 0 0 0 8 0V2" />
      <path d="M9 2v20" />
      <path d="M19 2v4a4 4 0 0 1-4 4v12" />
    </motion.svg>
  );
}

export default function GastronomySpotlight({ items }: Props) {
  if (!items?.length) return null;

  return (
    <section className="gastro-section" aria-labelledby="gastro-heading">
      <div className="gastro-header">
        <h2 id="gastro-heading" className="gastro-title">
          <ForkIcon />
          Taste of {items[0] ? 'the Land' : 'Greece'}
        </h2>
        <p className="gastro-subtitle">The dishes that define this place</p>
      </div>

      <div className="gastro-grid">
        {items.map((item, i) => {
          const imgSrc = item.image?.asset?.url
            ? item.image.asset.url
            : item.image?.asset?._ref
            ? urlFor(item.image).width(500).height(350).auto('format').url()
            : null;

          return (
            <article key={i} className="gastro-card">
              {/* Image */}
              <div className="gastro-image-wrap">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={item.dish_name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="gastro-image"
                    placeholder={item.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={item.image?.asset?.metadata?.lqip}
                  />
                ) : (
                  <div className="gastro-image-placeholder">🍽</div>
                )}
              </div>

              {/* Info */}
              <div className="gastro-info">
                <h3 className="gastro-dish">{item.dish_name}</h3>
                {item.description && (
                  <p className="gastro-desc">{item.description}</p>
                )}
                {item.where_to_eat && (
                  <div className="gastro-where">
                    <MapPin size={12} aria-hidden="true" />
                    {item.maps_link ? (
                      <a
                        href={item.maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gastro-maps-link"
                      >
                        {item.where_to_eat}
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span>{item.where_to_eat}</span>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <style>{`
        .gastro-section { padding: 3rem 0; }
        .gastro-header {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-bottom: 2rem;
        }
        .gastro-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #070A0F;
          font-weight: 300;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gastro-subtitle {
          font-size: 13px;
          color: rgba(7,10,15,0.4);
          font-style: italic;
          margin: 0;
          font-family: var(--font-inter), sans-serif;
          letter-spacing: 0.05em;
        }
        .gastro-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 900px) {
          .gastro-grid {
            grid-template-columns: repeat(3, minmax(240px, 1fr));
            scroll-snap-type: x mandatory;
          }
        }
        @media (max-width: 540px) {
          .gastro-grid {
            grid-template-columns: repeat(3, 75vw);
          }
          .gastro-card { scroll-snap-align: start; }
        }

        .gastro-card {
          border-radius: 4px;
          overflow: hidden;
          background: rgba(7,10,15,0.02);
          border: 1px solid rgba(7,10,15,0.06);
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .gastro-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .gastro-image-wrap {
          position: relative;
          width: 100%;
          padding-top: 62%;
        }
        .gastro-image { object-fit: cover; }
        .gastro-image-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          background: #E8E3DA;
        }
        .gastro-info { padding: 1.5rem; }
        .gastro-dish {
          font-family: var(--font-serif), serif;
          font-size: 1.3rem;
          color: #070A0F;
          font-weight: 400;
          margin: 0 0 0.5rem;
        }
        .gastro-desc {
          font-size: 14px;
          color: rgba(7,10,15,0.7);
          line-height: 1.7;
          margin: 0 0 1rem;
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
        }
        .gastro-where {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: rgba(7,10,15,0.5);
          font-family: var(--font-inter), sans-serif;
        }
        .gastro-maps-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #A43312;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .gastro-maps-link:hover { opacity: 0.7; }
      `}</style>
    </section>
  );
}
