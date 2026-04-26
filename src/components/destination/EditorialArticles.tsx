import Image from 'next/image';
import type { EditorialArticle } from '@/lib/destination-types';
import { urlFor } from '@/lib/sanity';
import { ArrowRight } from 'lucide-react';

interface Props {
  articles: EditorialArticle[];
}

export default function EditorialArticles({ articles }: Props) {
  if (!articles?.length) return null;

  return (
    <section className="editorial-section">
      <div className="editorial-grid">
        {articles.slice(0, 6).map((article) => {
          const imgSrc = article.hero_image?.asset?.url
            ? article.hero_image.asset.url
            : article.hero_image?.asset?._ref
            ? urlFor(article.hero_image).width(600).height(360).auto('format').url()
            : null;

          return (
            <a
              key={article._id}
              href={`/journal/${article.slug.current}`}
              className="editorial-card"
              aria-label={`Read: ${article.title}`}
            >
              <div className="editorial-img-wrap">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="editorial-img"
                    placeholder={article.hero_image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={article.hero_image?.asset?.metadata?.lqip}
                  />
                ) : (
                  <div className="editorial-img-placeholder" />
                )}
              </div>
              <div className="editorial-info">
                {article.published_at && (
                  <time className="editorial-date" dateTime={article.published_at}>
                    {new Date(article.published_at).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                )}
                <h3 className="editorial-card-title">{article.title}</h3>
                {article.excerpt && (
                  <p className="editorial-excerpt">{article.excerpt}</p>
                )}
                <span className="editorial-cta">
                  Read more <ArrowRight size={13} aria-hidden="true" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <style>{`
        .editorial-section { padding: 1rem 0; }
        .editorial-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 640px) { .editorial-grid { grid-template-columns: 1fr; } }

        .editorial-card {
          display: flex;
          flex-direction: column;
          border-radius: 14px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid rgba(10,22,40,0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          text-decoration: none;
          transition: transform 0.25s, border-color 0.25s;
        }
        .editorial-card:hover { transform: translateY(-4px); border-color: rgba(212,160,39,0.25); }
        .editorial-img-wrap { position: relative; width: 100%; padding-top: 55%; overflow: hidden; }
        .editorial-img { object-fit: cover; transition: transform 0.45s; }
        .editorial-card:hover .editorial-img { transform: scale(1.04); }
        .editorial-img-placeholder { position: absolute; inset: 0; background: #1a2a40; }

        .editorial-info { padding: 1rem 1.25rem 1.25rem; flex: 1; display: flex; flex-direction: column; }
        .editorial-date { font-size: 11px; color: rgba(10,22,40,0.5); margin-bottom: 6px; display: block; font-family: var(--font-inter), sans-serif; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .editorial-card-title { font-family: var(--font-serif), serif; font-size: 1.25rem; color: #0A1628; margin: 0 0 0.5rem; line-height: 1.35; }
        .editorial-excerpt { font-size: 13.5px; color: rgba(10,22,40,0.75); line-height: 1.65; margin: 0 0 1rem; font-family: var(--font-inter), sans-serif; font-weight: 400; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .editorial-cta { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: #C1440E; font-family: var(--font-inter), sans-serif; margin-top: auto; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>
    </section>
  );
}
