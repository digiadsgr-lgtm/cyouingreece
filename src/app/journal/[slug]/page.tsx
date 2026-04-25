import { sanityClient, urlFor } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

export const revalidate = 3600;

const IMAGE_PROJECTION = `{
  asset->{ _ref, url, metadata { lqip, dimensions } },
  hotspot,
  crop,
  caption,
  credit
}`;

async function getArticle(slug: string) {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body,
      hero_image ${IMAGE_PROJECTION},
      published_at,
      category,
      "author": author->name,
      related_destinations[]-> {
        _id,
        name_en,
        slug,
        hero_image ${IMAGE_PROJECTION},
        tagline,
        type
      }
    }`,
    { slug }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} — CYouInGreece Journal`,
    description: article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.hero_image?.asset?._ref
        ? [urlFor(article.hero_image).width(1200).height(630).url()]
        : [],
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  travel_guide: 'Travel Guide',
  food: 'Gastronomy',
  culture: 'Culture',
  adventure: 'Adventure',
  practical: 'Practical',
  seasonal: 'Seasonal',
};

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const imageUrl = value?.asset?._ref
        ? urlFor(value).width(1200).auto('format').url()
        : null;
      if (!imageUrl) return null;
      return (
        <figure className="my-12">
          <img
            src={imageUrl}
            alt={value.caption || ''}
            className="w-full rounded-sm"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-white/40 italic mt-4">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-serif text-white mt-14 mb-6 leading-tight">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-serif text-[#D4A027] mt-10 mb-4">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-white/80 font-light text-lg leading-[1.85] mb-6">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-[#D4A027] pl-8 my-10 font-serif italic text-xl text-white/70 leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="text-[#D4A027] not-italic">{children}</em>,
    link: ({ children, value }: any) => (
      <a href={value.href} className="text-[#D4A027] hover:text-white underline transition-colors">
        {children}
      </a>
    ),
  },
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return notFound();

  const heroUrl = article.hero_image?.asset?._ref
    ? urlFor(article.hero_image).width(1920).height(1080).auto('format').url()
    : null;

  const pubDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <main className="bg-[#030b15] min-h-screen text-white">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] flex flex-col justify-end overflow-hidden">
        {heroUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={heroUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.35) saturate(1.1)' }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1628] to-[#030b15]" />
        )}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#030b15] via-[#030b15]/20 to-transparent" />

        <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-12 pb-16 w-full">
          <div className="flex items-center gap-4 mb-6">
            {article.category && (
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] bg-[#D4A027] text-[#030b15] px-3 py-1">
                {CATEGORY_LABELS[article.category] || article.category}
              </span>
            )}
            {pubDate && (
              <span className="text-white/40 text-[10px] tracking-widest uppercase">
                {pubDate}
              </span>
            )}
          </div>
          <h1 className="font-serif text-[clamp(2rem,6vw,4.5rem)] text-white leading-[1.05] mb-4"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.8)' }}>
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="font-serif italic text-white/60 text-xl leading-relaxed max-w-2xl">
              {article.excerpt}
            </p>
          )}
          {article.author && (
            <p className="text-[#D4A027] text-sm mt-6 tracking-widest uppercase text-[10px]">
              By {article.author}
            </p>
          )}
        </div>
      </section>

      {/* ── ARTICLE BODY ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          {article.body && article.body.length > 0 ? (
            <PortableText value={article.body} components={portableTextComponents} />
          ) : (
            <p className="font-serif italic text-white/40 text-xl text-center py-20">
              Full article coming soon...
            </p>
          )}
        </div>
      </section>

      {/* ── RELATED DESTINATIONS ─────────────────────────────────────── */}
      {article.related_destinations && article.related_destinations.length > 0 && (
        <section className="py-24 bg-[#0A1628] border-t border-white/5">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">
              Mentioned In This Story
            </span>
            <h2 className="text-3xl font-serif text-white mb-14">Related Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {article.related_destinations.map((dest: any) => {
                const imgUrl = dest.hero_image?.asset?._ref
                  ? urlFor(dest.hero_image).width(600).height(400).url()
                  : null;
                return (
                  <Link
                    key={dest._id}
                    href={`/destination/${dest.slug?.current}`}
                    className="group block relative overflow-hidden aspect-[3/2] bg-[#030b15]"
                  >
                    {imgUrl && (
                      <img
                        src={imgUrl}
                        alt={dest.name_en}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                        style={{ filter: 'brightness(0.55)' }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030b15]/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="font-serif text-white text-2xl group-hover:text-[#D4A027] transition-colors">
                        {dest.name_en}
                      </h3>
                      {dest.tagline && (
                        <p className="text-white/50 text-sm italic mt-1 font-serif">"{dest.tagline}"</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BACK ─────────────────────────────────────────────────────── */}
      <section className="py-16 text-center border-t border-white/5">
        <Link
          href="/journal"
          className="inline-block border border-[#D4A027] text-[#D4A027] px-10 py-4 uppercase tracking-[0.25em] text-xs hover:bg-[#D4A027] hover:text-[#030b15] transition-colors duration-500"
        >
          ← Back to Journal
        </Link>
      </section>
    </main>
  );
}
