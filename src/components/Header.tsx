'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Encyclopaedia', link: '/encyclopaedia' },
    { name: 'Curated Journeys', link: '/curated-journeys' },
    { name: 'Journal', link: '/journal' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out border-b ${
          scrolled
            ? 'bg-[#030b15]/90 backdrop-blur-md border-white/10 py-4'
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 flex justify-between items-center">
          {/* Branding */}
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-serif text-white tracking-widest uppercase">CYouInGreece</span>
            <span className="text-[9px] text-[#D4A027]/70 tracking-[0.3em] font-medium uppercase mt-0.5">
              See You in Greece
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/75 hover:text-[#D4A027] transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4A027] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-6">
            <Link
              href="/vault-access"
              className="hidden md:block text-xs uppercase tracking-[0.2em] font-medium text-[#030b15] bg-[#D4A027] px-6 py-3 hover:bg-white transition-all duration-300"
            >
              Vault Access
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col space-y-1.5 cursor-pointer p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-[1px] bg-white block transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-[1px] bg-white block transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-4 h-[1px] bg-white block self-end transition-all ${mobileOpen ? '-rotate-45 -translate-y-2 w-6' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#030b15]/97 backdrop-blur-md flex flex-col justify-center px-8">
          <nav className="flex flex-col gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-serif text-white hover:text-[#D4A027] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/vault-access"
              onClick={() => setMobileOpen(false)}
              className="mt-4 self-start text-xs uppercase tracking-[0.2em] font-medium text-[#030b15] bg-[#D4A027] px-8 py-4"
            >
              Vault Access
            </Link>
          </nav>
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
