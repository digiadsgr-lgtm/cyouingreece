import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/revalidate
 *
 * Called by Sanity webhook when a destination document is updated.
 * Validates the shared secret, then invalidates the ISR cache for that slug.
 *
 * Expected payload:
 * {
 *   "slug": "santorini",
 *   "secret": "<SANITY_WEBHOOK_SECRET>"
 * }
 *
 * Sanity webhook config:
 *   URL: https://cyouingreece.com/api/revalidate
 *   HTTP Method: POST
 *   Secret Header: x-sanity-secret: <SANITY_WEBHOOK_SECRET>
 *   Filter: _type == "destination"
 *   Projection: { "slug": slug.current }
 */
export async function POST(req: NextRequest) {
  // Validate shared secret (from header or body)
  const secret =
    req.headers.get('x-sanity-secret') ??
    (await req.json().then((b: any) => b?.secret).catch(() => null));

  const expectedSecret = process.env.SANITY_WEBHOOK_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Extract slug from header or body
  let slug: string | null = null;
  try {
    const text = await req.text();
    if (text) {
      const body = JSON.parse(text);
      slug = body?.slug ?? null;
    }
  } catch {
    // Secret-only ping — revalidate all destinations (broad tag)
  }

  if (slug) {
    // Targeted: revalidate only this destination
    revalidateTag(`destination-${slug}`, 'max');
    console.log(`[revalidate] Tag invalidated: destination-${slug}`);
  } else {
    // Broad: Sanity published something without a slug — revalidate all
    revalidateTag('destinations', 'max');
    console.log('[revalidate] Broad tag invalidated: destinations');
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? 'all', time: Date.now() });
}

// Allow GET for manual curl testing with ?secret=...&slug=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (!process.env.SANITY_WEBHOOK_SECRET || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (slug) {
    revalidateTag(`destination-${slug}`, 'max');
  } else {
    revalidateTag('destinations', 'max');
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? 'all' });
}
