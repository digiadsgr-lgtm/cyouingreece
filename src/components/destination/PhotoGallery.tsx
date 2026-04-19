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
        .gallery-section { padding: 3rem 0; }
        .gallery-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #FAF9F6;
          margin: 0 0 0.3rem;
        }
        .gallery-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); font-style: italic; margin: 0 0 1.5rem; font-family: var(--font-inter), sans-serif; }

        .gallery-masonry {
          columns: 3;
          column-gap: 10px;
          gap: 10px;
        }
        @media (max-width: 768px) { .gallery-masonry { columns: 2; } }
        @media (max-width: 480px) { .gallery-masonry { columns: 1; } }

        .gallery-item {
          break-inside: avoid;
          display: block;
          margin-bottom: 10px;
          border: none;
          background: none;
          padding: 0;
          cursor: zoom-in;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
        }
        .gallery-img-wrap {
          position: relative;
          width: 100%;
          padding-top: 75%;
          overflow: hidden;
          border-radius: 10px;
        }
        .gallery-item:nth-child(3n+2) .gallery-img-wrap { padding-top: 100%; }
        .gallery-item:nth-child(5n+1) .gallery-img-wrap { padding-top: 60%; }
        .gallery-img { object-fit: cover; transition: transform 0.45s ease, filter 0.3s; }
        .gallery-item:hover .gallery-img { transform: scale(1.04); filter: brightness(0.85); }
        .gallery-img-placeholder { position: absolute; inset: 0; background: #1a2a40; }
        .gallery-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,22,40,0.8) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 10px 12px;
          gap: 2px;
        }
        .gallery-item:hover .gallery-img-overlay { opacity: 1; }
        .gallery-caption { font-size: 11px; color: rgba(255,255,255,0.9); font-family: var(--font-inter), sans-serif; font-weight: 500; }
        .gallery-credit { font-size: 10px; color: rgba(255,255,255,0.55); font-family: var(--font-inter), sans-serif; }
      `}</style>
    </section>
  );
}
