'use client';
import { useEffect, useRef, useState } from 'react';
import type { DestinationScores } from '@/lib/destination-types';

interface Props {
  scores: DestinationScores;
}

const SCORE_CONFIG = [
  { key: 'romance' as const, label: 'Romance', color: '#E57373', emoji: '❤️' },
  { key: 'adventure' as const, label: 'Adventure', color: '#64B5F6', emoji: '🏄' },
  { key: 'family' as const, label: 'Family', color: '#81C784', emoji: '👨‍👩‍👧' },
  { key: 'history' as const, label: 'History', color: '#D4A027', emoji: '🏛️' },
  { key: 'beaches' as const, label: 'Beaches', color: '#4DD0E1', emoji: '🏖️' },
];

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreRadialBadges({ scores }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="destination-scores">
      {SCORE_CONFIG.map(({ key, label, color, emoji }) => {
        const value = scores?.[key] ?? 0;
        const pct = value / 5;
        const dashOffset = CIRCUMFERENCE * (1 - (animated ? pct : 0));

        return (
          <div key={key} className="score-badge" title={`${label}: ${value}/5`}>
            <svg viewBox="0 0 50 50" width="56" height="56" aria-label={`${label} score: ${value} out of 5`}>
              {/* Track */}
              <circle
                cx="25" cy="25" r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              {/* Progress */}
              <circle
                cx="25" cy="25" r={RADIUS}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 25 25)"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
              />
              <text x="25" y="25" textAnchor="middle" dominantBaseline="central" fontSize="14">
                {emoji}
              </text>
            </svg>
            <span className="score-label">{label}</span>
            <span className="score-value">{value}/5</span>
          </div>
        );
      })}

      <style>{`
        .destination-scores {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .score-label {
          font-size: 9px;
          font-family: var(--font-inter), sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-top: 2px;
        }
        .score-value {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
        }
      `}</style>
    </div>
  );
}
