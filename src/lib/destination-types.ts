// ─── Destination Types ─────────────────────────────────────────────────────────
// Full TypeScript interfaces matching the Sanity CMS destination schema.

export type DestinationType =
  | 'island'
  | 'city'
  | 'village'
  | 'archaeological_site'
  | 'mountain'
  | 'peninsula'
  | 'lake';

export type CrowdLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export interface SanityImageHotspot {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface SanityImageCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  caption?: string;
  credit?: string;
  location?: string;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface Region {
  _id: string;
  slug: { current: string };
  name: string;
  name_local: string;
}

export interface BudgetTiers {
  backpacker: number;
  comfortable: number;
  luxury: number;
}

export interface DestinationScores {
  romance: number; // 1–5
  adventure: number;
  family: number;
  history: number;
  beaches: number;
}

export interface AtAGlance {
  best_months: string[];
  avg_daily_budget: BudgetTiers;
  crowd_level: CrowdLevel;
  scores: DestinationScores;
  getting_there: string;
}

export interface HiddenGem {
  title: string;
  description: string;
  image?: SanityImage;
}

export interface GastronomyItem {
  dish_name: string;
  description: string;
  where_to_eat: string;
  image?: SanityImage;
  maps_link?: string;
}

export interface TopExperience {
  title: string;
  duration: string;
  description: string;
  booking_url?: string;
}

export interface PracticalInfo {
  accommodation_zones: string;
  transport_local: string;
  safety_tips: string;
  useful_phrases: string[];
}

export interface DestinationSEO {
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  secondary_keywords: string[];
}

export interface DestinationTranslations {
  de?: Partial<DestinationTranslatableFields>;
  fr?: Partial<DestinationTranslatableFields>;
  it?: Partial<DestinationTranslatableFields>;
  es?: Partial<DestinationTranslatableFields>;
  ro?: Partial<DestinationTranslatableFields>;
  pl?: Partial<DestinationTranslatableFields>;
  ru?: Partial<DestinationTranslatableFields>;
  el?: Partial<DestinationTranslatableFields>;
}

export interface DestinationTranslatableFields {
  tagline: string;
  intro_paragraph: string;
  // body_content is portableText — kept as unknown[] for flexibility
}

export interface NearbyDestination {
  _id: string;
  slug: { current: string };
  name_en: string;
  name_local: string;
  hero_image: SanityImage;
  type: DestinationType;
  region: Region;
  travel_time?: string;
}

export interface EditorialArticle {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  hero_image?: SanityImage;
  published_at?: string;
  author?: string;
}

export interface ThematicSection {
  _key: string;
  category: 'Nature' | 'History' | 'Culture' | 'Gastronomy' | 'Activities' | 'Churches' | 'Museums' | 'Entertainment' | 'Secrets';
  title: string;
  content: any[]; // Portable Text
  hero_image?: SanityImage;
}

// ─── Main Destination Document ────────────────────────────────────────────────

export interface Destination {
  _id: string;
  _rev: string;
  slug: { current: string };
  name_local: string;
  name_en: string;
  translations: DestinationTranslations;
  region: Region;
  type: DestinationType;
  coordinates: GeoCoordinates;
  hero_image: SanityImage;
  gallery: SanityImage[];
  tagline: string;
  intro_paragraph: string;
  body_content: unknown[]; // Portable Text blocks
  thematic_sections?: ThematicSection[];
  diary_entries?: any[]; // The Diary of Nikos entries
  at_a_glance: AtAGlance;
  youtube_video_url?: string;
  hidden_gems: HiddenGem[];
  gastronomy: GastronomyItem[];
  top_experiences: TopExperience[];
  practical_info: PracticalInfo;
  nearby_destinations: NearbyDestination[];
  seo: DestinationSEO;
  events_feed_query: string;
  last_reviewed: string;
  reviewed_by: string;
  ai_generated: boolean;
  editor_approved: boolean;
}

// ─── Weather API ──────────────────────────────────────────────────────────────

export interface WeatherDay {
  date: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
}

export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    description: string;
    icon: string;
    humidity: number;
    wind_speed: number;
  };
  forecast: WeatherDay[];
}

// ─── Events ───────────────────────────────────────────────────────────────────

export interface LocalEvent {
  name: string;
  date: string;
  category: 'festival' | 'music' | 'cultural' | 'religious' | 'other';
  link?: string;
  location?: string;
}

// ─── Map Pin ──────────────────────────────────────────────────────────────────

export type MapPinCategory =
  | 'beach'
  | 'restaurant'
  | 'viewpoint'
  | 'accommodation'
  | 'hidden_gem';

export interface MapPin {
  id: string;
  category: MapPinCategory;
  lat: number;
  lng: number;
  name: string;
  description?: string;
  thumbnail?: string;
  link?: string;
}
