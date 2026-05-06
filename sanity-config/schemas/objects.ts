// schemas/objects.ts — All reusable Sanity object types for CYouInGreece
import { defineType, defineField, defineArrayMember } from 'sanity'

// ─── At A Glance ──────────────────────────────────────────────────────────────
export const atAGlanceSchema = defineType({
  name: 'atAGlance',
  type: 'object',
  title: 'At a Glance',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'best_months', type: 'array', title: 'Best months to visit',
      of: [defineArrayMember({
        type: 'string',
        options: { list: ['January','February','March','April','May','June','July','August','September','October','November','December'] },
      })],
      validation: R => R.min(1).max(4),
    }),
    defineField({
      name: 'crowd_level', type: 'string', title: 'Crowd level',
      options: { list: ['very_low','low','medium','high','very_high'], layout: 'radio' },
    }),
    defineField({
      name: 'avg_daily_budget', type: 'object', title: 'Average daily budget (€)',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'backpacker',  type: 'number', title: 'Backpacker (€/day)'  }),
        defineField({ name: 'comfortable', type: 'number', title: 'Comfortable (€/day)' }),
        defineField({ name: 'luxury',      type: 'number', title: 'Luxury (€/day)'      }),
      ],
    }),
    defineField({
      name: 'scores', type: 'object', title: 'Experience scores (1–5)',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'romance',   type: 'number', validation: R => R.min(1).max(5).integer() }),
        defineField({ name: 'adventure', type: 'number', validation: R => R.min(1).max(5).integer() }),
        defineField({ name: 'family',    type: 'number', validation: R => R.min(1).max(5).integer() }),
        defineField({ name: 'history',   type: 'number', validation: R => R.min(1).max(5).integer() }),
        defineField({ name: 'beaches',   type: 'number', validation: R => R.min(1).max(5).integer() }),
      ],
    }),
    defineField({ name: 'getting_there', type: 'text', title: 'How to get there', rows: 2 }),
  ],
})

// ─── Hidden Gem ───────────────────────────────────────────────────────────────
export const hiddenGemSchema = defineType({
  name: 'hiddenGem',
  type: 'object',
  title: 'Hidden Gem',
  icon: () => '💎',
  fields: [
    defineField({ name: 'title',       type: 'string', validation: R => R.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'image',       type: 'image', options: { hotspot: true } }),
    defineField({ name: 'verified',    type: 'boolean', title: 'Locally verified', initialValue: false }),
    defineField({ name: 'coordinates', type: 'geopoint' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'verified', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? '✅ Verified' : '🔴 Needs local check',
      media,
    }),
  },
})

// ─── Gastronomy Item ──────────────────────────────────────────────────────────
export const gastronomyItemSchema = defineType({
  name: 'gastronomyItem',
  type: 'object',
  title: 'Gastronomy item',
  icon: () => '🍽',
  fields: [
    defineField({ name: 'dish_name',    type: 'string', validation: R => R.required() }),
    defineField({ name: 'description',  type: 'text',   rows: 2 }),
    defineField({
      name: 'where_to_eat', type: 'string',
      description: 'Specific restaurant name + location (will be shown on map)',
    }),
    defineField({ name: 'maps_link',        type: 'url', title: 'Google Maps link' }),
    defineField({ name: 'image',            type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'needs_verification', type: 'boolean',
      title: 'Restaurant/location unverified',
      description: 'Flag if the restaurant details need a local expert check',
      initialValue: false,
    }),
    defineField({ name: 'google_place_id', type: 'string', title: 'Google Place ID (optional)' }),
  ],
  preview: {
    select: { title: 'dish_name', subtitle: 'where_to_eat', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
  },
})

// ─── Experience ───────────────────────────────────────────────────────────────
export const experienceSchema = defineType({
  name: 'experience',
  type: 'object',
  title: 'Experience',
  icon: () => '⭐',
  fields: [
    defineField({ name: 'title',       type: 'string', validation: R => R.required() }),
    defineField({ name: 'description', type: 'text',   rows: 3 }),
    defineField({ name: 'duration',    type: 'string', description: 'e.g. "2–3 hours", "Full day"' }),
    defineField({ name: 'booking_url', type: 'url', title: 'Booking URL (GetYourGuide / Viator)' }),
    defineField({ name: 'price_from',  type: 'number', title: 'Price from (€)' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'duration' },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
})

// ─── Practical Info ───────────────────────────────────────────────────────────
export const practicalInfoSchema = defineType({
  name: 'practicalInfo',
  type: 'object',
  title: 'Practical Info',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'accommodation_zones', type: 'text',  rows: 2, title: 'Where to stay' }),
    defineField({ name: 'transport_local',     type: 'text',  rows: 2, title: 'Getting around locally' }),
    defineField({ name: 'safety_tips',         type: 'text',  rows: 2 }),
    defineField({
      name: 'useful_phrases', type: 'array', title: 'Useful Greek phrases',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'emergency_numbers',  type: 'string', title: 'Emergency numbers' }),
    defineField({ name: 'currency_tips',      type: 'text',   rows: 2 }),
  ],
})

// ─── SEO Fields ───────────────────────────────────────────────────────────────
export const seoFieldsSchema = defineType({
  name: 'seoFields',
  type: 'object',
  title: 'SEO',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'meta_title', type: 'string',
      validation: R => R.max(60),
      description: 'Max 60 characters',
    }),
    defineField({
      name: 'meta_description', type: 'text', rows: 2,
      validation: R => R.max(160),
      description: 'Max 160 characters',
    }),
    defineField({ name: 'focus_keyword',      type: 'string' }),
    defineField({
      name: 'secondary_keywords', type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: R => R.max(8),
    }),
  ],
})

// ─── Translation Set ──────────────────────────────────────────────────────────
export const translationSetSchema = defineType({
  name: 'translationSet',
  type: 'object',
  title: 'Translations',
  fields: ['de','fr','it','es','ro','nl','no','sv','da','fi','el'].map(lang =>
    defineField({
      name: lang, title: lang.toUpperCase(), type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'tagline',          type: 'string' }),
        defineField({ name: 'intro_paragraph',  type: 'text', rows: 4 }),
        defineField({ name: 'meta_title',       type: 'string' }),
        defineField({ name: 'meta_description', type: 'text', rows: 2 }),
        defineField({ name: 'body_content',     type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
        defineField({ name: 'diary_entries',    type: 'array', of: [{ type: 'nikosDiaryEntry' }] }),
        defineField({ name: 'thematic_sections', type: 'array', of: [{
          type: 'object',
          name: 'translatedSection',
          fields: [
            defineField({ name: '_key', type: 'string' }),
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'content', type: 'array', of: [{ type: 'block' }] })
          ]
        }] }),
        defineField({
          name: 'ai_translated', type: 'boolean',
          title: 'AI translated (not human-checked)',
          initialValue: true,
        }),
      ],
    })
  ),
})

// ─── Nikos' Tip (Portable Text block type) ────────────────────────────────────
export const nikosTipSchema = defineType({
  name: 'nikosTip',
  type: 'object',
  title: "Nikos' Tip",
  icon: () => '💡',
  fields: [
    defineField({ name: 'tip', type: 'text', rows: 2, validation: R => R.required() }),
    defineField({
      name: 'category', type: 'string',
      options: {
        list: ['food','transport','timing','money','local_custom','hidden'],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: { title: 'tip' },
    prepare: ({ title }) => ({ title: `💡 ${title?.slice(0, 50) ?? ''}…` }),
  },
})

// ─── Info Box (Portable Text block type) ─────────────────────────────────────
export const infoBoxSchema = defineType({
  name: 'infoBox',
  type: 'object',
  title: 'Info Box',
  icon: () => 'ℹ️',
  fields: [
    defineField({ name: 'title', type: 'string', validation: R => R.required() }),
    defineField({ name: 'body',  type: 'text',   rows: 3, validation: R => R.required() }),
    defineField({
      name: 'tone', type: 'string',
      options: { list: ['info','warning','pro_tip','warning'], layout: 'radio' },
      initialValue: 'info',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'tone' },
  },
})

// ─── Nikos' Diary Entry (For the new Diary of Nikos feature) ──────────────────
export const nikosDiaryEntrySchema = defineType({
  name: 'nikosDiaryEntry',
  type: 'object',
  title: "Nikos Diary Entry",
  icon: () => '📓',
  fields: [
    defineField({ name: 'location', type: 'string', title: 'Specific Location (e.g. Panormos Beach)', validation: R => R.required() }),
    defineField({ name: 'title', type: 'string', title: 'Catchy Diary Title', validation: R => R.required() }),
    defineField({ 
      name: 'body', 
      type: 'array', 
      title: 'Diary Entry Content', 
      of: [{ type: 'block' }],
      validation: R => R.required() 
    }),
    defineField({ name: 'image', type: 'image', title: 'Diary Image', options: { hotspot: true } }),
    defineField({ name: 'verdict', type: 'string', title: 'The Verdict (TL;DR tip)' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({ title: `📓 ${title}`, subtitle, media }),
  },
})
