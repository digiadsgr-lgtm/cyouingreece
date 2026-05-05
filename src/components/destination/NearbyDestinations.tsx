import Image from 'next/image';
import type { NearbyDestination } from '@/lib/destination-types';
import { urlFor } from '@/lib/sanity';
import { MapPin } from 'lucide-react';

interface Props {
  destinations: NearbyDestination[];
  locale: string;
}

export default function NearbyDestinations({ destinations, locale }: Props) {
  if (!destinations?.length) return null;

  return (
    <section className="nearby-section" aria-labelledby="nearby-heading">
      <div className="nearby-header">
        <h2 id="nearby-heading" className="nearby-title">You Might Also Love</h2>
        <p className="nearby-subtitle">More destinations worth exploring</p>
      </div>

      <div className="nearby-scroll" role="list">
        {destinations.map((dest) => {
          const imgSrc = dest.hero_image?.asset?.url
            ? dest.hero_image.asset.url
            : dest.hero_image?.asset?._ref
            ? urlFor(dest.hero_image).width(400).height(280).auto('format').url()
            : null;

          return (
            <a
              key={dest._id}
              href={`/${locale}/destinations/${dest.slug.current}`}
              className="nearby-card"
              role="listitem"
              aria-label={`Go to ${dest.name_en}`}
            >
              <div className="nearby-img-wrap">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={dest.name_en}
                    fill
                    sizes="240px"
                    className="nearby-img"
                    placeholder={dest.hero_image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={dest.hero_image?.asset?.metadata?.lqip}
                  />
                ) : (
                  <div className="nearby-img-placeholder" />
                )}
                <div className="nearby-img-overlay" />

                {/* Type badge */}
                <span className="nearby-type-badge">
                  {dest.type.replace('_', ' ')}
                </span>
              </div>

              <div className="nearby-info">
                <div className="nearby-region">
                  <MapPin size={10} />
                  {dest.region?.name ?? 'Greece'}
                </div>
                <h3 className="nearby-name">{dest.name_en}</h3>
                {dest.name_local && dest.name_local !== dest.name_en && (
                  <span className="nearby-local">{dest.name_local}</span>
                )}
                {dest.travel_time && (
                  <span className="nearby-travel">{dest.travel_time}</span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      <style>{`
        .nearby-section { padding: 3rem 0; }
        .nearby-header { margin-bottom: 1.5rem; }
        .nearby-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #070A0F;
          font-weight: 300;
          margin: 0 0 0.3rem;
        }
        .nearby-subtitle { font-size: 13px; color: rgba(7,10,15,0.4); font-style: italic; margin: 0; font-family: var(--font-inter), sans-serif; letter-spacing: 0.05em; }

        .nearby-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          padding-bottom: 0.5rem;
          scrollbar-width: none;
        }
        .nearby-scroll::-webkit-scrollbar { display: none; }

        .nearby-card {
          flex-shrink: 0;
          width: 220px;
          border-radius: 4px;
          overflow: hidden;
          background: rgba(7,10,15,0.02);
          border: 1px solid rgba(7,10,15,0.06);
          text-decoration: none;
          scroll-snap-align: start;
          transition: transform 0.25s, border-color 0.25s;
          display: flex;
          flex-direction: column;
        }
        .nearby-card:hover { transform: translateY(-4px); border-color: rgba(164,51,18,0.2); }

        .nearby-img-wrap {
          position: relative;
          width: 100%;
          padding-top: 65%;
          overflow: hidden;
        }
        .nearby-img { object-fit: cover; transition: transform 0.45s; }
        .nearby-card:hover .nearby-img { transform: scale(1.06); }
        .nearby-img-placeholder { position: absolute; inset: 0; background: #E8E3DA; }
        .nearby-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(7,10,15,0.1) 100%);
        }
        .nearby-type-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(244,240,234,0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(7,10,15,0.05);
          border-radius: 4px;
          padding: 3px 8px;
          font-size: 9px;
          font-weight: 600;
          text-transform: capitalize;
          color: #070A0F;
          letter-spacing: 0.06em;
          font-family: var(--font-inter), sans-serif;
        }

        .nearby-info { padding: 0.9rem 1rem 1rem; flex: 1; }
        .nearby-region { display: flex; align-items: center; gap: 4px; font-size: 10px; color: rgba(7,10,15,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; font-family: var(--font-inter), sans-serif; }
        .nearby-name { font-family: var(--font-inter), sans-serif; font-size: 14px; font-weight: 500; color: #070A0F; margin: 0 0 3px; line-height: 1.3; }
        .nearby-local { font-size: 12px; color: rgba(7,10,15,0.5); display: block; margin-bottom: 6px; font-family: var(--font-serif), serif; font-style: italic; }
        .nearby-travel { font-size: 11px; color: #A43312; font-weight: 500; font-family: var(--font-inter), sans-serif; }
      `}</style>
    </section>
  );
}
