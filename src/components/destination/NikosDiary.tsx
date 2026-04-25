import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';

export default function NikosDiary({ entries }: { entries: any[] }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="space-y-24">
      {entries.map((entry: any) => {
        const imgUrl = entry.image?.asset?._ref 
          ? urlFor(entry.image).width(1200).height(800).url() 
          : null;

        return (
          <div key={entry._key} className="relative group bg-[#0A1628] overflow-hidden border border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Image Section */}
              <div className="relative h-[400px] lg:h-auto overflow-hidden">
                {imgUrl ? (
                  <img 
                    src={imgUrl} 
                    alt={entry.title} 
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.6] sepia-[0.2] group-hover:scale-105 transition-transform duration-[2000ms]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#030b15]" />
                )}
                <div className="absolute top-6 left-6 bg-[#D4A027] text-[#030b15] text-[10px] uppercase tracking-[0.3em] font-bold px-3 py-1 z-10">
                  Nikos' Diary
                </div>
                <div className="absolute bottom-6 left-6 text-white z-10 font-serif italic text-xl opacity-80">
                  {entry.location}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-16 flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-serif text-[#D4A027] mb-8 leading-tight">
                  {entry.title}
                </h3>
                
                <div className="text-white/70 font-light text-lg leading-relaxed mb-10 prose prose-invert max-w-none">
                  {entry.body && <PortableText value={entry.body} />}
                </div>

                {entry.verdict && (
                  <div className="mt-auto border-t border-white/10 pt-6">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">The Verdict</span>
                    <p className="font-serif italic text-white text-xl">"{entry.verdict}"</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
