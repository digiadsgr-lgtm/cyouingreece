import { CheckCircle } from 'lucide-react';
import type { Destination } from '@/lib/destination-types';

interface Props {
  destination: Destination;
  locale: string;
}

export default function IntroSection({ destination, locale }: Props) {
  const { intro_paragraph, translations, reviewed_by, last_reviewed } = destination;

  const translatedIntro =
    locale !== 'en'
      ? (translations as Record<string, { intro_paragraph?: string }>)[locale]?.intro_paragraph
      : undefined;
  const displayIntro = translatedIntro || intro_paragraph;

  const reviewDate = last_reviewed
    ? new Date(last_reviewed).toLocaleDateString('en', { year: 'numeric', month: 'long' })
    : null;

  return (
    <section className="intro-section" aria-label="Destination introduction">
      {/* Reading time not available here — shown in BodyContent */}
      <div className="intro-content">
        {displayIntro && (
          <p className="intro-paragraph">{displayIntro}</p>
        )}

        {/* Reviewer credit */}
        {reviewed_by && (
          <div className="reviewer-credit" aria-label="Article reviewer">
            <div className="reviewer-avatar" aria-hidden="true">
              <span>{reviewed_by.charAt(0).toUpperCase()}</span>
            </div>
            <div className="reviewer-info">
              <span className="reviewer-name">{reviewed_by}</span>
              <span className="reviewer-role">
                <CheckCircle size={11} className="reviewer-badge" aria-hidden="true" />
                Local Contributor{reviewDate ? ` · Updated ${reviewDate}` : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .intro-section {
          padding: 4rem 0 2rem;
        }
        .intro-content { max-width: 680px; }
        .intro-paragraph {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: clamp(1.05rem, 2vw, 1.2rem);
          line-height: 1.85;
          color: rgba(250,249,246,0.82);
          margin: 0 0 2rem;
        }
        .reviewer-credit {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          width: fit-content;
        }
        .reviewer-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4A027, #C1440E);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: #0A1628;
          flex-shrink: 0;
        }
        .reviewer-name {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #FAF9F6;
          font-family: var(--font-inter), sans-serif;
        }
        .reviewer-role {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
          font-family: var(--font-inter), sans-serif;
        }
        .reviewer-badge { color: #4DD0E1; }
      `}</style>
    </section>
  );
}
