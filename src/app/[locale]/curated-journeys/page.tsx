import { sanityClient, urlFor } from '@/lib/sanity';
import { Link } from '@/i18n/routing';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function CuratedJourneys() {
  const journeys = await sanityClient.fetch(`*[_type == "journey"] | order(duration_days desc)`);

  return (
    <main className="bg-[#0A0A0A] min-h-screen">

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase mb-4">Curated Journeys</h1>
          <p className="text-white/60 max-w-2xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
            Meticulously designed itineraries that bypass the crowds and embrace the authentic soul of Greece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {journeys.map((journey: any) => (
            <Link key={journey._id} href={`/curated-journeys/${journey.slug.current}`} className="group relative overflow-hidden h-[600px] border border-white/10 block">
              <img 
                src={journey.hero_image?.asset ? urlFor(journey.hero_image).width(1200).height(1600).url() : 'https://images.unsplash.com/photo-1516483638261-f40af5bf2225?q=80&w=1200&auto=format&fit=crop'} 
                alt={journey.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
                <span className="text-brand-golden uppercase tracking-[0.3em] text-[10px] font-bold mb-2">
                  {journey.duration_days} Days {journey.islands_count > 0 ? `• ${journey.islands_count} Islands` : ''}
                </span>
                <h2 className="text-3xl font-serif text-white tracking-wide uppercase mb-4">{journey.title}</h2>
                <p className="text-white/80 text-sm leading-relaxed max-w-md line-clamp-3">
                  {journey.summary}
                </p>
                
                {/* Decorative Line & Button */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-brand-golden/50 transition-all duration-500 group-hover:w-24"></div>
                  <span className="text-xs uppercase tracking-[0.2em] text-white font-light opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    View Itinerary
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
