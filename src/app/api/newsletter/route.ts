import { NextRequest, NextResponse } from 'next/server';

// ─── Newsletter signup endpoint ─────────────────────────────────────────────
// Integration: Replace PROVIDER below with your actual email provider
// Options: Mailchimp, Brevo (formerly Sendinblue), ConvertKit, Resend, etc.

const RATE_LIMIT = new Map<string, number>(); // ip → timestamp, resets on cold start

export async function POST(req: NextRequest) {
  // Rate limit: 1 submission per IP per 60 seconds
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  const last = RATE_LIMIT.get(ip) ?? 0;
  if (now - last < 60_000) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  RATE_LIMIT.set(ip, now);

  let body: { email?: string; magnet?: string; destination?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { email, magnet, destination, locale } = body;

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // ── Option A: Brevo (recommended — free tier: 300 emails/day) ─────────────
  // const BREVO_API_KEY = process.env.BREVO_API_KEY;
  // if (BREVO_API_KEY) {
  //   await fetch('https://api.brevo.com/v3/contacts', {
  //     method: 'POST',
  //     headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       email,
  //       listIds: [2], // your list ID
  //       attributes: { DESTINATION: destination, MAGNET: magnet, LOCALE: locale },
  //       updateEnabled: true,
  //     }),
  //   });
  // }

  // ── Option B: Mailchimp ───────────────────────────────────────────────────
  // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  // const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
  // const MAILCHIMP_DC = process.env.MAILCHIMP_DC ?? 'us1';
  // if (MAILCHIMP_API_KEY && MAILCHIMP_LIST_ID) {
  //   await fetch(`https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       email_address: email,
  //       status: 'subscribed',
  //       tags: [magnet ?? 'general', destination ?? 'none'],
  //       merge_fields: { DESTINATION: destination ?? '', MAGNET: magnet ?? '' },
  //     }),
  //   });
  // }

  // ── Option C: Log to Supabase until email provider is configured ──────────
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from('newsletter_signups').insert({
      email,
      magnet,
      destination,
      locale,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Supabase table may not exist yet — fail silently in dev
    console.log('[newsletter] Supabase insert skipped — table may not exist yet');
  }

  console.log(`[newsletter] New signup: ${email} | magnet: ${magnet} | destination: ${destination}`);

  return NextResponse.json({
    success: true,
    message: `Thank you! Your guide is on the way.`,
  });
}
