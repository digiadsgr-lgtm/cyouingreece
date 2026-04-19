'use client';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out border-b ${
        scrolled 
        ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-white/10 py-4' 
        : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
        
        {/* Branding */}
        <div className="flex flex-col">
          <span className="text-xl font-serif text-white tracking-widest uppercase">CYouInGreece</span>
          <span className="text-[9px] text-[#E5D3B3] tracking-[0.3em] font-medium uppercase mt-1">Private Architecture</span>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex space-x-8">
          {[
            { name: 'Destinations', link: '#destinations' },
            { name: 'Experiences', link: '#experiences' },
            { name: 'Travel Planner', link: '#planner' },
            { name: 'Seasons', link: '#seasons' },
            { name: 'Local Voices', link: '#voices' },
            { name: 'Practical Info', link: '#info' }
          ].map((item) => (
            <a 
              key={item.name} 
              href={item.link}
              className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/80 hover:text-brand-golden transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-golden transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <button className="text-xs uppercase tracking-[0.2em] font-medium text-[#0A0A0A] bg-white px-6 py-3 hover:bg-[#E5D3B3] hover:text-black transition-all duration-500">
            Vault Access
          </button>
        </div>

        {/* Mobile Hamburger (Styler only) */}
        <div className="md:hidden flex flex-col space-y-1.5 cursor-pointer">
          <span className="w-6 h-[1px] bg-white block"></span>
          <span className="w-6 h-[1px] bg-white block"></span>
          <span className="w-4 h-[1px] bg-white block self-end"></span>
        </div>

      </div>
    </header>
  );
}
