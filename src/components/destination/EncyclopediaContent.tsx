'use client';
import { PortableText } from '@portabletext/react';
import { destinationPortableTextComponents } from './PortableTextComponents';
import { ThematicSection } from '@/lib/destination-types';
import { urlFor } from '@/lib/sanity';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { ChevronRight, Bookmark, Map, History, Leaf, Utensils, Activity, Church, Landmark, Music, Sparkles } from 'lucide-react';

const icons: Record<string, any> = {
  History: History,
  Nature: Leaf,
  Culture: Sparkles,
  Gastronomy: Utensils,
  Activities: Activity,
  Churches: Church,
  Museums: Landmark,
  Entertainment: Music,
  Secrets: Bookmark
};

interface Props {
  sections: ThematicSection[];
  destinationName: string;
}

export default function EncyclopediaContent({ sections, destinationName }: Props) {
  const [activeId, setActiveId] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-36">
      {/* ── STICKY SIDE NAV ───────────────────────────────────────────── */}
      <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
        <div className="border-l border-[#070A0F]/10 pl-8 py-4">
          <span className="text-[#A43312] tracking-[0.4em] uppercase text-[10px] font-bold block mb-10">
            Encyclopedia Index
          </span>
          <nav className="space-y-6">
            {sections.map((sec) => {
              const Icon = icons[sec.category] || Bookmark;
              const isActive = activeId === `section-${sec._key}`;
              
              return (
                <button
                  key={sec._key}
                  onClick={() => scrollTo(`section-${sec._key}`)}
                  className={`group flex items-center gap-4 text-left transition-all duration-500 ${
                    isActive ? 'translate-x-2 text-[#070A0F]' : 'text-[#070A0F]/40 hover:text-[#070A0F]/70'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-[#070A0F] text-[#F4F0EA] shadow-xl scale-110' : 'bg-[#F4F0EA] border border-[#070A0F]/10'
                  }`}>
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] uppercase tracking-widest font-bold transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                      {sec.category}
                    </span>
                    <span className={`text-sm font-serif leading-tight transition-all duration-500 ${isActive ? 'font-medium' : 'font-normal'}`}>
                      {sec.title}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -left-[33px] w-1.5 h-1.5 rounded-full bg-[#A43312]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="lg:col-span-9 space-y-32 md:space-y-48">
        {sections.map((sec) => (
          <section
            key={sec._key}
            id={`section-${sec._key}`}
            ref={(el) => { sectionRefs.current[`section-${sec._key}`] = el; }}
            className="scroll-mt-32"
          >
            {/* Section Header */}
            <header className="mb-12 md:mb-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-[#A43312]/30" />
                <span className="text-[#A43312] tracking-[0.4em] uppercase text-[10px] font-bold">
                  {sec.category}
                </span>
              </div>
              <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-serif text-[#070A0F] leading-[1.1] mb-12">
                {sec.title}
              </h2>

              {/* Section Hero Image (If present) */}
              {sec.hero_image?.asset?._ref && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative aspect-[16/8] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-16"
                >
                  <img
                    src={urlFor(sec.hero_image).width(1200).height(600).auto('format').url()}
                    alt={sec.title}
                    className="w-full h-full object-cover"
                  />
                  {sec.hero_image.caption && (
                    <div className="absolute bottom-6 left-6 bg-[#F4F0EA]/90 backdrop-blur-md px-4 py-2 rounded-lg text-[11px] font-medium tracking-tight text-[#070A0F] shadow-sm">
                      {sec.hero_image.caption}
                    </div>
                  )}
                </motion.div>
              )}
            </header>

            {/* Section Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-8 lg:col-span-7">
                <div className="prose prose-lg max-w-none prose-p:font-serif prose-p:text-[#070A0F]/80 prose-p:leading-[1.8] prose-p:text-lg">
                  <PortableText
                    value={sec.content}
                    components={destinationPortableTextComponents}
                  />
                </div>
              </div>
              <div className="hidden md:block md:col-span-4 lg:col-span-5 relative">
                {/* Decorative element or secondary small photo could go here */}
                <div className="sticky top-48 border-l border-[#070A0F]/5 pl-10">
                   <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#070A0F]/30 mb-4">
                      Research Note
                   </p>
                   <p className="font-serif italic text-[#070A0F]/40 text-sm leading-relaxed">
                      Part of our exhaustive 2026 Golden Guide archive for {destinationName}. 
                      Verified by local historians and environmental researchers.
                   </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
