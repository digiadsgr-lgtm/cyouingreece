'use client';

import { useLocale } from 'next-intl';
import { routing, usePathname, useRouter } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES: Record<string, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English',    nativeName: 'English',    flag: '🇬🇧' },
  el: { name: 'Greek',      nativeName: 'Ελληνικά',   flag: '🇬🇷' },
  de: { name: 'German',     nativeName: 'Deutsch',    flag: '🇩🇪' },
  fr: { name: 'French',     nativeName: 'Français',   flag: '🇫🇷' },
  it: { name: 'Italian',    nativeName: 'Italiano',   flag: '🇮🇹' },
  es: { name: 'Spanish',    nativeName: 'Español',    flag: '🇪🇸' },
  ro: { name: 'Romanian',   nativeName: 'Română',     flag: '🇷🇴' },
  nl: { name: 'Dutch',      nativeName: 'Nederlands', flag: '🇳🇱' },
  no: { name: 'Norwegian',  nativeName: 'Norsk',      flag: '🇳🇴' },
  sv: { name: 'Swedish',    nativeName: 'Svenska',    flag: '🇸🇪' },
  da: { name: 'Danish',     nativeName: 'Dansk',      flag: '🇩🇰' },
  fi: { name: 'Finnish',    nativeName: 'Suomi',      flag: '🇫🇮' },
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES[locale] || { name: locale.toUpperCase(), nativeName: '', flag: '🌐' };

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
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select language"
        className={`
          group flex items-center gap-2.5 pl-2 pr-3 py-1.5
          rounded-full border transition-all duration-300
          ${isOpen
            ? 'border-[#D4A027]/60 bg-[#D4A027]/10 shadow-[0_0_20px_rgba(212,160,39,0.15)]'
            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
          }
        `}
      >
        {/* Flag badge */}
        <span className="text-base leading-none select-none" role="img" aria-label={current.name}>
          {current.flag}
        </span>

        {/* Label */}
        <span className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${isOpen ? 'text-[#D4A027]' : 'text-white/70 group-hover:text-white'}`}>
          {locale.toUpperCase()}
        </span>

        {/* Chevron */}
        <svg
          className={`w-3 h-3 transition-all duration-300 ${isOpen ? 'rotate-180 text-[#D4A027]' : 'text-white/30 group-hover:text-white/60'}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-3 w-56 z-[200] overflow-hidden rounded-2xl border border-white/10 bg-[#070f1e]/95 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
          >
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4A027]/60 to-transparent" />

            <div className="py-2 max-h-[70vh] overflow-y-auto">
              {routing.locales.map((cur) => {
                const lang = LANGUAGES[cur];
                const isActive = locale === cur;
                return (
                  <button
                    key={cur}
                    onClick={() => handleLocaleChange(cur)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200
                      ${isActive
                        ? 'bg-[#D4A027]/10'
                        : 'hover:bg-white/5'
                      }
                    `}
                  >
                    {/* Flag */}
                    <span className="text-xl leading-none select-none shrink-0">
                      {lang?.flag || '🌐'}
                    </span>

                    {/* Names */}
                    <div className="flex-1 min-w-0">
                      <span className={`block text-[11px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#D4A027]' : 'text-white/70 group-hover:text-white'}`}>
                        {lang?.nativeName || cur.toUpperCase()}
                      </span>
                      <span className="block text-[9px] text-white/25 uppercase tracking-[0.15em] mt-0.5">
                        {lang?.name || ''}
                      </span>
                    </div>

                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        layoutId="locale-active-dot"
                        className="w-1.5 h-1.5 rounded-full bg-[#D4A027] shadow-[0_0_8px_#D4A027] shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom accent */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
