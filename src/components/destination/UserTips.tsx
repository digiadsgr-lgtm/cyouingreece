'use client';
import { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, Send, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Tip {
  id: string;
  tip_text: string;
  destination_slug: string;
  created_at: string;
  upvotes: number;
}

interface Props {
  destinationSlug: string;
  initialTips?: Tip[];
}

const MAX_TIP_CHARS = 200;

export default function UserTips({ destinationSlug, initialTips = [] }: Props) {
  const [tips, setTips] = useState<Tip[]>(initialTips);
  const [upvoted, setUpvoted] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      return new Set(JSON.parse(localStorage.getItem('upvoted_tips') || '[]'));
    } catch { return new Set(); }
  });

  const [form, setForm] = useState({ email: '', tip: '', honeypot: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Supabase realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`tips:${destinationSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'traveler_tips',
          filter: `destination_slug=eq.${destinationSlug}`,
        },
        (payload) => {
          setTips((prev) => [payload.new as Tip, ...prev]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [destinationSlug]);

  const handleUpvote = useCallback((id: string, currentVotes: number) => {
    if (upvoted.has(id)) return;
    const next = new Set(upvoted);
    next.add(id);
    setUpvoted(next);
    localStorage.setItem('upvoted_tips', JSON.stringify([...next]));

    setTips((prev) =>
      prev.map((t) => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t)
    );

    // Fire-and-forget update to Supabase
    supabase
      .from('traveler_tips')
      .update({ upvotes: currentVotes + 1 })
      .eq('id', id)
      .then(() => {});
  }, [upvoted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Honeypot check
    if (form.honeypot) return;

    if (!form.email || !form.tip.trim()) {
      setError('Please fill in your email and tip.');
      return;
    }
    if (form.tip.length > MAX_TIP_CHARS) {
      setError(`Tip must be ${MAX_TIP_CHARS} characters or fewer.`);
      return;
    }

    setSubmitting(true);
    try {
      const { error: dbErr } = await supabase.from('traveler_tips').insert({
        destination_slug: destinationSlug,
        tip_text: form.tip.trim(),
        email: form.email, // stored server-side, never shown
        approved: false,   // requires moderation
        upvotes: 0,
      });
      if (dbErr) throw dbErr;
      setSubmitted(true);
      setForm({ email: '', tip: '', honeypot: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sort tips by upvotes
  const sorted = [...tips].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <section className="tips-section" aria-labelledby="tips-heading">
      <h2 id="tips-heading" className="tips-title">Traveler Tips</h2>
      <p className="tips-subtitle">Verified advice from people who've been there</p>

      {/* Tip list */}
      {sorted.length > 0 ? (
        <div className="tips-list" role="list">
          {sorted.map((tip) => (
            <div key={tip.id} className="tip-card" role="listitem">
              <p className="tip-text">"{tip.tip_text}"</p>
              <div className="tip-footer">
                <time className="tip-date" dateTime={tip.created_at}>
                  {new Date(tip.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                </time>
                <button
                  className={`tip-upvote ${upvoted.has(tip.id) ? 'tip-upvote--done' : ''}`}
                  onClick={() => handleUpvote(tip.id, tip.upvotes)}
                  aria-pressed={upvoted.has(tip.id)}
                  aria-label={`Upvote this tip (${tip.upvotes} upvotes)`}
                  disabled={upvoted.has(tip.id)}
                >
                  <ThumbsUp size={12} />
                  <span>{tip.upvotes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="tips-empty">No tips yet — be the first to share yours!</p>
      )}

      {/* Submit form */}
      {!submitted ? (
        <form className="tips-form" onSubmit={handleSubmit} aria-label="Submit a traveler tip" noValidate>
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="website"
            value={form.honeypot}
            onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
            style={{ display: 'none' }}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
          />

          <div className="tips-form-fields">
            <div className="tips-field">
              <label className="tips-label" htmlFor="tip-email">Your email (private)</label>
              <input
                id="tip-email"
                type="email"
                className="tips-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>

            <div className="tips-field">
              <label className="tips-label" htmlFor="tip-text">
                Your tip
                <span className="tips-counter" aria-live="polite">
                  {form.tip.length}/{MAX_TIP_CHARS}
                </span>
              </label>
              <textarea
                id="tip-text"
                className="tips-textarea"
                rows={3}
                placeholder="Share something useful you learned on your trip…"
                value={form.tip}
                maxLength={MAX_TIP_CHARS}
                onChange={(e) => setForm({ ...form, tip: e.target.value })}
                required
              />
            </div>
          </div>

          {error && (
            <div className="tips-error" role="alert">
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          <button type="submit" className="tips-submit" disabled={submitting} aria-label="Submit tip">
            {submitting ? 'Submitting…' : (
              <><Send size={13} /> Share my tip</>
            )}
          </button>
          <p className="tips-moderation-note">Tips are reviewed before publishing.</p>
        </form>
      ) : (
        <div className="tips-success" role="status" aria-live="polite">
          ✅ Thanks! Your tip has been submitted for review.
        </div>
      )}

      <style>{`
        .tips-section { padding: 3rem 0; }
        .tips-title { font-family: var(--font-serif), serif; font-size: clamp(1.5rem, 3vw, 2rem); color: #FAF9F6; margin: 0 0 0.3rem; }
        .tips-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); font-style: italic; margin: 0 0 1.5rem; font-family: var(--font-inter), sans-serif; }
        .tips-empty { font-size: 13px; color: rgba(255,255,255,0.35); font-style: italic; margin: 0 0 1.5rem; font-family: var(--font-inter), sans-serif; }

        .tips-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 2rem; }
        .tip-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1rem 1.2rem; }
        .tip-text { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.7; margin: 0 0 0.75rem; font-family: var(--font-inter), sans-serif; font-style: italic; }
        .tip-footer { display: flex; justify-content: space-between; align-items: center; }
        .tip-date { font-size: 11px; color: rgba(255,255,255,0.3); font-family: var(--font-inter), sans-serif; }
        .tip-upvote { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgba(255,255,255,0.45); background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 4px 10px; cursor: pointer; transition: all 0.2s; font-family: var(--font-inter), sans-serif; }
        .tip-upvote:hover:not(:disabled) { border-color: #D4A027; color: #D4A027; }
        .tip-upvote--done { border-color: rgba(212,160,39,0.5); color: #D4A027; }
        .tip-upvote:disabled { cursor: default; }

        .tips-form { display: flex; flex-direction: column; gap: 14px; max-width: 560px; margin-top: 2rem; }
        .tips-form-fields { display: flex; flex-direction: column; gap: 12px; }
        .tips-field { display: flex; flex-direction: column; gap: 5px; }
        .tips-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.45); font-family: var(--font-inter), sans-serif; display: flex; justify-content: space-between; }
        .tips-counter { font-weight: 400; color: rgba(255,255,255,0.3); }
        .tips-input, .tips-textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #FAF9F6; font-family: var(--font-inter), sans-serif; outline: none; transition: border-color 0.2s; resize: none; }
        .tips-input:focus, .tips-textarea:focus { border-color: rgba(212,160,39,0.5); }
        .tips-error { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #EF5350; font-family: var(--font-inter), sans-serif; }
        .tips-submit { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 20px; background: rgba(212,160,39,0.15); border: 1px solid rgba(212,160,39,0.4); border-radius: 8px; color: #D4A027; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; font-family: var(--font-inter), sans-serif; }
        .tips-submit:hover:not(:disabled) { background: rgba(212,160,39,0.25); }
        .tips-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .tips-moderation-note { font-size: 11px; color: rgba(255,255,255,0.25); margin: 0; font-family: var(--font-inter), sans-serif; font-style: italic; }
        .tips-success { padding: 1rem 1.25rem; background: rgba(129, 199, 132, 0.1); border: 1px solid rgba(129,199,132,0.3); border-radius: 10px; font-size: 14px; color: #81C784; font-family: var(--font-inter), sans-serif; }
      `}</style>
    </section>
  );
}
