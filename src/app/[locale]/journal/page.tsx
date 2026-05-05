import { sanityClient, urlFor } from '@/lib/sanity';
import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Journal — CYouInGreece',
  description: 'Curated stories, travel essays, and insider guides from the people who live and breathe Greece.',
  openGraph: {
    title: 'Journal — CYouInGreece',
    description: 'Curated stories, travel essays, and insider guides.',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  travel_guide: 'Travel Guide',
  food: 'Gastronomy',
  culture: 'Culture',
  adventure: 'Adventure',
  practical: 'Practical',
  seasonal: 'Seasonal',
};

const CATEGORY_COLORS: Record<string, string> = {
  travel_guide: '#D4A027',
  food: '#C1440E',
  culture: '#4A7FA5',
  adventure: '#6B8F47',
  practical: '#8B7355',
  seasonal: '#9B6B9B',
};

async function getArticles() {
  return sanityClient.fetch(
    `*[_type == "article"] | order(published_at desc) {
      _id,
      title,
      slug,
      excerpt,
      hero_image { asset->{ _ref, url, metadata { lqip, dimensions } }, hotspot, crop },
      published_at,
      category,
      "author": author->name
    }`
  );
}

function ArticleCard({ article }: { article: any }) {
  const heroUrl = article.hero_image?.asset
    ? urlFor(article.hero_image).width(900).height(600).auto('format').url()
    : null;

  const catColor = CATEGORY_COLORS[article.category] || '#D4A027';
  const catLabel = CATEGORY_LABELS[article.category] || article.category;

  const pubDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <article className="group flex flex-col">
      <Link href={`/journal/${article.slug?.current}`} className="block relative overflow-hidden aspect-[3/2] mb-6 bg-[#0A1628]">
        <img
          src={heroUrl || 'https://images.unsplash.com/photo-1516483638261-f40af5bf2225?q=80&w=900&auto=format&fit=crop'}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Category badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em]"
          style={{ backgroundColor: catColor, color: '#030b15' }}
        >
          {catLabel}
        </div>
      </Link>

      <div className="flex flex-col flex-1">
        {pubDate && (
          <span className="text-[#D4A027]/70 text-[10px] tracking-[0.2em] uppercase mb-3">
            {pubDate}
          </span>
        )}
        <Link href={`/journal/${article.slug?.current}`}>
          <h2 className="font-serif text-[clamp(1.3rem,2vw,1.7rem)] text-white leading-[1.2] mb-4 group-hover:text-[#D4A027] transition-colors duration-300">
            {article.title}
          </h2>
        </Link>
        {article.excerpt && (
          <p className="text-white/60 font-light text-sm leading-relaxed mb-6 flex-1">
            {article.excerpt}
          </p>
        )}
        <Link
          href={`/journal/${article.slug?.current}`}
          className="inline-flex items-center gap-3 w-fit text-xs uppercase tracking-[0.2em] font-bold text-[#D4A027] hover:text-white transition-colors group/link"
        >
          Read Article
          <span className="w-6 h-px bg-[#D4A027] group-hover/link:w-10 group-hover/link:bg-white transition-all" />
        </Link>
      </div>
    </article>
  );
}

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-[#030b15] text-white">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 bg-[#0A1628] border-b border-white/5 overflow-hidden">
        {/* Decorative BG text */}
        <div className="absolute -right-10 top-10 text-[20vw] font-serif font-bold text-white/[0.025] select-none pointer-events-none leading-none whitespace-nowrap">
          Journal
        </div>
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10">
          <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-8">
            The Journal
          </span>
          <h1 className="text-[clamp(3rem,9vw,8rem)] font-serif font-light text-white leading-[0.9] mb-8">
            Stories from<br />
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A027] to-[#C1440E]">
              the Aegean.
            </em>
          </h1>
          <p className="font-serif italic text-xl text-white/60 max-w-2xl leading-relaxed">
            Travel essays, insider guides, and the stories you don't find in guidebooks.
            Written by people who actually live here.
          </p>
        </div>
      </section>

      {/* ── ARTICLES GRID ────────────────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
              {articles.map((article: any) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            /* Empty state — before articles are generated */
            <div className="text-center py-32">
              <p className="font-serif italic text-white/40 text-2xl mb-4">
                "The stories are being written..."
              </p>
              <p className="text-white/25 text-sm tracking-widest uppercase">
                Nikos is at his desk. Come back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── BACK ─────────────────────────────────────────────────────── */}
      <section className="py-16 text-center border-t border-white/5">
        <Link
          href="/"
          className="inline-block border border-[#D4A027] text-[#D4A027] px-10 py-4 uppercase tracking-[0.25em] text-xs hover:bg-[#D4A027] hover:text-[#030b15] transition-colors duration-500"
        >
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}
