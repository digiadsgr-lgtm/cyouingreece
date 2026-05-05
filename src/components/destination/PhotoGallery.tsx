'use client';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import type { SanityImage } from '@/lib/destination-types';
import { urlFor } from '@/lib/sanity';

// Dynamic import for lightbox to avoid SSR issues
import dynamic from 'next/dynamic';
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });

interface Props {
  images: SanityImage[];
  destinationName: string;
}

export default function PhotoGallery({ images, destinationName }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  const openLightbox = useCallback((i: number) => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(-1), []);

  if (!images?.length) return null;

  const slides = images.map((img) => {
    const src = img.asset?.url
      ? img.asset.url
      : img.asset?._ref
      ? urlFor(img).width(1600).auto('format').url()
      : '';
    return {
      src,
      title: img.caption,
      description: img.credit ? `Photo: ${img.credit}${img.location ? ` · ${img.location}` : ''}` : img.location,
    };
  });

  return (
    <section className="gallery-section" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="gallery-title">Gallery</h2>
      <p className="gallery-subtitle">{destinationName} in pictures</p>

      <div className="gallery-masonry" role="list">
        {images.slice(0, 12).map((img, i) => {
          const src = img.asset?.url
            ? img.asset.url
            : img.asset?._ref
            ? urlFor(img).width(600).auto('format').url()
            : null;

          return (
            <button
              key={i}
              className="gallery-item"
              onClick={() => openLightbox(i)}
              role="listitem"
              aria-label={`View photo ${i + 1}${img.caption ? `: ${img.caption}` : ''}`}
            >
              <div className="gallery-img-wrap">
                {src ? (
                  <Image
                    src={src}
                    alt={img.caption || `${destinationName} photo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="gallery-img"
                    loading="lazy"
                    placeholder={img.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.asset?.metadata?.lqip}
                  />
                ) : (
                  <div className="gallery-img-placeholder" />
                )}
                <div className="gallery-img-overlay">
                  {img.caption && <span className="gallery-caption">{img.caption}</span>}
                  {img.credit && <span className="gallery-credit">© {img.credit}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxIdx >= 0 && (
        <Lightbox
          open={lightboxIdx >= 0}
          index={lightboxIdx}
          slides={slides}
          close={closeLightbox}
          styles={{ container: { backgroundColor: 'rgba(10,22,40,0.97)' } }}
        />
      )}

      <style>{`
        .gallery-section { padding: 4rem 0; }
        .gallery-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          color: #070A0F;
          font-weight: 300;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .gallery-subtitle { font-size: 14px; color: rgba(7,10,15,0.4); font-style: italic; margin: 0 0 3rem; font-family: var(--font-inter), sans-serif; letter-spacing: 0.1em; text-transform: uppercase; }

        .gallery-masonry {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-flow: dense;
          gap: 1.5rem;
        }
        @media (max-width: 768px) { .gallery-masonry { display: flex; flex-direction: column; gap: 1rem; } }

        .gallery-item {
          position: relative;
          display: block;
          border: none;
          background: none;
          padding: 0;
          cursor: zoom-in;
          width: 100%;
          border-radius: 4px;
          overflow: hidden;
        }

        /* ── Asymmetric Magazine Grid Rules ── */
        .gallery-item:nth-child(1) { grid-column: span 12; aspect-ratio: 21/9; }
        .gallery-item:nth-child(2) { grid-column: span 5; aspect-ratio: 3/4; }
        .gallery-item:nth-child(3) { grid-column: span 7; aspect-ratio: 4/3; margin-top: 4rem; }
        .gallery-item:nth-child(4) { grid-column: span 8; aspect-ratio: 16/9; }
        .gallery-item:nth-child(5) { grid-column: span 4; aspect-ratio: 1/1; }
        .gallery-item:nth-child(6) { grid-column: span 6; aspect-ratio: 3/2; }
        .gallery-item:nth-child(7) { grid-column: span 6; aspect-ratio: 3/2; margin-top: -2rem; }
        .gallery-item:nth-child(n+8) { grid-column: span 4; aspect-ratio: 4/5; }

        @media (max-width: 768px) {
          .gallery-item { aspect-ratio: auto !important; height: 50vh; margin-top: 0 !important; }
        }

        .gallery-img-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: rgba(182,169,150,0.1);
        }
        
        .gallery-img { object-fit: cover; transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s; }
        .gallery-item:hover .gallery-img { transform: scale(1.05); filter: brightness(0.8); }
        .gallery-img-placeholder { position: absolute; inset: 0; background: #E8E3DA; }
        
        .gallery-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7,10,15,0.6) 0%, transparent 40%);
          opacity: 0;
          transition: opacity 0.5s;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          gap: 4px;
        }
        .gallery-item:hover .gallery-img-overlay { opacity: 1; }
        .gallery-caption { font-size: 13px; color: #F4F0EA; font-family: var(--font-serif), serif; font-style: italic; font-weight: 400; letter-spacing: 0.02em; }
        .gallery-credit { font-size: 10px; color: rgba(244,240,234,0.6); font-family: var(--font-inter), sans-serif; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
    </section>
  );
}
