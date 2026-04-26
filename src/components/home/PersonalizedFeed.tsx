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

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 20 } }
};

  return (
    <section className="bg-[#FAF9F6] py-24 md:py-36 text-[#0A1628] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">
            For You
          </span>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif leading-[1.1] mb-4">
            {title}
          </h2>
          <p className="text-[clamp(1rem,1.5vw,1.1rem)] text-[#0A1628]/60 font-serif italic max-w-2xl">
            {subtitle}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {destinations.map((dest) => {
            const imgSrc = dest.hero_image?.asset?._ref 
              ? urlFor(dest.hero_image).width(600).height(800).url() 
              : null;

            return (
              <motion.div variants={itemVariants} key={dest._id}>
                <Link 
                  href={`/destination/${dest.slug.current}`} 
                  className="group block relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500 bg-[#e0dad2]"
                >
                  {imgSrc ? (
                    <Image 
                      src={imgSrc} 
                      alt={dest.name_en} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#0A1628]" />
                  )}
                  
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 border border-white/10 rounded-2xl z-20 pointer-events-none" />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030b15]/90 via-[#030b15]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20 transform transition-transform duration-500 group-hover:-translate-y-2">
                    <span className="text-[#D4A027] text-[10px] uppercase tracking-[0.25em] font-bold mb-3 block transform transition-transform duration-500 group-hover:translate-x-2">
                      {dest.type?.replace('_', ' ') || 'Destination'}
                    </span>
                    <h3 className="text-[#FAF9F6] font-serif text-3xl md:text-2xl lg:text-3xl mb-2">{dest.name_en}</h3>
                    {dest.tagline && (
                      <p className="text-[#FAF9F6]/70 text-[13px] md:text-sm font-serif italic line-clamp-2 transform opacity-80 transition-all duration-500 group-hover:opacity-100">
                        {dest.tagline}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
