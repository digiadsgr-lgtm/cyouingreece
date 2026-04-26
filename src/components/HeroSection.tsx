'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=85&w=2400&auto=format&fit=crop',
    caption: 'Santorini, Cyclades',
  },
  {
    url: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=85&w=2400&auto=format&fit=crop',
    caption: 'Athens, Attica',
  },
  {
    url: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=85&w=2400&auto=format&fit=crop',
    caption: 'Crete, South Aegean',
  },
];
import { AnimatePresence, motion } from 'framer-motion';

const HEADLINES = [
  "Discover the Authentic.",
  "Beyond the Guidebooks.",
  "The Real Aegean.",
  "Where Locals Hide."
];

function HeroContent({ currentSlide }: { currentSlide: number }) {
  const headline = HEADLINES[currentSlide % HEADLINES.length];

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none select-none">
      {/* Gradient overlay: bottom-heavy for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030b15] via-[#030b15]/50 to-transparent" />
      {/* Subtle top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030b15]/30 to-transparent" />

      <div className="max-w-[1320px] mx-auto w-full px-6 md:px-16 pb-20 md:pb-32 relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px w-10 bg-[#D4A027]" />
          <span className="text-[#D4A027] text-[11px] tracking-[0.45em] uppercase font-semibold">
            C You In Greece
          </span>
        </div>

        {/* Main headline - Rotating */}
        <div className="h-[200px] md:h-[220px] lg:h-[200px] mb-6 md:mb-8 relative flex items-end">
          <AnimatePresence mode="wait">
            <motion.h1
              key={headline}
              initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[clamp(2.75rem,10vw,7rem)] font-serif font-light text-white leading-[1] absolute bottom-0 left-0 w-full"
              style={{ textShadow: '0 4px 60px rgba(0,0,0,0.7)' }}
            >
              <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A027] to-[#FAF9F6]">
                {headline.split('.')[0]}
              </em>
              <span className="text-[#C1440E]">.</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Nikos Quote */}
        <p
          className="font-serif italic text-[clamp(1rem,3.5vw,1.4rem)] text-white/80 max-w-2xl leading-relaxed mb-8 md:mb-10"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          "Turn left at the blue door, past the bakery that opens at 5am.
          There is a table with a view that will change you."
          <span className="not-italic block md:inline text-[#D4A027] text-xs mt-2 md:mt-0 md:ml-3 tracking-widest">— The Diary of Nikos</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col md:flex-row gap-5 pointer-events-auto items-start md:items-center">
          <a
            href="#destinations"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A027] text-[#030b15] text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all duration-300"
          >
            Explore The Encyclopaedia
          </a>
          <Link
            href="/curated-journeys"
            className="text-xs tracking-[0.2em] uppercase text-white/70 border-b border-white/30 pb-1 hover:text-[#D4A027] hover:border-[#D4A027] transition-all duration-300"
          >
            Curated Journeys →
          </Link>
        </div>

        {/* Slide caption */}
        <div className="absolute bottom-8 right-10 hidden md:flex items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.35em] text-white/30">
            {HERO_SLIDES[currentSlide].caption}
          </span>
          <div className="flex gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <span
                key={i}
                className={`w-4 h-px transition-all duration-700 ${
                  i === currentSlide ? 'bg-[#D4A027] w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setPrevSlide(currentSlide);
      setCurrentSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [mounted, currentSlide]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#030b15]">
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.08) translate(0%, 0%); }
          100% { transform: scale(1.0) translate(-1%, 1%); }
        }
        @keyframes kenBurnsReverse {
          0%   { transform: scale(1.0) translate(-1%, 1%); }
          100% { transform: scale(1.08) translate(1%, -1%); }
        }
        @keyframes heroFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes heroFadeOut { from { opacity: 1; } to { opacity: 0; } }
        .slide-enter { animation: heroFadeIn 1.5s ease forwards; }
        .slide-exit  { animation: heroFadeOut 1.5s ease forwards; pointer-events: none; }
        .ken-burns-a { animation: kenBurns 8s ease-out forwards; }
        .ken-burns-b { animation: kenBurnsReverse 8s ease-out forwards; }

        /* film-grain overlay */
        .grain-overlay {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
      `}</style>

      {/* Previous slide fading out */}
      {prevSlide !== null && (
        <div key={`prev-${prevSlide}`} className="absolute inset-0 z-[1] slide-exit">
          <img
            src={HERO_SLIDES[prevSlide].url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.45) saturate(1.1)' }}
          />
        </div>
      )}

      {/* Current slide entering */}
      <div key={`curr-${currentSlide}`} className="absolute inset-0 z-[2] slide-enter">
        <img
          src={HERO_SLIDES[currentSlide].url}
          alt={HERO_SLIDES[currentSlide].caption}
          className={`absolute inset-0 w-full h-full object-cover ${
            currentSlide % 2 === 0 ? 'ken-burns-a' : 'ken-burns-b'
          }`}
          style={{ filter: 'brightness(0.45) saturate(1.15)' }}
        />
      </div>

      {/* Film grain */}
      <div className="grain-overlay" />

      {/* Scroll indicator line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="w-px h-16 bg-gradient-to-b from-[#D4A027]/60 to-transparent" />
      </div>

      {/* Editorial content overlay */}
      <HeroContent currentSlide={currentSlide} />
    </section>
  );
}
