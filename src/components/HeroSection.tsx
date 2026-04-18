'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';

const LiveImage3DComponent = dynamic(() => import('./LiveImage3D'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#001122] flex items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-[#D4AF37] rounded-full animate-spin"></div>
    </div>
  )
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" })
      .fromTo(textRef.current?.children || [], 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out" }, 
        "-=0.5"
      );
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#001122]">
      
      {/* Pure WebGL Shader Image Space */}
      <div className="absolute inset-0 z-0">
        <LiveImage3DComponent />
        {/* Shadow gradient overlay so text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,51,102,0.1)] via-transparent to-[rgba(0,10,30,0.95)] pointer-events-none"></div>
      </div>

      <div ref={textRef} className="z-10 text-center flex flex-col items-center px-6 max-w-4xl mt-32 pointer-events-none drop-shadow-2xl">
        <div className="text-[10px] md:text-sm tracking-[0.3em] text-[#D4AF37] uppercase mb-6 font-semibold">The Ultimate Travel Entity</div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-serif font-medium text-white mb-6 leading-tight text-shadow-elegant drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          Your Escapist<br/>
          <span className="italic text-[#FCFDFF] font-light">Sanctuary</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-100 max-w-2xl font-light leading-relaxed mt-4 drop-shadow-xl">
          Immerse yourself in deeply curated Greek experiences. Let our AI Concierge craft the perfect voyage blending ancient heritage with absolute luxury.
        </p>

        <div className="mt-12 flex space-x-6 pointer-events-auto">
          <button className="px-10 py-5 bg-white text-[#001122] font-semibold tracking-[0.1em] uppercase text-sm hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 shadow-2xl">
            Start Journey
          </button>
        </div>
      </div>
    </section>
  );
}
