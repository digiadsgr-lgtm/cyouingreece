"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enter animation for the dark overlay dropping Opacity
      gsap.to(overlayRef.current, {
        opacity: 0.4,
        duration: 2,
        ease: "power2.inOut",
        delay: 0.2
      });

      // Text stagger reveal
      gsap.from([headlineRef.current, sublineRef.current], {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2574&auto=format&fit=crop"
        alt="Santorini Greece View"
        fill
        className="object-cover object-center absolute inset-0 z-0 scale-105"
        priority
      />
      
      {/* Cinematic Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black opacity-80 z-10" 
      />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center text-white flex flex-col items-center">
        <h1 
          ref={headlineRef}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight"
        >
          Curate Your Hellenic Odyssey
        </h1>
        <p 
          ref={sublineRef}
          className="text-lg md:text-xl font-light text-gray-200 max-w-2xl mb-12"
        >
          An AI-powered luxury gateway to Greece. Define your desires and let our engine architect the perfect Mediterranean escape.
        </p>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce opacity-70">
        <span className="text-xs uppercase tracking-widest text-white mb-2">Discover</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>
    </section>
  );
}
