import { sanityClient, urlFor } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import AdSlot from '@/components/monetization/AdSlot';
import BookingWidget from '@/components/monetization/BookingWidget';
import AffiliateLinkBar from '@/components/monetization/AffiliateLinks';
import HotelWidget from '@/components/monetization/HotelWidget';
import { articleJsonLd, breadcrumbJsonLd, JsonLdScript } from '@/lib/jsonld';

import { routing } from '@/i18n/routing';

export const revalidate = 3600;

const IMAGE_PROJECTION = `{
  asset->{ _ref, url, metadata { lqip, dimensions } },
  hotspot, crop, caption, credit
}`;

async function getArticle(slug: string) {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id, title, slug, excerpt, body, published_at, category, translations,
      hero_image ${IMAGE_PROJECTION},
      "author": author->name,
      related_destinations[]->{
        _id, name_en, slug, hero_image ${IMAGE_PROJECTION}, tagline, type, translations
      }
    }`,
    { slug }
  );
}

async function getNextPrevArticles(slug: string, category?: string) {
  // Get all articles ordered by date, return prev/next relative to current
  const all = await sanityClient.fetch(
    `*[_type == "article"] | order(published_at desc) { _id, title, slug, category, excerpt, hero_image ${IMAGE_PROJECTION} }`
  );
  const idx = all.findIndex((a: any) => a.slug?.current === slug);
  return {
    next: idx > 0 ? all[idx - 1] : all[all.length - 1],       // wrap around
    prev: idx < all.length - 1 ? all[idx + 1] : all[0],
    // Also get 3 articles from same category
    related: all.filter((a: any) => a.slug?.current !== slug && a.category === category).slice(0, 3),
  };
}

export async function generateStaticParams() {
  const articles = await sanityClient.fetch(`*[_type == "article" && defined(slug.current)]{ "slug": slug.current }`);
  return routing.locales.flatMap((locale) =>
    articles.map((a: any) => ({ locale, slug: a.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article Not Found' };
  
  const localized = getLocalizedContent(article, locale);
  const title = localized.title || article.title;
  const excerpt = localized.excerpt || article.excerpt || '';

  return {
    title: `${title} — CYouInGreece Journal`,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      images: article.hero_image?.asset?._ref ? [urlFor(article.hero_image).width(1200).height(630).url()] : [],
    },
  };
}

const CAT_LABELS: Record<string, string> = {
  sea: 'Sea & Islands', mountain: 'Mountain', culture: 'Culture', gastronomy: 'Gastronomy',
  travel_guide: 'Travel Guide', food: 'Food', adventure: 'Adventure', practical: 'Practical',
};

const CAT_COLORS: Record<string, string> = {
  sea: '#4A7FA5', mountain: '#6B8F47', culture: '#8B6B47', gastronomy: '#C1440E',
};

// Portable text renderer — injects ad slots between paragraphs
function buildComponents(articleTitle: string) {
  return {
    types: {
      image: ({ value }: any) => {
        const imgUrl = value?.asset?._ref ? urlFor(value).auto('format').url() : null;
        if (!imgUrl) return null;
        return (
          <figure className="my-14 mx-auto">
            <img src={imgUrl} alt={value.caption || 'Article photo'} className="w-full h-auto rounded-xl object-cover shadow-2xl" />
            {(value.caption || value.credit) && (
              <figcaption className="text-center text-white/40 text-sm mt-4 font-serif italic">
                {value.caption} {value.credit && <span>— Photo: {value.credit}</span>}
              </figcaption>
            )}
          </figure>
        );
      },
      widget_ad: () => (
        <div className="my-14 mx-auto max-w-sm">
          <AdSlot format="rectangle" slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MID} />
        </div>
      ),
    },
    block: {
      h2: ({ children }: any) => (
        <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-serif text-white mt-16 mb-6 leading-tight border-l-4 border-[#D4A027] pl-6">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-serif text-[#D4A027] mt-10 mb-4">{children}</h3>
      ),
      normal: ({ children }: any) => {
        return <p className="text-white/80 font-light text-lg leading-[1.9] mb-7 font-serif">{children}</p>;
      },
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-[3px] border-[#D4A027] pl-8 my-12 font-serif italic text-2xl text-white/70 leading-relaxed">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong className="text-white font-semibold">{children}</strong>,
      em: ({ children }: any) => <em className="text-[#D4A027] not-italic">{children}</em>,
      link: ({ children, value }: any) => (
        <a href={value.href} className="text-[#D4A027] hover:text-white underline transition-colors" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
    },
  };
}

function NextArticleCard({ article, label }: { article: any; label: string }) {
  const imgUrl = article.hero_image?.asset?._ref
    ? urlFor(article.hero_image).width(800).height(400).auto('format').url()
    : null;
  const catColor = CAT_COLORS[article.category] || '#D4A027';

  return (
    <Link href={`/journal/${article.slug?.current}`} className="group flex-1 block relative overflow-hidden min-h-[260px] md:min-h-[320px] bg-[#0A1628]">
      {imgUrl && (
        <img
          src={imgUrl}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-105"
          style={{ filter: 'brightness(0.35) saturate(1.1)' }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030b15]/95 via-[#030b15]/30 to-transparent" />
      <div className="relative z-10 flex flex-col h-full justify-end p-8">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3" style={{ color: catColor }}>
          {label}
        </span>
        {article.category && (
          <span className="text-[9px] uppercase tracking-widest text-white/40 mb-2">{CAT_LABELS[article.category] || article.category}</span>
        )}
        <h3 className="font-serif text-white text-[clamp(1.1rem,2vw,1.6rem)] leading-tight group-hover:text-[#D4A027] transition-colors duration-300">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-white/50 text-sm font-light leading-relaxed mt-3 line-clamp-2 hidden md:block">{article.excerpt}</p>
        )}
        <span className="inline-flex items-center gap-2 mt-5 text-[10px] uppercase tracking-[0.2em] text-[#D4A027] font-bold">
          Read <span className="w-6 h-px bg-[#D4A027] group-hover:w-10 transition-all duration-500" />
        </span>
      </div>
    </Link>
  );
}

import { getLocalizedContent } from '@/lib/i18n-utils';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const [article, { next, prev, related }] = await Promise.all([
    getArticle(slug),
    getNextPrevArticles(slug),
  ]);
  if (!article) return notFound();

  const localized = getLocalizedContent(article, locale);

  const heroUrl = article.hero_image?.asset?._ref
    ? urlFor(article.hero_image).width(1920).height(1080).auto('format').url()
    : 'https://images.unsplash.com/photo-1516483638261-f40af5bf2225?q=80&w=2000&auto=format&fit=crop';

  const pubDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const catColor = CAT_COLORS[article.category] || '#D4A027';
  const catLabel = CAT_LABELS[article.category] || article.category;

  const bodyContent = localized.body || article.body || [];
  
  // --- SMART CONTENT INJECTOR ---
  const processedBlocks: unknown[] = [];
  let paragraphCount = 0;

  if (Array.isArray(bodyContent)) {
    bodyContent.forEach((block: any) => {
      processedBlocks.push(block);
      
      if (block._type === 'block' && block.style === 'normal') {
        paragraphCount++;
        
        // AdSense after paragraph 3
        if (paragraphCount === 3) {
          processedBlocks.push({ _type: 'widget_ad', _key: `injected-ad-${paragraphCount}` });
        }
        // AdSense after paragraph 6
        if (paragraphCount === 6) {
          processedBlocks.push({ _type: 'widget_ad', _key: `injected-ad-${paragraphCount}` });
        }
        // AdSense after paragraph 9
        if (paragraphCount === 9) {
          processedBlocks.push({ _type: 'widget_ad', _key: `injected-ad-${paragraphCount}` });
        }
      }
    });
  }

  const wordCount = bodyContent
    .filter((b: any) => b._type === 'block')
    .flatMap((b: any) => b.children || [])
    .map((s: any) => s.text || '')
    .join(' ').split(/\s+/).length;
  const readTime = Math.max(3, Math.ceil(wordCount / 200));

  return (
    <main className="bg-[#030b15] min-h-screen text-white">
      {/* JSON-LD */}
      <JsonLdScript data={articleJsonLd({ ...article, published_at: article.published_at, hero_image: article.hero_image })} />
      <JsonLdScript data={breadcrumbJsonLd([
        { name: 'Home', url: 'https://cyouingreece.com' },
        { name: 'Journal', url: 'https://cyouingreece.com/journal' },
        { name: article.title, url: `https://cyouingreece.com/journal/${slug}` },
      ])} />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroUrl || 'https://images.unsplash.com/photo-1516483638261-f40af5bf2225?q=80&w=1920&auto=format&fit=crop'}
            alt={article.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) saturate(1.2)' }}
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#030b15] via-[#030b15]/10 to-transparent" />

        {/* Top bar: breadcrumb */}
        <div className="absolute top-8 left-0 right-0 z-10">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/30">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-white transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-white/50">{catLabel}</span>
          </div>
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-12 pb-16 w-full">
          {/* Category + meta */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.3em] px-4 py-1.5"
              style={{ backgroundColor: catColor, color: catColor === '#D4A027' ? '#030b15' : 'white' }}
            >
              {catLabel}
            </span>
            {pubDate && <span className="text-white/40 text-[10px] tracking-widest uppercase">{pubDate}</span>}
            <span className="text-white/30 text-[10px] tracking-widest uppercase">{readTime} min read</span>
          </div>

          <h1 className="font-serif text-[clamp(2rem,6vw,4.5rem)] text-white leading-[1.05] mb-6"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.9)' }}>
            {localized.title}
          </h1>

          {localized.excerpt && (
            <p className="font-serif italic text-white/60 text-xl leading-relaxed max-w-2xl border-l-2 pl-6" style={{ borderColor: catColor }}>
              {localized.excerpt}
            </p>
          )}

          <div className="flex items-center gap-6 mt-8">
            <div className="w-8 h-8 rounded-full bg-[#D4A027]/20 border border-[#D4A027]/30 flex items-center justify-center">
              <span className="font-serif text-[#D4A027] text-xs font-bold">Ν</span>
            </div>
            <span className="text-[#D4A027] text-[10px] tracking-widest uppercase font-bold">
              {article.author || 'Nikos — CYouInGreece'}
            </span>
          </div>
        </div>
      </section>

      {/* ── PRE-ARTICLE AD SLOT ───────────────────────────────────── */}
      <div className="bg-[#030b15] py-6 border-b border-white/5">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <AdSlot format="horizontal" slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP} />
        </div>
      </div>

      {/* ── ARTICLE BODY ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-[760px] mx-auto px-6 md:px-12">
          {processedBlocks && processedBlocks.length > 0 ? (
            <PortableText value={processedBlocks as any} components={buildComponents(localized.title)} />
          ) : (
            <p className="font-serif italic text-white/40 text-xl text-center py-20">
              Full article coming soon...
            </p>
          )}
        </div>
      </section>

      {/* ── BOOKING CTA (Affiliate placeholder) ───────────────────── */}
      {article.related_destinations && article.related_destinations.length > 0 && (
        <section className="py-12 border-t border-white/5">
          <div className="max-w-[760px] mx-auto px-6 md:px-12">
            <BookingWidget destination={`${article.related_destinations[0].name_en}, Greece`} />
          </div>
        </section>
      )}

      {/* ── RELATED DESTINATIONS ──────────────────────────────────── */}
      {article.related_destinations && article.related_destinations.length > 0 && (
        <section className="py-20 bg-[#0A1628] border-t border-white/5">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12">
            <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">Mentioned in this article</span>
            <h2 className="text-3xl font-serif text-white mb-12">Explore the Destination</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {article.related_destinations.map((dest: any) => {
                const imgUrl = dest.hero_image?.asset?._ref ? urlFor(dest.hero_image).width(600).height(400).url() : null;
                const locDest = getLocalizedContent(dest, locale);
                return (
                  <Link key={dest._id} href={`/destination/${dest.slug?.current}`} className="group block relative overflow-hidden aspect-[4/3] bg-[#030b15]">
                    {imgUrl && (
                      <img src={imgUrl} alt={dest.name_en} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 brightness-[0.55]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030b15]/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="font-serif text-white text-2xl group-hover:text-[#D4A027] transition-colors">{dest.name_en}</h3>
                      {locDest.tagline && <p className="text-white/50 text-sm italic mt-1 font-serif">"{locDest.tagline}"</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BOTTOM AD SLOT ────────────────────────────────────────── */}
      <div className="bg-[#030b15] py-8 border-t border-white/5">
        <div className="max-w-[760px] mx-auto px-6 md:px-12">
          <AdSlot format="rectangle" slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM} />
        </div>
      </div>

      {/* ── CONTINUE READING: PREV / NEXT ─────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0A1628]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px]">
            {prev && <NextArticleCard article={prev} label="← Previous Article" />}
            {next && <NextArticleCard article={next} label="Next Article →" />}
          </div>
        </div>
      </section>

      {/* ── MORE FROM THIS CATEGORY ───────────────────────────────── */}
      {related && related.length > 0 && (
        <section className="bg-[#030b15] py-24 border-t border-white/5">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: catColor }}>
              More {catLabel}
            </span>
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-serif text-white mb-12">Keep Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((art: any) => {
                const imgUrl = art.hero_image?.asset?._ref ? urlFor(art.hero_image).width(600).height(400).url() : null;
                return (
                  <Link key={art._id} href={`/journal/${art.slug?.current}`} className="group flex flex-col">
                    <div className="relative overflow-hidden aspect-[4/3] mb-5 bg-[#0A1628]">
                      {imgUrl && (
                        <img src={imgUrl} alt={art.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 brightness-75" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="font-serif text-white text-xl leading-tight group-hover:text-[#D4A027] transition-colors duration-300">{art.title}</h3>
                    {art.excerpt && <p className="text-white/40 text-sm font-light leading-relaxed mt-3 line-clamp-2">{art.excerpt}</p>}
                    <span className="inline-flex items-center gap-2 mt-4 text-[10px] uppercase tracking-widest font-bold text-white/30 group-hover:text-[#D4A027] transition-colors">
                      Read <span className="w-4 h-px bg-current group-hover:w-8 transition-all" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BACK TO JOURNAL ───────────────────────────────────────── */}
      <section className="py-16 text-center border-t border-white/5 bg-[#030b15]">
        <Link
          href="/journal"
          className="inline-block border border-white/20 text-white/50 px-10 py-4 uppercase tracking-[0.25em] text-xs hover:border-[#D4A027] hover:text-[#D4A027] transition-colors duration-500"
        >
          ← Back to Journal
        </Link>
      </section>
    </main>
  );
}
