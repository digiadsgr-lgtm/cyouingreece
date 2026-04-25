

import { sanityClient, urlFor } from '@/lib/sanity';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Encyclopaedia() {
  const destinations = await sanityClient.fetch(`*[_type == "destination"] | order(name_en asc)`);

  return (
    <main className="bg-[#0A0A0A] min-h-screen">

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase mb-4">The Encyclopaedia</h1>
          <p className="text-white/60 max-w-2xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
            Our exhaustive, constantly updated directory of the Greek islands and mainland. No cliches. Just local knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((dest: any) => (
            <Link key={dest._id} href={`/destination/${dest.slug.current}`} className="group relative h-80 overflow-hidden border border-white/10 block">
              {dest.hero_image?.asset ? (
                <img 
                  src={urlFor(dest.hero_image).width(600).height(800).url()} 
                  alt={dest.name_en} 
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-[#0A0A0A] border border-white/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-brand-golden uppercase tracking-[0.2em] text-[9px] mb-1 font-bold">{dest.type}</span>
                <h3 className="text-white font-serif text-xl tracking-widest uppercase">{dest.name_en}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
