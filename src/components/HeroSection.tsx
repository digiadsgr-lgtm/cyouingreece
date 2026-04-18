'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Slow Ken Burns effect on the image
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 20,
      ease: "none",
      repeat: -1,
      yoyo: true
    });

    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" })
      .fromTo(textRef.current?.children || [], 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.3, ease: "power3.out" }, 
        "-=0.5"
      );
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A]">
      
      {/* Pristine Static Image Background with Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          ref={imageRef}
          className="w-full h-full bg-cover bg-center origin-center"
          style={{ backgroundImage: `url('/bg-hero.png')` }}
        />
        {/* Shadow gradient overlay for luxury contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0A0A0A] pointer-events-none"></div>
      </div>

      <div ref={textRef} className="z-10 text-center flex flex-col items-center px-6 max-w-5xl mt-32 pointer-events-none">
        <div className="text-xs md:text-sm tracking-[0.4em] text-[#E5D3B3] uppercase mb-8 font-semibold">CYouInGreece • Private Access</div>
        
        <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-serif font-light text-white mb-6 leading-[1.1] text-shadow-elegant drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
          Find Your<br/>
          <span className="italic text-white">Sanctuary</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed mt-6 drop-shadow-md">
          We do not curate tourism. We arrange private, deeply psychological escapes across the Hellenic archipelago.
        </p>

        <div className="mt-16 flex space-x-6 pointer-events-auto">
          <button className="px-12 py-5 border border-white/30 text-white font-medium tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm">
            Enter The Vault
          </button>
        </div>
      </div>
    </section>
  );
}
