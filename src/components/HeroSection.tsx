'use client';
import { useState, useEffect } from 'react';

// ─── Hero Content Layer ──────────────────────────────────────────────────────
function HeroContent() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none select-none bg-gradient-to-t from-[#030b15] via-[#030b15]/40 to-transparent">
      <div className="max-w-[1320px] mx-auto w-full px-6 md:px-16 pb-20 md:pb-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-7">
          <span className="h-px w-10 bg-[#D4A027]" />
          <span className="text-[#D4A027] text-[11px] tracking-[0.45em] uppercase font-semibold">
            Aegean · 2026
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-[clamp(3.2rem,9vw,8.5rem)] font-serif font-light text-white leading-[0.9] mb-8"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
          C You In<br />
          <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A027] to-[#C1440E]">
            Greece.
          </em>
        </h1>

        {/* Nikos Quote */}
        <p className="font-serif italic text-[clamp(0.95rem,2vw,1.35rem)] text-white/70 max-w-2xl leading-relaxed mb-10"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
          "Turn left at the blue door, past the bakery that opens at 5am.
          There is a table with a view that will change you."
          <span className="not-italic text-[#D4A027] text-xs ml-3 tracking-widest">— Nikos</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-6 pointer-events-auto">
          <a href="#destinations"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A027] text-[#030b15] text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all duration-300">
            Discover Greece
          </a>
          <button
            className="text-xs tracking-[0.2em] uppercase text-white/70 border-b border-white/30 pb-1 hover:text-[#D4A027] hover:border-[#D4A027] transition-all duration-300"
            onClick={() => {
              const btn = document.querySelector<HTMLButtonElement>('[aria-label="Plan my trip with Nikos"]');
              btn?.click();
            }}>
            Speak to Nikos →
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-10 hidden md:flex flex-col items-center gap-3">
        <span className="text-[9px] uppercase tracking-[0.35em] text-white/30 -rotate-90 mb-6">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-[#D4A027]/60 to-transparent" />
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#030b15]">
      {/* Fallback image shown immediately while iframe loads */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-[2000ms]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: '50% 60%',
          filter: 'brightness(0.35) saturate(0.8)',
        }}
      />

      {/* Vimeo Background Video - loads dynamically and fades in */}
      {mounted && (
        <div className="absolute inset-0 z-[1] w-[150vw] h-[150vh] xl:w-[120vw] xl:h-[120vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none">
          <iframe
            src="https://player.vimeo.com/video/285517336?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&dnt=1"
            className="w-full h-full object-cover scale-[1.05]"
            frameBorder="0"
            allow="autoplay; fullscreen"
            style={{ border: 'none', pointerEvents: 'none' }}
          />
        </div>
      )}

      {/* Editorial content overlay */}
      <HeroContent />
    </section>
  );
}
