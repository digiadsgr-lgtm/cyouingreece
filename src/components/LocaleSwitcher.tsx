'use client';

import { useLocale } from 'next-intl';
import { routing, usePathname, useRouter } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  el: 'Ελληνικά',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  ro: 'Română',
  nl: 'Nederlands',
  no: 'Norsk',
  sv: 'Svenska',
  da: 'Dansk',
  fi: 'Suomi',
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLocaleChange = (nextLocale: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
      >
        <Globe className="w-3.5 h-3.5 text-[#D4A027] group-hover:rotate-12 transition-transform duration-500" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80 group-hover:text-white transition-colors">
          {locale.toUpperCase()}
        </span>
        <ChevronDown className={`w-3 h-3 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-3 w-48 z-[100] overflow-hidden rounded-2xl border border-white/10 bg-[#0A1628]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="py-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {routing.locales.map((cur) => (
                <button
                  key={cur}
                  onClick={() => handleLocaleChange(cur)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors group/item ${
                    locale === cur ? 'bg-white/5' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${
                      locale === cur ? 'text-[#D4A027]' : 'text-white group-hover/item:text-[#D4A027]'
                    } transition-colors`}>
                      {LANGUAGE_NAMES[cur] || cur.toUpperCase()}
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                      {cur.toUpperCase()}
                    </span>
                  </div>
                  
                  {locale === cur && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="w-1 h-1 rounded-full bg-[#D4A027] shadow-[0_0_8px_#D4A027]" 
                    />
                  )}
                </button>
              ))}
            </div>
            
            {/* Decorative bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A027]/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
