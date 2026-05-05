import { sanityClient, urlFor } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60; // 1 min ISR

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_MAP: Record<string, { title: string; subtitle: string; description: string; image: string }> = {
  'destinations': {
    title: 'Destinations',
    subtitle: 'The Complete Archive',
    description: 'Explore the full spectrum of Greek destinations, from mythical islands to ancient cities.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Oia_sunset_-_panoramio_%282%29.jpg/3840px-Oia_sunset_-_panoramio_%282%29.jpg',
  },
  'mountain': {
    title: 'The Mountain',
    subtitle: 'High Altitudes & Ancient Trails',
    description: 'Discover the rugged spine of Greece. Gorges, alpine lakes, and stone villages hidden in the clouds.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Olympus_National_Park_30.jpg/3840px-Olympus_National_Park_30.jpg',
  },
  'sea': {
    title: 'The Sea',
    subtitle: 'The Azure Endless',
    description: 'The defining element of the Greek soul. Coastal retreats, hidden coves, and the endless Aegean blue.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/%CE%95%CE%BB%CE%B1%CF%86%CE%BF%CE%BD%CE%AE%CF%83%CE%B9_1287.jpg',
  },
  'culture': {
    title: 'Culture',
    subtitle: 'The Roots of the West',
    description: 'Walk through thousands of years of continuous history, mythology, and living traditions.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/1029_Acropolis_of_Athens_in_Greece_at_night_Photo_by_Giles_Laurent.jpg/3840px-1029_Acropolis_of_Athens_in_Greece_at_night_Photo_by_Giles_Laurent.jpg',
  },
  'gastronomy': {
    title: 'Gastronomy',
    subtitle: 'Taste the Landscape',
    description: 'The Mediterranean diet in its purest form. Ancient recipes, local wines, and the ritual of the Greek table.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Greece_Food_Horiatiki.JPG',
  }
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  if (!CATEGORY_MAP[slug]) {
    return notFound();
  }

  const categoryInfo = CATEGORY_MAP[slug];

  // Fetch articles that have this category tag
  const articlesQuery = `
    *[_type == "article" && category == $slug] | order(published_at desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      hero_image,
      published_at,
      "authorName": author->name
    }
  `;
  const articles = await sanityClient.fetch(articlesQuery, { slug });

  // Fetch destinations related to this category concept
  let destQuery = '';
  if (slug === 'destinations') {
    destQuery = `*[_type == "destination"][0...12] | order(_createdAt desc) { _id, name_en, "slug": slug.current, hero_image, tagline, type }`;
  } else if (slug === 'mountain') {
    destQuery = `*[_type == "destination" && type == "mountain"][0...12] { _id, name_en, "slug": slug.current, hero_image, tagline, type }`;
  } else if (slug === 'sea') {
    destQuery = `*[_type == "destination" && type in ["island", "beach", "peninsula"]][0...12] { _id, name_en, "slug": slug.current, hero_image, tagline, type }`;
  } else {
    // For Culture and Gastronomy, we just fetch high-profile destinations
    destQuery = `*[_type == "destination"][0...8] | order(_updatedAt desc) { _id, name_en, "slug": slug.current, hero_image, tagline, type }`;
  }
  
  const relatedDestinations = await sanityClient.fetch(destQuery);

  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={categoryInfo.image}
            alt={categoryInfo.title}
            className="w-full h-full object-cover origin-center category-hero-img"
            style={{ filter: 'brightness(0.6) saturate(1.1)' }}
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#F4F0EA] via-[#F4F0EA]/20 to-transparent" />
        <div className="absolute inset-0 z-[1] bg-black/10" />
        
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 pb-24 text-center">
          <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">
            {categoryInfo.subtitle}
          </span>
          <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-serif font-light text-[#0A1628] leading-[0.9] mb-6">
            {categoryInfo.title}
          </h1>
          <p className="font-serif italic text-xl text-[#0A1628]/80 max-w-2xl mx-auto">
            {categoryInfo.description}
          </p>
        </div>

        <style>{`
          @keyframes kenBurnsSlow {
            0% { transform: scale(1.1); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .category-hero-img {
            animation: kenBurnsSlow 4s ease-out forwards;
          }
        `}</style>
      </section>

      {/* ── ARTICLES GRID ────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#F4F0EA]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-[#070A0F]/10 pb-8">
            <div>
              <span className="text-[#B6A996] text-[10px] uppercase tracking-[0.2em] font-bold block mb-3">Editorial</span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#070A0F] font-light tracking-tight">The Journal</h2>
            </div>
            <span className="text-[#A43312] text-[11px] uppercase tracking-[0.15em] font-semibold mt-6 md:mt-0">{articles.length} Stories</span>
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {articles.map((article: any) => (
                <Link key={article._id} href={`/journal/${article.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden mb-8 bg-[#070A0F]/5 relative">
                    {article.hero_image?.asset && (
                      <img
                        src={urlFor(article.hero_image).width(800).height(1000).url()}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="text-2xl font-serif text-[#070A0F] font-light leading-[1.3] mb-4 group-hover:text-[#A43312] transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-[#070A0F]/60 text-[1.05rem] leading-[1.8] font-serif italic line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-6 w-8 h-[1px] bg-[#B6A996] group-hover:w-16 transition-all duration-500" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-dashed border-[#070A0F]/15">
              <p className="font-serif text-2xl text-[#070A0F]/40 italic font-light">The Editor is currently drafting stories for this section.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── RELATED DESTINATIONS ─────────────────────────────────────────── */}
      {relatedDestinations && relatedDestinations.length > 0 && (
        <section className="py-32 bg-[#070A0F]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <h2 className="text-3xl md:text-5xl font-serif text-[#F4F0EA] font-light tracking-tight mb-20 text-center">Featured Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedDestinations.map((dest: any) => (
                <Link key={dest._id} href={`/destination/${dest.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-black/40">
                  {dest.hero_image?.asset && (
                    <img
                      src={urlFor(dest.hero_image).width(600).height(800).url()}
                      alt={dest.name_en}
                      className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:opacity-70 filter saturate-50 group-hover:saturate-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F]/90 via-[#070A0F]/20 to-transparent" />
                  <div className="absolute inset-x-8 bottom-8 text-center transition-transform duration-700 transform group-hover:-translate-y-2">
                    <span className="text-[#B6A996] text-[10px] uppercase tracking-[0.2em] font-semibold block mb-3">{dest.type}</span>
                    <h3 className="text-2xl font-serif text-[#F4F0EA] font-light">{dest.name_en}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
