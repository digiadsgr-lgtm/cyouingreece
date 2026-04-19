'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Bus, Home, Shield, MessageSquare } from 'lucide-react';
import type { PracticalInfo as PracticalInfoType } from '@/lib/destination-types';

interface Props {
  info: PracticalInfoType;
  gettingThere?: string;
}

const SECTIONS = [
  { key: 'getting_there', label: 'How to Get There', icon: <Bus size={16} /> },
  { key: 'accommodation_zones', label: 'Where to Stay', icon: <Home size={16} /> },
  { key: 'transport_local', label: 'Getting Around', icon: <Bus size={16} /> },
  { key: 'safety_tips', label: 'Safety Tips', icon: <Shield size={16} /> },
  { key: 'useful_phrases', label: 'Useful Greek Phrases', icon: <MessageSquare size={16} /> },
] as const;

type SectionKey = typeof SECTIONS[number]['key'];

export default function PracticalInfo({ info, gettingThere }: Props) {
  const [openKey, setOpenKey] = useState<SectionKey | null>('getting_there');

  const contentMap: Record<SectionKey, string | string[] | undefined> = {
    getting_there: gettingThere,
    accommodation_zones: info?.accommodation_zones,
    transport_local: info?.transport_local,
    safety_tips: info?.safety_tips,
    useful_phrases: info?.useful_phrases,
  };

  return (
    <section className="practical-section" aria-labelledby="practical-heading">
      <h2 id="practical-heading" className="practical-title">Practical Information</h2>

      <div className="practical-accordion" role="list">
        {SECTIONS.map(({ key, label, icon }) => {
          const content = contentMap[key];
          if (!content) return null;
          const isOpen = openKey === key;

          return (
            <div key={key} className={`practical-item ${isOpen ? 'practical-item--open' : ''}`} role="listitem">
              <button
                className="practical-trigger"
                onClick={() => setOpenKey(isOpen ? null : key)}
                aria-expanded={isOpen}
                aria-controls={`practical-${key}`}
                id={`practical-btn-${key}`}
              >
                <span className="practical-trigger-left">
                  <span className="practical-icon" aria-hidden="true">{icon}</span>
                  <span className="practical-label">{label}</span>
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="practical-chevron"
                  aria-hidden="true"
                >
                  <ChevronDown size={16} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`practical-${key}`}
                    role="region"
                    aria-labelledby={`practical-btn-${key}`}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="practical-content-wrap"
                  >
                    <div className="practical-content">
                      {Array.isArray(content) ? (
                        <ul className="practical-phrases">
                          {content.map((phrase, i) => (
                            <li key={i} className="practical-phrase">
                              <span className="phrase-bullet" aria-hidden="true">γ</span>
                              {phrase}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="practical-text">{content}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <style>{`
        .practical-section { padding: 3rem 0; }
        .practical-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #FAF9F6;
          margin: 0 0 1.5rem;
        }
        .practical-accordion {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
        }
        .practical-item { border-bottom: 1px solid rgba(255,255,255,0.06); }
        .practical-item:last-child { border-bottom: none; }
        .practical-item--open { background: rgba(255,255,255,0.02); }

        .practical-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.4rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .practical-trigger:hover { background: rgba(255,255,255,0.03); }
        .practical-trigger-left { display: flex; align-items: center; gap: 10px; }
        .practical-icon { color: #D4A027; display: flex; }
        .practical-label {
          font-size: 14px;
          font-weight: 500;
          color: #FAF9F6;
          font-family: var(--font-inter), sans-serif;
        }
        .practical-chevron { color: rgba(255,255,255,0.35); display: flex; }

        .practical-content-wrap { overflow: hidden; }
        .practical-content { padding: 0.25rem 1.4rem 1.25rem 3rem; }
        .practical-text {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.65);
          margin: 0;
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
        }
        .practical-phrases { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .practical-phrase {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          line-height: 1.55;
          font-family: var(--font-inter), sans-serif;
        }
        .phrase-bullet {
          font-family: var(--font-serif), serif;
          color: #D4A027;
          font-size: 12px;
          flex-shrink: 0;
          margin-top: 3px;
          font-style: italic;
        }
      `}</style>
    </section>
  );
}
