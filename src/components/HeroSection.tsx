'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';

const AegeanFluid = dynamic(() => import('./AegeanFluid'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#001122]"></div>
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cinematic entrance
    const tl = gsap.timeline();
    
    // Text fade up
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" })
      .fromTo(textRef.current?.children || [], 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out" }, 
        "-=0.5"
      );
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      
      {/* 3D WebGL Background */}
      <div className="absolute inset-0 z-0">
        <AegeanFluid />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,51,102,0.1)] via-transparent to-[rgba(0,51,102,0.95)] pointer-events-none"></div>
      </div>

      {/* Content Container */}
      <div ref={textRef} className="z-10 text-center flex flex-col items-center px-6 max-w-4xl mt-32">
        <div className="text-[10px] md:text-sm tracking-[0.3em] text-[#D4AF37] uppercase mb-6 font-semibold">The Ultimate Travel Entity</div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-serif font-medium text-white mb-6 leading-tight text-shadow-elegant">
          Your Escapist<br/>
          <span className="italic text-[#FCFDFF] font-light">Sanctuary</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed mt-4 text-shadow-elegant">
          Immerse yourself in deeply curated Greek experiences. Let our AI Concierge craft the perfect voyage blending ancient heritage with absolute luxury.
        </p>

        <div className="mt-12 flex space-x-6">
          <button className="px-8 py-4 bg-white text-[#003366] font-semibold tracking-wide uppercase text-sm hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 shadow-xl">
            Start Journey
          </button>
          <button className="px-8 py-4 bg-transparent border border-white text-white font-semibold tracking-wide uppercase text-sm hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-300">
            Explore Destinations
          </button>
        </div>
      </div>
    </section>
  );
}
