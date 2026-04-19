'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, ExternalLink } from 'lucide-react';
import type { TopExperience } from '@/lib/destination-types';

interface Props {
  experiences: TopExperience[];
}

export default function TopExperiences({ experiences }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!experiences?.length) return null;

  return (
    <section className="experiences-section" aria-labelledby="exp-heading">
      <h2 id="exp-heading" className="exp-title">Top Experiences</h2>
      <p className="exp-subtitle">Curated by locals, organised by depth</p>

      <div className="exp-accordion" role="list">
        {experiences.map((exp, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className={`exp-item ${isOpen ? 'exp-item--open' : ''}`} role="listitem">
              <button
                className="exp-trigger"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`exp-content-${i}`}
                id={`exp-trigger-${i}`}
              >
                <div className="exp-trigger-left">
                  <span className="exp-number">{String(i + 1).padStart(2, '0')}</span>
                  <span className="exp-name">{exp.title}</span>
                </div>
                <div className="exp-trigger-right">
                  {exp.duration && (
                    <span className="exp-duration">
                      <Clock size={12} aria-hidden="true" />
                      {exp.duration}
                    </span>
                  )}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="exp-chevron"
                    aria-hidden="true"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`exp-content-${i}`}
                    role="region"
                    aria-labelledby={`exp-trigger-${i}`}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="exp-content-wrap"
                  >
                    <div className="exp-content">
                      {exp.description && (
                        <p className="exp-description">{exp.description}</p>
                      )}
                      {exp.booking_url && (
                        <a
                          href={exp.booking_url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="exp-cta"
                        >
                          Book this experience
                          <ExternalLink size={13} aria-hidden="true" />
                        </a>
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
        .experiences-section { padding: 3rem 0; }
        .exp-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #FAF9F6;
          margin: 0 0 0.4rem;
        }
        .exp-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          font-style: italic;
          margin: 0 0 1.75rem;
          font-family: var(--font-inter), sans-serif;
        }
        .exp-accordion {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
        }
        .exp-item {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .exp-item:last-child { border-bottom: none; }
        .exp-item--open { background: rgba(212,160,39,0.04); }

        .exp-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 1rem;
          transition: background 0.2s;
        }
        .exp-trigger:hover { background: rgba(255,255,255,0.03); }
        .exp-trigger-left { display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 0; }
        .exp-trigger-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .exp-number {
          font-family: var(--font-serif), serif;
          font-size: 1rem;
          color: #D4A027;
          min-width: 28px;
        }
        .exp-name {
          font-family: var(--font-inter), sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #FAF9F6;
          line-height: 1.3;
        }
        .exp-duration {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
          font-family: var(--font-inter), sans-serif;
        }
        .exp-chevron { color: rgba(255,255,255,0.4); display: flex; }

        .exp-content-wrap { overflow: hidden; }
        .exp-content { padding: 0 1.5rem 1.5rem 4rem; }
        .exp-description {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.65);
          margin: 0 0 1rem;
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
        }
        .exp-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #D4A027;
          text-decoration: none;
          border: 1px solid rgba(212,160,39,0.35);
          padding: 7px 14px;
          border-radius: 100px;
          transition: background 0.2s, color 0.2s;
          font-family: var(--font-inter), sans-serif;
        }
        .exp-cta:hover { background: rgba(212,160,39,0.12); }
      `}</style>
    </section>
  );
}
