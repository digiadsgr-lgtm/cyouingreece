'use client';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('Navigation');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('encyclopaedia'), link: '/encyclopaedia' },
    { name: t('philosophy'), link: '/#philosophy' }, // Changed to anchor or philosophy page if exists
    { name: t('curatedJourneys'), link: '/curated-journeys' },
    { name: 'Sea', link: '/category/sea' },
    { name: 'Mountain', link: '/category/mountain' },
    { name: 'Culture', link: '/category/culture' },
    { name: 'Gastronomy', link: '/category/gastronomy' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out border-b ${
          scrolled
            ? 'bg-[#030b15]/95 backdrop-blur-md border-white/10 py-4 shadow-xl'
            : 'bg-gradient-to-b from-[#030b15]/80 via-[#030b15]/40 to-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 flex justify-between items-center">
          {/* Branding */}
          <Link href="/" className="flex flex-col group">
            <span className="text-xl font-serif text-white tracking-widest uppercase drop-shadow-md">CYouInGreece</span>
            <span className="text-[9px] text-[#D4A027] tracking-[0.3em] font-medium uppercase mt-0.5 drop-shadow-md group-hover:text-white transition-colors">
              See You in Greece
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/90 hover:text-[#D4A027] transition-colors relative group drop-shadow-md"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4A027] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {/* Locale Switcher */}
            <LocaleSwitcher />
          </nav>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-6">
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
            <div className="mt-4">
               <LocaleSwitcher />
            </div>
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
