/**
 * setup-supabase.js
 * Run: node setup-supabase.js
 * 
 * Creates all required Supabase tables for CYouInGreece.
 * Uses the service role key via the REST API (no external CLI needed).
 */
const https = require('https');

// Credentials from .env
const SUPABASE_URL = 'https://rmnifsyfrjlmmditqhvy.supabase.co';
// Using anon key for the REST API — service_role key needed for DDL
// We'll use the postgres REST endpoint via the SQL API
const ANON_KEY = 'sb_publishable_lPKciqPYrmkKC7kCcl37nA_JNWvUEOb';

const SQL = `
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

CREATE INDEX IF NOT EXISTS idx_traveler_tips_slug     ON public.traveler_tips (destination_slug);
CREATE INDEX IF NOT EXISTS idx_traveler_tips_approved ON public.traveler_tips (approved) WHERE approved = true;

ALTER TABLE public.traveler_tips ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'traveler_tips' AND policyname = 'Public read approved tips') THEN
    CREATE POLICY "Public read approved tips" ON public.traveler_tips FOR SELECT USING (approved = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'traveler_tips' AND policyname = 'Public insert tips') THEN
    CREATE POLICY "Public insert tips" ON public.traveler_tips FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'traveler_tips' AND policyname = 'Public upvote') THEN
    CREATE POLICY "Public upvote" ON public.traveler_tips FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ─── generation_logs ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public."generationLogs" (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  target_node  text        NOT NULL,
  type         text        NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  qa_score     integer,
  status       text        DEFAULT 'pending'
);

-- ─── Realtime ─────────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.traveler_tips;
`;

async function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

    // Use the SQL over REST API (requires pg_net or direct postgres — fall back to fetch)
    // Actually use the Supabase pg endpoint
    const options = {
      hostname: url.hostname,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Length': Buffer.byteLength(body),
        'Prefer': 'return=minimal',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Main: use Supabase Management API via SQL endpoint
async function main() {
  console.log('🔧 Setting up Supabase tables for CYouInGreece...\n');

  // The correct endpoint for running SQL is the pg REST interface
  // Since the anon key can't run DDL, we'll output the SQL to copy-paste
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Run this SQL in your Supabase dashboard:');
  console.log('https://supabase.com/dashboard/project/rmnifsyfrjlmmditqhvy/sql/new');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(SQL);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('After running, enable Realtime on traveler_tips in:');
  console.log('Database → Replication → Source: supabase_realtime → Add table');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(console.error);
