'use client';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('Navigation');
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('encyclopaedia'), link: '/encyclopaedia' },
    { name: 'Journal', link: '/journal' },
    { name: 'Philosophy', link: '/#philosophy' },
    { name: 'Curated Journeys', link: '/curated-journeys' },
  ];

  const categories = [
    { name: 'Sea', link: '/category/sea' },
    { name: 'Mountain', link: '/category/mountain' },
    { name: 'Culture', link: '/category/culture' },
    { name: 'Gastronomy', link: '/category/gastronomy' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-in-out ${
          scrolled
            ? 'bg-[#030b15]/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl'
            : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Branding */}
          <Link href="/" className="flex flex-col group relative z-[110]">
            <span className="text-xl md:text-2xl font-serif text-white tracking-[0.15em] uppercase transition-all duration-500 group-hover:tracking-[0.2em]">
              CYouInGreece
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-px w-4 bg-[#D4A027] transition-all duration-500 group-hover:w-8" />
              <span className="text-[8px] text-[#D4A027] tracking-[0.4em] font-bold uppercase transition-colors">
                The Real Aegean
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/70 hover:text-white transition-all relative group whitespace-nowrap"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4A027] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            
            <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />
            
            <LocaleSwitcher />
          </nav>

          {/* Mobile Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden relative z-[110] p-2 -mr-2 text-white group"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[90] bg-[#030b15] flex flex-col pt-32 pb-12 px-6 md:px-12"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#D4A027]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-[#C1440E]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[800px] mx-auto w-full flex-1 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                {/* Primary Links */}
                <div className="flex flex-col gap-6">
                  <span className="text-[#D4A027] text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Navigation</span>
                  {navLinks.map((item, idx) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        href={item.link}
                        onClick={() => setMobileOpen(false)}
                        className="text-4xl md:text-5xl font-serif text-white hover:text-[#D4A027] transition-colors flex items-center group"
                      >
                        {item.name}
                        <ArrowRight className="w-6 h-6 ml-4 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[#D4A027]" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Secondary Links */}
                <div className="flex flex-col gap-6">
                  <span className="text-[#D4A027] text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Categories</span>
                  <div className="grid grid-cols-1 gap-4">
                    {categories.map((item, idx) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        <Link
                          href={item.link}
                          onClick={() => setMobileOpen(false)}
                          className="text-lg font-serif text-white/50 hover:text-white transition-colors"
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-12 pt-12 border-t border-white/10 flex flex-col gap-6">
                    <span className="text-[#D4A027] text-[10px] uppercase tracking-[0.5em] font-bold block">Language</span>
                    <LocaleSwitcher />
                  </div>
                </div>
              </div>
              
              {/* Mobile Footer */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-auto pt-12 flex flex-col md:flex-row justify-between items-center gap-6"
              >
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-white/30 tracking-[0.3em] uppercase">© 2026 CYouInGreece</span>
                  <span className="text-[8px] text-[#D4A027] tracking-[0.4em] uppercase mt-1">Made with Philoxenia</span>
                </div>
                
                <div className="flex gap-8">
                  <a href="#" className="text-[10px] text-white/50 uppercase tracking-widest hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="text-[10px] text-white/50 uppercase tracking-widest hover:text-white transition-colors">Pinterest</a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
