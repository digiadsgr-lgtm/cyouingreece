import { sanityClient, urlFor } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function JourneyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const query = `*[_type == "journey" && slug.current == $slug][0]`;
  const journey = await sanityClient.fetch(query, { slug });

  if (!journey) {
    notFound();
  }

  return (
    <main className="bg-[#0A0A0A] min-h-screen text-white pt-32 pb-20">
      <article className="max-w-5xl mx-auto px-6">
        
        {/* Back button */}
        <Link href="/curated-journeys" className="inline-flex items-center text-xs uppercase tracking-widest text-[#D4A027] hover:text-yellow-400 mb-12 transition-colors">
          <span className="mr-2">←</span> Back to Journeys
        </Link>

        {/* Hero Section */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">{journey.duration_days} Days</span>
            <span className="w-1 h-1 rounded-full bg-[#D4A027]"></span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">{journey.islands_count} Islands</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-wide uppercase mb-8">{journey.title}</h1>
          <p className="text-xl text-white/70 max-w-3xl leading-relaxed font-light">{journey.summary}</p>
        </header>

        {/* Hero Image */}
        <div className="w-full h-[60vh] relative mb-20">
          <img 
            src={journey.hero_image?.asset ? urlFor(journey.hero_image).width(1600).height(900).url() : 'https://images.unsplash.com/photo-1516483638261-f40af5bf2225?q=80&w=1600&auto=format&fit=crop'} 
            alt={journey.title}
            className="absolute inset-0 w-full h-full object-cover rounded-none"
          />
        </div>

        {/* Itinerary Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-[#D4A027] tracking-wide uppercase mb-12 text-center">The Itinerary</h2>
          
          <div className="space-y-16">
            {journey.itinerary?.map((day: any) => (
              <div key={day._key} className="flex flex-col md:flex-row gap-6 md:gap-12 group">
                {/* Day indicator */}
                <div className="md:w-32 flex-shrink-0">
                  <div className="sticky top-32">
                    <span className="block text-5xl font-serif text-white/10 group-hover:text-[#D4A027]/40 transition-colors">
                      {day.day.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[#D4A027] font-semibold mt-2 block">Day</span>
                  </div>
                </div>

                {/* Day content */}
                <div className="flex-1 pb-16 border-b border-white/10 last:border-0">
                  <h3 className="text-2xl font-serif text-white mb-4">{day.location}</h3>
                  <p className="text-white/70 leading-relaxed font-light text-lg">
                    {day.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </article>
    </main>
  );
}
