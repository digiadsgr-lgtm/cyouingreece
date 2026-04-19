-- ═══════════════════════════════════════════════════════════════════════════
-- CYouInGreece — Supabase Database Setup
-- Project: rmnifsyfrjlmmditqhvy
-- Run in: https://supabase.com/dashboard/project/rmnifsyfrjlmmditqhvy/sql/new
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── traveler_tips ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.traveler_tips (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug text        NOT NULL,
  tip_text         text        NOT NULL CHECK (char_length(tip_text) <= 200),
  email            text,
  upvotes          integer     NOT NULL DEFAULT 0,
  approved         boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.traveler_tips IS 'User-submitted travel tips per destination. Moderated before display.';
COMMENT ON COLUMN public.traveler_tips.email IS 'Not exposed publicly — only used for abuse tracking.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tips_slug     ON public.traveler_tips (destination_slug);
CREATE INDEX IF NOT EXISTS idx_tips_approved ON public.traveler_tips (approved) WHERE approved = true;
CREATE INDEX IF NOT EXISTS idx_tips_created  ON public.traveler_tips (created_at DESC);

-- Row Level Security
ALTER TABLE public.traveler_tips ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved tips
CREATE POLICY "Public read approved tips"
  ON public.traveler_tips
  FOR SELECT
  USING (approved = true);

-- Anyone can submit a tip (honeypot handled app-side)
CREATE POLICY "Public insert tips"
  ON public.traveler_tips
  FOR INSERT
  WITH CHECK (true);

-- Anyone can upvote (increment)
CREATE POLICY "Public upvote tips"
  ON public.traveler_tips
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ─── generation_logs ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public."generationLogs" (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  target_node  text        NOT NULL,
  type         text        NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  qa_score     integer,
  status       text        DEFAULT 'pending'
    CHECK (status IN ('pending','success','failed','skipped'))
);

COMMENT ON TABLE public."generationLogs" IS 'Tracks autonomous content generation cycles from the Claude pipeline.';

CREATE INDEX IF NOT EXISTS idx_genlogs_node   ON public."generationLogs" (target_node);
CREATE INDEX IF NOT EXISTS idx_genlogs_status ON public."generationLogs" (status);

-- ─── Enable Realtime for traveler_tips ───────────────────────────────────────
-- (Required for UserTips component live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.traveler_tips;
