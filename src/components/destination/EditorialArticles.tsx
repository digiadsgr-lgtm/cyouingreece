import Image from 'next/image';
import type { EditorialArticle } from '@/lib/destination-types';
import { urlFor } from '@/lib/sanity';
import { ArrowRight } from 'lucide-react';

interface Props {
  articles: EditorialArticle[];
  locale: string;
}

export default function EditorialArticles({ articles, locale }: Props) {
  if (!articles?.length) return null;

  return (
    <section className="editorial-section" aria-labelledby="editorial-heading">
      <h2 id="editorial-heading" className="editorial-title">From Our Writers</h2>

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
              href={`/${locale}/articles/${article.slug.current}`}
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
        .editorial-section { padding: 3rem 0; }
        .editorial-title { font-family: var(--font-serif), serif; font-size: clamp(1.5rem, 3vw, 2rem); color: #FAF9F6; margin: 0 0 1.5rem; }

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
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          transition: transform 0.25s, border-color 0.25s;
        }
        .editorial-card:hover { transform: translateY(-4px); border-color: rgba(212,160,39,0.25); }
        .editorial-img-wrap { position: relative; width: 100%; padding-top: 55%; overflow: hidden; }
        .editorial-img { object-fit: cover; transition: transform 0.45s; }
        .editorial-card:hover .editorial-img { transform: scale(1.04); }
        .editorial-img-placeholder { position: absolute; inset: 0; background: #1a2a40; }

        .editorial-info { padding: 1rem 1.25rem 1.25rem; flex: 1; display: flex; flex-direction: column; }
        .editorial-date { font-size: 11px; color: rgba(255,255,255,0.35); margin-bottom: 6px; display: block; font-family: var(--font-inter), sans-serif; }
        .editorial-card-title { font-family: var(--font-serif), serif; font-size: 1.1rem; color: #FAF9F6; margin: 0 0 0.5rem; line-height: 1.35; }
        .editorial-excerpt { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.65; margin: 0 0 0.75rem; font-family: var(--font-inter), sans-serif; font-weight: 300; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .editorial-cta { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #D4A027; font-family: var(--font-inter), sans-serif; margin-top: auto; }
      `}</style>
    </section>
  );
}
