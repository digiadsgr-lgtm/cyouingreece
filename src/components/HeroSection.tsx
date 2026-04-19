'use client';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#03060B]">
      
      {/* Background Image with Parallax & Slow Zoom */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=3000&auto=format&fit=crop')",
          backgroundPosition: '50% 65%',
          transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0002})`,
        }}
      />

      {/* Luxury Cinematic Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#03060B]/40 via-transparent to-[#03060B]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#03060B]/70 via-transparent to-[#03060B]/20" />
      
      {/* Film Grain Texture overlay for mood */}
      <div 
        className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}
      />

      {/* Content wrapper */}
      <div className="relative z-30 h-full w-full flex flex-col justify-center px-6 md:px-16 max-w-[1400px] mx-auto">
        <div 
          className="max-w-4xl"
          style={{
            transform: `translateY(${scrollY * -0.15}px)`,
            opacity: 1 - (scrollY / 800)
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="h-[1px] w-12 bg-brand-golden"></span>
            <span className="text-brand-golden tracking-[0.4em] uppercase text-xs md:text-sm font-semibold font-inter">
              Project Olympus
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-8xl font-serif text-brand-white font-light leading-[1.1] mb-8 drop-shadow-2xl">
            Reserved for the<br/>
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-brand-white to-brand-white/60">Unimaginable.</span>
          </h1>
          
          {/* Subtext */}
          <p className="text-gray-300 font-light text-lg md:text-2xl max-w-2xl leading-relaxed mb-12 font-inter">
            Access the Aegean's highest-tier topological nodes. Private yachts, secluded villas, and the profound corners of Greece.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button className="px-8 py-4 bg-brand-golden text-[#03060B] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-white transition-colors duration-300 w-full sm:w-auto">
              Initiate Access
            </button>
            <button className="text-sm tracking-[0.2em] uppercase font-medium border-b border-brand-white/40 pb-1 text-brand-white hover:border-brand-golden hover:text-brand-golden transition-colors w-full sm:w-auto text-center">
              Explore The Nodes
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-4 font-inter">Descend</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-brand-golden to-transparent"></div>
      </div>
    </section>
  );
}
