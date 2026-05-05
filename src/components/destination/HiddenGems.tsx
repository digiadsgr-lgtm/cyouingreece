'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlFor } from '@/lib/sanity';
import type { HiddenGem } from '@/lib/destination-types';

interface Props {
  gems: HiddenGem[];
}

export default function HiddenGems({ gems }: Props) {
  if (!gems?.length) return null;

  return (
    <section className="gems-section">
      <div className="gems-grid">
        {gems.map((gem, i) => {
          const imgSrc = gem.image?.asset?.url
            ? gem.image.asset.url
            : gem.image?.asset?._ref
            ? urlFor(gem.image).width(600).height(400).auto('format').url()
            : null;

          return (
            <motion.article
              key={i}
              className="gem-card"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              aria-label={gem.title}
            >
              {/* "Only locals know" badge */}
              <div className="gem-badge" aria-label="Local secret">
                💎 Only locals know
              </div>

              {/* Image */}
              <div className="gem-image-wrap">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={gem.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="gem-image"
                    placeholder={gem.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={gem.image?.asset?.metadata?.lqip}
                  />
                ) : (
                  <div className="gem-image-placeholder" />
                )}
                <div className="gem-image-overlay" />
              </div>

              {/* Content */}
              <div className="gem-content">
                <h3 className="gem-name">{gem.title}</h3>
                {gem.description && (
                  <p className="gem-description">{gem.description}</p>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      <style>{`
        .gems-section { padding: 1rem 0; }
        .gems-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 900px) { .gems-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px) { .gems-grid { grid-template-columns: 1fr; } }

        .gem-card {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background: rgba(244,240,234,0.02);
          border: 1px solid rgba(244,240,234,0.08);
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .gem-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 3;
          background: rgba(244,240,234,0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(7,10,15,0.1);
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 10px;
          font-weight: 600;
          color: #070A0F;
          letter-spacing: 0.06em;
          font-family: var(--font-inter), sans-serif;
        }
        .gem-image-wrap {
          position: relative;
          width: 100%;
          padding-top: 65%;
        }
        .gem-image { object-fit: cover; transition: transform 0.5s; }
        .gem-card:hover .gem-image { transform: scale(1.04); }
        .gem-image-placeholder {
          position: absolute;
          inset: 0;
          background: #E8E3DA;
        }
        .gem-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(7,10,15,0.3) 100%);
        }
        .gem-content { padding: 1.5rem; }
        .gem-name {
          font-family: var(--font-serif), serif;
          font-size: 1.3rem;
          color: #F4F0EA;
          font-weight: 400;
          margin: 0 0 0.5rem;
        }
        .gem-description {
          font-size: 14px;
          color: rgba(244,240,234,0.7);
          line-height: 1.7;
          margin: 0;
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
