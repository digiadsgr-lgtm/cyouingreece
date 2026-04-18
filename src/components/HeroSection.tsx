'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // 3D Parallax Mouse tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

    // Mouse tracker
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden perspective-[1000px]">
      
      {/* 3D Realistic Photograph with Dynamic Parallax */}
      <div 
        className="absolute inset-0 z-0 bg-[#003366] transition-transform duration-700 ease-out"
        style={{
          transform: `scale(1.1) rotateX(${mousePosition.y * -3}deg) rotateY(${mousePosition.x * 3}deg) translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)`
        }}
      >
        <Image 
          src="/bg-hero.png"
          alt="Santorini Ultra Realistic 3D Render"
          fill
          priority
          className="object-cover"
        />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,51,102,0.1)] via-[rgba(0,0,0,0.2)] to-[rgba(0,51,102,0.95)] pointer-events-none"></div>
      </div>

      {/* Content Container */}
      <div ref={textRef} className="z-10 text-center flex flex-col items-center px-6 max-w-4xl mt-32 pointer-events-none drop-shadow-2xl">
        <div className="text-[10px] md:text-sm tracking-[0.3em] text-[#D4AF37] uppercase mb-6 font-semibold">The Ultimate Travel Entity</div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-serif font-medium text-white mb-6 leading-tight text-shadow-elegant drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          Your Escapist<br/>
          <span className="italic text-[#FCFDFF] font-light">Sanctuary</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-100 max-w-2xl font-light leading-relaxed mt-4 text-shadow-elegant drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          Immerse yourself in deeply curated Greek experiences. Let our AI Concierge craft the perfect voyage blending ancient heritage with absolute luxury.
        </p>

        <div className="mt-12 flex space-x-6 pointer-events-auto">
          <button className="px-8 py-4 bg-white text-[#003366] font-semibold tracking-wide uppercase text-sm hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 shadow-2xl">
            Start Journey
          </button>
          <button className="px-8 py-4 bg-transparent border border-white text-white font-semibold tracking-wide uppercase text-sm hover:bg-[rgba(255,255,255,0.2)] transition-colors duration-300 backdrop-blur-sm">
            Explore Destinations
          </button>
        </div>
      </div>
    </section>
  );
}
