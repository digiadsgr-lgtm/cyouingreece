'use client';
import { useEffect, useState } from 'react';
import { useUserHistory } from '@/lib/useUserHistory';
import { sanityClient, urlFor } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';

export default function PersonalizedFeed() {
  const { history, isLoaded, getTopInterest } = useUserHistory();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchPersonalized = async () => {
      const topInterest = getTopInterest();
      let query = '';
      
      if (topInterest) {
        // Fetch recommendations based on top interest, excluding already visited slugs
        query = `*[_type == "destination" && type == "${topInterest}" && !(slug.current in $slugs)][0...4] {
          _id, name_en, name_local, type, slug, tagline, hero_image
        }`;
      } else {
        // Fallback: Trending / Random destinations
        query = `*[_type == "destination"][0...4] {
          _id, name_en, name_local, type, slug, tagline, hero_image
        }`;
      }

      try {
        const data = await sanityClient.fetch(query, { slugs: history.slugs });
        setDestinations(data);
      } catch (e) {
        console.error('Failed to fetch personalized feed', e);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalized();
  }, [isLoaded, history]); // Only re-fetch if history fundamentally changes

  if (!isLoaded || loading) return null; // Or a subtle skeleton loader
  if (destinations.length === 0) return null;

  const topInterest = getTopInterest();
  const title = topInterest 
    ? `Because you love ${topInterest.replace('_', ' ')}s` 
    : 'Trending This Week';
  const subtitle = topInterest
    ? 'Tailored recommendations based on your recent reading history.'
    : 'The most popular destinations across the Aegean right now.';

  return (
    <section className="bg-[#FAF9F6] py-24 md:py-36 text-[#0A1628]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-16">
          <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">
            For You
          </span>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif leading-tight mb-4">
            {title}
          </h2>
          <p className="text-[1.1rem] text-gray-500 font-serif italic max-w-2xl">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest) => {
            const imgSrc = dest.hero_image?.asset?._ref 
              ? urlFor(dest.hero_image).width(600).height(800).url() 
              : null;

            return (
              <Link 
                href={`/destination/${dest.slug.current}`} 
                key={dest._id}
                className="group block relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg"
              >
                {imgSrc ? (
                  <Image 
                    src={imgSrc} 
                    alt={dest.name_en} 
                    fill 
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#0A1628]" />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-[#D4A027] text-[9px] uppercase tracking-widest font-bold mb-2">
                    {dest.type?.replace('_', ' ')}
                  </span>
                  <h3 className="text-white font-serif text-2xl mb-1">{dest.name_en}</h3>
                  {dest.tagline && (
                    <p className="text-white/70 text-sm font-serif italic line-clamp-2">
                      {dest.tagline}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
