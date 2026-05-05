'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Compass, MapPin, Wind } from 'lucide-react';

interface Props {
  destinations: any[];
}

const fallbackMessages = [
  "Greece is not a destination. It's a feeling.",
  "Every island has a secret. We know them all.",
  "Authentic Aegean. Curated by locals.",
  "Discover the Greece you were never told about."
];

const personas: Record<string, any> = {
  island: {
    badge: "Island Hopper",
    headline: "The salt on your skin is the only souvenir you need.",
    sub: "Based on your interest in the Cyclades, we've unlocked these hidden coves.",
    fallback: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1920&auto=format&fit=crop",
    cords: "36.3932° N, 25.4615° E",
    temp: "24°C, Etesian Winds"
  },
  city: {
    badge: "Urban Explorer",
    headline: "Athens is a concrete forest with an ancient heart.",
    sub: "Since you've been researching urban life, here is the secret pulse of the city.",
    fallback: "https://images.unsplash.com/photo-1513807016779-d51c0c02ba2b?q=80&w=1920&auto=format&fit=crop",
    cords: "37.9838° N, 23.7275° E",
    temp: "28°C, Clear Skies"
  },
  mountain: {
    badge: "Mountain Soul",
    headline: "The peaks of Epirus are where the gods still hide.",
    sub: "You seek the high altitudes. Here is the true soul of the mainland.",
    fallback: "https://images.unsplash.com/photo-1549137706-686733222944?q=80&w=1920&auto=format&fit=crop",
    cords: "39.9500° N, 20.8000° E",
    temp: "16°C, Crisp Air"
  }
};

export default function SmartHero({ destinations }: Props) {
  const [persona, setPersona] = useState<any>(null);
  const [headlineIdx, setHeadlineIdx] = useState(0);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('cyouingreece_history') || '[]');
    if (history.length > 0) {
      const lastType = history[0].type;
      if (personas[lastType]) {
        setPersona(personas[lastType]);
      }
    }

    const interval = setInterval(() => {
      setHeadlineIdx(prev => (prev + 1) % fallbackMessages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const activePersona = persona || personas.island;

  return (
    <section className="relative h-screen w-full flex flex-col justify-end overflow-hidden bg-[#0A1628] select-none">
      {/* Background with CSS Ken Burns Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          key={activePersona.badge}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src={activePersona.fallback} 
            className="w-full h-full object-cover origin-center" 
            alt="Greece Landscape" 
          />
        </motion.div>
      </div>

      {/* Elegant Gradients to ensure text readability without darkening the whole image */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 z-[1] bg-black/10" />
      
      {/* Travel Metadata (Top Right) */}
      <div className="absolute top-32 right-12 z-20 hidden md:flex flex-col items-end gap-2 text-white/70 font-mono text-xs uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#D4A027]" />
          <span>{activePersona.cords}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-[#D4A027]" />
          <span>{activePersona.temp}</span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Compass size={14} className="text-white/40" />
          <span className="text-white/40">Live Feed Active</span>
        </div>
      </div>

      {/* Main Content (Bottom Left) */}
      <div className="relative z-10 w-full px-6 md:px-12 pb-32 max-w-[1600px] mx-auto">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            {persona ? (
              <motion.div
                key="personalized"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-px bg-[#D4A027]" />
                  <span className="text-[#D4A027] text-[10px] font-black uppercase tracking-[0.4em]">
                    {persona.badge}
                  </span>
                </div>
                <h1 className="text-[clamp(2.5rem,6vw,6rem)] font-serif font-light text-white leading-[1.1] mb-6 tracking-tight drop-shadow-lg">
                   {persona.headline}
                </h1>
                <p className="text-white/70 font-serif italic text-xl md:text-2xl max-w-2xl leading-relaxed mb-10 border-l border-white/20 pl-6">
                   "{persona.sub}"
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                 <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-px bg-[#D4A027]" />
                  <span className="text-[#D4A027] text-[10px] font-black uppercase tracking-[0.4em]">
                    The Golden Guide
                  </span>
                </div>
                
                <div className="relative h-[120px] md:h-[180px] flex items-end">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={headlineIdx}
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(10px)" }}
                      transition={{ duration: 1.5 }}
                      className="text-[clamp(2.5rem,6vw,6rem)] font-serif font-light text-white leading-[1.1] tracking-tight absolute bottom-0 drop-shadow-lg max-w-3xl"
                    >
                      {fallbackMessages[headlineIdx]}
                    </motion.h1>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-8 mt-4">
            <Link href="/encyclopaedia" className="group relative px-10 py-5 bg-[#D4A027] text-[#0A1628] text-[11px] font-bold tracking-[0.4em] uppercase overflow-hidden transition-all hover:scale-105">
              <span className="relative z-10">Start Exploring</span>
            </Link>
            
            <button className="group flex items-center gap-4 text-white text-[11px] font-bold tracking-[0.4em] uppercase hover:text-[#D4A027] transition-colors">
              <span className="w-12 h-px bg-white/30 group-hover:bg-[#D4A027] transition-colors" />
              The Manifesto
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Bottom Ticker */}
      <div className="absolute bottom-0 left-0 w-full z-20 py-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8 items-center overflow-x-auto w-full md:w-auto no-scrollbar">
            <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4A027] font-black shrink-0">Featured Destinations</span>
            {destinations.slice(0, 5).map((d) => (
              <Link key={d._id} href={`/destination/${d.slug.current}`} className="group flex shrink-0">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                  {d.name_en}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="w-[1px] h-8 bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Scroll to dive in</span>
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-px h-6 bg-white/60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}









