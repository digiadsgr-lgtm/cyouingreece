'use client';
import { useState, useRef, useEffect } from 'react';
import type { Locale } from 'next-intl';

// ─── Affiliate partner config ─────────────────────────────────────────────────
// Each partner has a tracking URL + utm params baked in. AddRevenue/Admitad etc.
const PARTNERS = {
  getyourguide: (destination: string) =>
    `https://www.getyourguide.com/-l${encodeURIComponent(destination)}/?partner_id=CYUIG&utm_source=cyouingreece&utm_medium=referral`,
  viator: (destination: string) =>
    `https://www.viator.com/searchResults/all?text=${encodeURIComponent(destination)}&pid=P00047980&mcid=42383&medium=link`,
  booking: (destination: string) =>
    `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&aid=XXXXXX&label=cyouingreece`,
  klook: (destination: string) =>
    `https://www.klook.com/en-US/ticket/?krtpid=cyouingreece&q=${encodeURIComponent(destination)}`,
};

// ─── PDF Lead Magnets ─────────────────────────────────────────────────────────
const LEAD_MAGNETS = [
  {
    id: 'island-hopping',
    title: 'The Ultimate Island-Hopping Route',
    subtitle: '14 islands · 21 days · optimised for ferries & budget',
    icon: '🏝',
    tag: 'PDF GUIDE',
  },
  {
    id: 'hidden-villages',
    title: '37 Greek Villages Nobody Talks About',
    subtitle: 'Curated by local experts — off every tourist map',
    icon: '🏘',
    tag: 'PDF GUIDE',
  },
  {
    id: 'food-guide',
    title: 'The Real Greek Food Bible',
    subtitle: 'Regional specialties, market maps, must-order dishes',
    icon: '🍽',
    tag: 'PDF GUIDE',
  },
];

interface Props {
  destinationName?: string;
  locale?: string;
}

export default function NewsletterAffiliate({ destinationName, locale = 'en' }: Props) {
  const [email, setEmail] = useState('');
  const [selectedMagnet, setSelectedMagnet] = useState(LEAD_MAGNETS[0].id);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [honeypot, setHoneypot] = useState(''); // spam trap
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  // Animate in on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detected
    if (!email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          magnet: selectedMagnet,
          destination: destinationName ?? 'general',
          locale,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      ref={sectionRef}
      className="nl-section"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
      aria-label="Newsletter signup and travel resources"
    >

      {/* ── Top: Lead magnet selector ────────────────────────────────────── */}
      <div className="nl-inner">
        <div className="nl-left">
          <p className="nl-eyebrow">Free resources</p>
          <h2 className="nl-heading">
            {destinationName ? `Plan your trip to ${destinationName}` : 'Plan your perfect Greek trip'}
          </h2>
          <p className="nl-sub">Choose a free guide. We'll send it instantly.</p>

          <div className="nl-magnets" role="radiogroup" aria-label="Choose a free guide">
            {LEAD_MAGNETS.map((m) => (
              <button
                key={m.id}
                role="radio"
                aria-checked={selectedMagnet === m.id}
                className={`nl-magnet ${selectedMagnet === m.id ? 'nl-magnet--active' : ''}`}
                onClick={() => setSelectedMagnet(m.id)}
                type="button"
              >
                <span className="nl-magnet-icon">{m.icon}</span>
                <span className="nl-magnet-tag">{m.tag}</span>
                <strong className="nl-magnet-title">{m.title}</strong>
                <span className="nl-magnet-sub">{m.subtitle}</span>
              </button>
            ))}
          </div>

          {/* Email form */}
          {status === 'success' ? (
            <div className="nl-success" role="status">
              <span style={{ fontSize: '2rem' }}>✅</span>
              <div>
                <strong>Check your inbox!</strong>
                <p>Your free guide is on the way.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="nl-form" noValidate>
              {/* Honeypot — hidden from humans, filled by bots */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              />
              <div className="nl-input-row">
                <input
                  id="nl-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="nl-input"
                  disabled={status === 'loading'}
                  aria-label="Your email address"
                />
                <button
                  type="submit"
                  className="nl-submit"
                  disabled={status === 'loading' || !email}
                  aria-label="Get free guide"
                >
                  {status === 'loading' ? (
                    <span className="nl-spinner" aria-hidden="true" />
                  ) : 'Get it free →'}
                </button>
              </div>
              {status === 'error' && (
                <p className="nl-error" role="alert">Something went wrong. Try again.</p>
              )}
              <p className="nl-legal">No spam. Unsubscribe anytime. GDPR compliant.</p>
            </form>
          )}
        </div>

        {/* ── Right: Affiliate deals ────────────────────────────────────── */}
        <div className="nl-right">
          <p className="nl-eyebrow">Book with confidence</p>
          <h3 className="nl-deals-heading">Top-rated travel partners</h3>

          <div className="nl-partners">

            <a
              href={PARTNERS.getyourguide(destinationName ?? 'Greece')}
              target="_blank" rel="noopener noreferrer sponsored"
              className="nl-partner-card"
              aria-label="Book experiences on GetYourGuide"
            >
              <span className="nl-partner-icon">🎟</span>
              <div className="nl-partner-info">
                <strong>Experiences & Tours</strong>
                <span>GetYourGuide · 10% off first booking</span>
              </div>
              <span className="nl-partner-arrow">→</span>
            </a>

            <a
              href={PARTNERS.viator(destinationName ?? 'Greece')}
              target="_blank" rel="noopener noreferrer sponsored"
              className="nl-partner-card"
              aria-label="Book activities on Viator"
            >
              <span className="nl-partner-icon">🌊</span>
              <div className="nl-partner-info">
                <strong>Day trips & Activities</strong>
                <span>Viator · Free cancellation</span>
              </div>
              <span className="nl-partner-arrow">→</span>
            </a>

            <a
              href={PARTNERS.booking(destinationName ?? 'Greece')}
              target="_blank" rel="noopener noreferrer sponsored"
              className="nl-partner-card"
              aria-label="Find hotels on Booking.com"
            >
              <span className="nl-partner-icon">🏨</span>
              <div className="nl-partner-info">
                <strong>Hotels & Villas</strong>
                <span>Booking.com · Genius prices</span>
              </div>
              <span className="nl-partner-arrow">→</span>
            </a>

            <a
              href={PARTNERS.klook(destinationName ?? 'Greece')}
              target="_blank" rel="noopener noreferrer sponsored"
              className="nl-partner-card"
              aria-label="Book tickets on Klook"
            >
              <span className="nl-partner-icon">✈️</span>
              <div className="nl-partner-info">
                <strong>Tickets & Transfers</strong>
                <span>Klook · Instant confirmation</span>
              </div>
              <span className="nl-partner-arrow">→</span>
            </a>
          </div>

          <p className="nl-disclosure">
            *Affiliate links. We earn a small commission at no extra cost to you.
            This funds our editorial independence.
          </p>
        </div>
      </div>

      <style>{`
        /* ── Section ─────────────────────────────────────────────────────── */
        .nl-section {
          background: linear-gradient(135deg, #0d1f38 0%, #0A1628 60%, #12213a 100%);
          border-top: 1px solid rgba(212,160,39,0.15);
          padding: clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 4rem);
          position: relative;
          overflow: hidden;
        }
        .nl-section::before {
          content: 'Ω';
          position: absolute;
          top: -60px; right: -40px;
          font-size: 280px;
          color: rgba(212,160,39,0.03);
          font-family: var(--font-serif), serif;
          pointer-events: none;
        }

        /* ── Layout ──────────────────────────────────────────────────────── */
        .nl-inner {
          max-width: 1140px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: start;
        }
        @media (max-width: 900px) {
          .nl-inner { grid-template-columns: 1fr; }
        }

        /* ── Typography ──────────────────────────────────────────────────── */
        .nl-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #D4A027;
          margin: 0 0 12px;
          font-family: var(--font-inter), sans-serif;
        }
        .nl-heading {
          font-family: var(--font-serif), serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          color: #FAF9F6;
          margin: 0 0 10px;
          line-height: 1.2;
        }
        .nl-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.55);
          margin: 0 0 1.75rem;
          font-family: var(--font-inter), sans-serif;
        }
        .nl-deals-heading {
          font-family: var(--font-inter), sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #FAF9F6;
          margin: 0 0 1rem;
        }

        /* ── Lead magnet cards ───────────────────────────────────────────── */
        .nl-magnets {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 1.75rem;
        }
        .nl-magnet {
          display: grid;
          grid-template-areas: 'icon tag' 'icon title' 'icon sub';
          grid-template-columns: 44px 1fr;
          column-gap: 12px;
          row-gap: 2px;
          text-align: left;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
        }
        .nl-magnet--active {
          border-color: rgba(212,160,39,0.5);
          background: rgba(212,160,39,0.07);
        }
        .nl-magnet--active::after {
          content: '✓';
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          color: #D4A027;
          font-weight: 700;
          font-size: 14px;
        }
        .nl-magnet-icon {
          grid-area: icon;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nl-magnet-tag {
          grid-area: tag;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #D4A027;
          font-family: var(--font-inter), sans-serif;
        }
        .nl-magnet-title {
          grid-area: title;
          font-size: 13px;
          font-weight: 600;
          color: #FAF9F6;
          font-family: var(--font-inter), sans-serif;
        }
        .nl-magnet-sub {
          grid-area: sub;
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          font-family: var(--font-inter), sans-serif;
          line-height: 1.4;
        }

        /* ── Form ────────────────────────────────────────────────────────── */
        .nl-form { display: flex; flex-direction: column; gap: 10px; }
        .nl-input-row { display: flex; gap: 8px; }
        .nl-input {
          flex: 1;
          padding: 13px 16px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #FAF9F6;
          font-size: 14px;
          font-family: var(--font-inter), sans-serif;
          transition: border-color 0.2s;
          outline: none;
        }
        .nl-input:focus { border-color: rgba(212,160,39,0.5); }
        .nl-input::placeholder { color: rgba(255,255,255,0.3); }
        .nl-submit {
          padding: 13px 22px;
          background: linear-gradient(135deg, #D4A027, #C1440E);
          color: #0A1628;
          font-weight: 700;
          font-size: 13px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          white-space: nowrap;
          font-family: var(--font-inter), sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nl-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .nl-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .nl-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(10,22,40,0.2);
          border-top-color: #0A1628;
          border-radius: 50%;
          animation: nlSpin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes nlSpin { to { transform: rotate(360deg); } }
        .nl-legal {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin: 0;
          font-family: var(--font-inter), sans-serif;
        }
        .nl-error {
          font-size: 12px;
          color: #ff6b6b;
          margin: 0;
          font-family: var(--font-inter), sans-serif;
        }
        .nl-success {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(38,166,154,0.1);
          border: 1px solid rgba(38,166,154,0.3);
          border-radius: 12px;
          padding: 16px 20px;
        }
        .nl-success strong { display: block; color: #FAF9F6; font-size: 15px; margin-bottom: 3px; font-family: var(--font-inter), sans-serif; }
        .nl-success p { color: rgba(255,255,255,0.55); font-size: 13px; margin: 0; font-family: var(--font-inter), sans-serif; }

        /* ── Affiliate partners ───────────────────────────────────────────── */
        .nl-partners { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
        .nl-partner-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .nl-partner-card:hover {
          border-color: rgba(212,160,39,0.35);
          background: rgba(212,160,39,0.05);
          transform: translateX(3px);
        }
        .nl-partner-icon { font-size: 1.5rem; flex-shrink: 0; }
        .nl-partner-info { flex: 1; }
        .nl-partner-info strong {
          display: block;
          font-size: 13px;
          color: #FAF9F6;
          font-family: var(--font-inter), sans-serif;
          margin-bottom: 2px;
        }
        .nl-partner-info span {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          font-family: var(--font-inter), sans-serif;
        }
        .nl-partner-arrow {
          font-size: 14px;
          color: rgba(212,160,39,0.6);
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .nl-partner-card:hover .nl-partner-arrow { transform: translateX(3px); }

        .nl-disclosure {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          font-family: var(--font-inter), sans-serif;
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </section>
  );
}
