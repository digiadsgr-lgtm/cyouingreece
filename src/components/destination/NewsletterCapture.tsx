'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function NewsletterCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // POST to your newsletter endpoint / Supabase / Mailchimp
    await new Promise((r) => setTimeout(r, 800)); // simulate
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-heading">
      <div className="newsletter-inner">
        <div className="newsletter-content">
          <span className="newsletter-kicker">The Insider's Greece</span>
          <h2 id="newsletter-heading" className="newsletter-title">
            Know Before You Go
          </h2>
          <p className="newsletter-body">
            Join 24,000 travellers who get our weekly dispatches — hidden coves, festival dates,
            local tips and the 30 things no guidebook tells you about Greece.
          </p>

          {!submitted ? (
            <form className="newsletter-form" onSubmit={handleSubmit} aria-label="Newsletter signup">
              <div className="newsletter-field">
                <input
                  id="newsletter-email"
                  type="email"
                  className="newsletter-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="newsletter-btn"
                  disabled={loading}
                  aria-label="Subscribe"
                >
                  {loading ? '…' : <><Send size={14} /> Subscribe</>}
                </button>
              </div>
              <p className="newsletter-legal">
                Free forever. No ads. Unsubscribe anytime.{' '}
                <a href="/privacy" className="newsletter-link">Privacy policy</a>
              </p>
            </form>
          ) : (
            <div className="newsletter-success" role="status" aria-live="polite">
              🌿 You're on the list! Check your inbox for the PDF guide.
            </div>
          )}

          {!submitted && (
            <div className="newsletter-lead">
              <div className="newsletter-pdf-badge">📄 PDF</div>
              <div>
                <span className="newsletter-lead-title">Free with signup</span>
                <span className="newsletter-lead-desc">
                  "The 30 things no guidebook tells you about Greece"
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="newsletter-decoration" aria-hidden="true">
          <div className="decor-greek-1">Ω</div>
          <div className="decor-greek-2">Σ</div>
          <div className="decor-greek-3">Δ</div>
        </div>
      </div>

      <style>{`
        .newsletter-section {
          background: #F5EDD8;
          padding: 5rem clamp(1.5rem, 5vw, 4rem);
          margin-top: 4rem;
          position: relative;
          overflow: hidden;
        }
        .newsletter-inner {
          max-width: 760px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 3rem;
        }
        @media (max-width: 640px) { .newsletter-inner { flex-direction: column; gap: 1.5rem; } }
        .newsletter-content { flex: 1; }

        .newsletter-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #8B6914; display: block; margin-bottom: 0.6rem; font-family: var(--font-inter), sans-serif; }
        .newsletter-title { font-family: var(--font-serif), serif; font-size: clamp(1.8rem, 4vw, 2.8rem); color: #2C1A06; margin: 0 0 0.75rem; line-height: 1.15; }
        .newsletter-body { font-size: 15px; color: #5C3D14; line-height: 1.7; margin: 0 0 1.5rem; font-family: var(--font-inter), sans-serif; font-weight: 300; }

        .newsletter-form { display: flex; flex-direction: column; gap: 8px; }
        .newsletter-field { display: flex; gap: 0; border-radius: 10px; overflow: hidden; border: 1.5px solid rgba(139,105,20,0.3); background: #fff; box-shadow: 0 2px 12px rgba(139,105,20,0.15); }
        .newsletter-input { flex: 1; border: none; outline: none; padding: 13px 16px; font-size: 14px; color: #2C1A06; background: transparent; font-family: var(--font-inter), sans-serif; }
        .newsletter-input::placeholder { color: #C4A35A; }
        .newsletter-btn { display: flex; align-items: center; gap: 6px; background: #2C1A06; color: #F5EDD8; font-size: 13px; font-weight: 600; padding: 0 20px; border: none; cursor: pointer; transition: background 0.2s; font-family: var(--font-inter), sans-serif; white-space: nowrap; }
        .newsletter-btn:hover:not(:disabled) { background: #5C3D14; }
        .newsletter-btn:disabled { opacity: 0.6; }
        .newsletter-legal { font-size: 11px; color: #8B6914; margin: 0; font-family: var(--font-inter), sans-serif; }
        .newsletter-link { color: #5C3D14; }

        .newsletter-lead { display: flex; align-items: center; gap: 12px; margin-top: 1.25rem; padding: 10px 14px; background: rgba(139,105,20,0.1); border-radius: 10px; border: 1px solid rgba(139,105,20,0.2); }
        .newsletter-pdf-badge { width: 38px; height: 38px; background: #2C1A06; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .newsletter-lead-title { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #5C3D14; margin-bottom: 2px; font-family: var(--font-inter), sans-serif; }
        .newsletter-lead-desc { font-size: 13px; color: #2C1A06; font-family: var(--font-serif), serif; font-style: italic; }

        .newsletter-success { padding: 14px 18px; background: rgba(139,105,20,0.1); border: 1px solid rgba(139,105,20,0.3); border-radius: 10px; font-size: 14px; color: #2C1A06; font-family: var(--font-inter), sans-serif; }

        .newsletter-decoration { position: absolute; right: -2rem; top: 50%; transform: translateY(-50%); user-select: none; pointer-events: none; display: flex; flex-direction: column; gap: 0; }
        @media (max-width: 640px) { .newsletter-decoration { display: none; } }
        .decor-greek-1, .decor-greek-2, .decor-greek-3 { font-family: var(--font-serif), serif; color: rgba(139,105,20,0.08); line-height: 1; }
        .decor-greek-1 { font-size: 12rem; }
        .decor-greek-2 { font-size: 8rem; margin-left: 2rem; }
        .decor-greek-3 { font-size: 10rem; margin-left: -1rem; }
      `}</style>
    </section>
  );
}
