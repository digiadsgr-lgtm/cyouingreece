'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Holographic entrance
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" })
      .fromTo(textRef.current, { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" }, "-=1");

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden stars-layer">
      <div className="scanline"></div>
      
      {/* Orb that follows cursor to simulate an AI scanner */}
      <div 
        ref={glowRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{ 
          background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, rgba(176,38,255,0.05) 50%, transparent 80%)',
          transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)` 
        }}
      />

      <div className="z-10 text-center flex flex-col items-center glass-extreme p-10 md:p-16 rounded-[2rem] max-w-5xl border-t border-t-[rgba(0,255,255,0.3)] border-b border-b-[rgba(176,38,255,0.3)] relative">
        {/* Terminal decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#0ff] rounded-tl-[2rem] opacity-50"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#b026ff] rounded-tr-[2rem] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#b026ff] rounded-bl-[2rem] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#0ff] rounded-br-[2rem] opacity-50"></div>

        <div className="text-[10px] md:text-sm tracking-[0.6em] text-[#0ff] uppercase mb-8 font-space bg-[rgba(0,255,255,0.1)] px-4 py-1 rounded inline-block border border-[rgba(0,255,255,0.2)]">System Online &gt;_ Nodes Initialized</div>
        
        <h1 ref={textRef} className="text-6xl md:text-[8rem] font-space font-bold tracking-tighter uppercase mb-6 leading-[0.9] drop-shadow-2xl">
          <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">Hellenic</span><br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] via-white to-[#b026ff] drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]">Futurism</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-300 max-w-3xl font-light leading-relaxed mt-6">
          Initiate sequence into the Aegean archipelago. Accessing cross-referenced spatial nodes, architectural heritage arrays, and live topological variants.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
          <button className="px-10 py-4 bg-[rgba(0,255,255,0.05)] border border-[#0ff] text-[#0ff] font-space tracking-[0.2em] uppercase text-sm hover:bg-[#0ff] hover:text-black hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] transition-all duration-300">
            [ Explore Matrix ]
          </button>
          <button className="px-10 py-4 bg-transparent border border-gray-600 text-gray-400 font-space tracking-[0.2em] uppercase text-sm hover:border-[#b026ff] hover:text-[#b026ff] hover:shadow-[0_0_30px_rgba(176,38,255,0.4)] transition-all duration-300">
            [ Access Logs ]
          </button>
        </div>
      </div>
    </section>
  );
}
