import { sanityClient } from './sanity';
import type { Destination, NearbyDestination, EditorialArticle } from './destination-types';

// ─── Image projection (always include LQIP + dimensions) ─────────────────────

const IMAGE_PROJECTION = `{
  _type,
  asset->{
    _ref,
    url,
    metadata {
      lqip,
      dimensions { width, height, aspectRatio }
    }
  },
  hotspot,
  crop,
  caption,
  credit,
  location
}`;

// ─── Full destination document query ─────────────────────────────────────────

export const destinationBySlugQuery = (slug: string, locale = 'en') => `
  *[_type == "destination" && slug.current == "${slug}"][0] {
    _id,
    _rev,
    slug,
    name_local,
    name_en,
    translations,
    region-> {
      _id,
      slug,
      name,
      name_local
    },
    type,
    coordinates,
    hero_image ${IMAGE_PROJECTION},
    gallery[] ${IMAGE_PROJECTION},
    tagline,
    intro_paragraph,
    body_content,
    thematic_sections[] {
      _key,
      category,
      title,
      content,
      hero_image ${IMAGE_PROJECTION}
    },
    diary_entries[] {
      _key,
      location,
      title,
      verdict,
      body,
      image ${IMAGE_PROJECTION}
    },
    at_a_glance {
      best_months,
      avg_daily_budget,
      crowd_level,
      scores,
      getting_there
    },
    hidden_gems[] {
      title,
      description,
      image ${IMAGE_PROJECTION}
    },
    gastronomy[] {
      dish_name,
      description,
      where_to_eat,
      image ${IMAGE_PROJECTION},
      maps_link
    },
    top_experiences[] {
      title,
      duration,
      description,
      booking_url
    },
    practical_info {
      accommodation_zones,
      transport_local,
      safety_tips,
      useful_phrases
    },
    nearby_destinations[]-> {
      _id,
      slug,
      name_en,
      name_local,
      hero_image ${IMAGE_PROJECTION},
      type,
      region-> { name }
    },
    seo {
      meta_title,
      meta_description,
      focus_keyword,
      secondary_keywords
    },
    events_feed_query,
    last_reviewed,
    reviewed_by,
    ai_generated,
    editor_approved
  }
`;

// ─── All slugs for generateStaticParams ──────────────────────────────────────

export const allDestinationSlugsQuery = `
  *[_type == "destination" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// ─── Editorial articles tagged with destination slug ──────────────────────────

export const editorialArticlesQuery = (destinationSlug: string) => `
  *[_type == "article" && references(*[_type == "destination" && slug.current == "${destinationSlug}"]._id)] | order(published_at desc)[0...6] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    translations,
    hero_image ${IMAGE_PROJECTION},
    published_at,
    "author": author->name
  }
`;

// ─── Fetch helpers ────────────────────────────────────────────────────────────

export async function fetchDestination(slug: string, locale = 'en'): Promise<Destination | null> {
  try {
    const data = await sanityClient.fetch(
      destinationBySlugQuery(slug, locale),
      {},
      { next: { tags: [`destination-${slug}`], revalidate: 86400 } }
    );
    return data ?? null;
  } catch (err) {
    console.error('[fetchDestination]', err);
    return null;
  }
}

export async function fetchAllDestinationSlugs(): Promise<string[]> {
  try {
    const data = await sanityClient.fetch<{ slug: string }[]>(
      allDestinationSlugsQuery,
      {},
      { cache: 'force-cache' }
    );
    return data.map((d) => d.slug);
  } catch (err) {
    console.error('[fetchAllDestinationSlugs]', err);
    return [];
  }
}

export async function fetchEditorialArticles(destinationSlug: string): Promise<EditorialArticle[]> {
  try {
    const data = await sanityClient.fetch<EditorialArticle[]>(
      editorialArticlesQuery(destinationSlug),
      {},
      { next: { tags: [`destination-${destinationSlug}`], revalidate: 86400 } }
    );
    return data ?? [];
  } catch (err) {
    console.error('[fetchEditorialArticles]', err);
    return [];
  }
}
