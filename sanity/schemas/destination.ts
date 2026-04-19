// schemas/destination.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const destinationSchema = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  icon: () => '🗺',
  groups: [
    { name: 'content',   title: 'Content',       default: true },
    { name: 'media',     title: 'Media'                        },
    { name: 'practical', title: 'Practical info'               },
    { name: 'seo',       title: 'SEO & i18n'                   },
    { name: 'workflow',  title: 'Workflow'                      },
  ],
  fields: [
    // ── IDENTITY ──────────────────────────────────────────────────────────────
    defineField({
      name: 'slug', type: 'slug', title: 'URL slug',
      options: { source: 'name_en', maxLength: 96 },
      validation: R => R.required(),
      group: 'content',
    }),
    defineField({ name: 'name_en',    type: 'string', title: 'English name',  validation: R => R.required(), group: 'content' }),
    defineField({ name: 'name_local', type: 'string', title: 'Greek name (local)', group: 'content' }),
    defineField({ name: 'region',     type: 'reference', to: [{ type: 'region' }], group: 'content' }),
    defineField({
      name: 'type', type: 'string', title: 'Destination type',
      options: { list: ['island','city','village','archaeological_site','mountain','peninsula','beach'], layout: 'radio' },
      group: 'content',
    }),
    defineField({ name: 'coordinates', type: 'geopoint', group: 'content' }),

    // ── CONTENT ───────────────────────────────────────────────────────────────
    defineField({
      name: 'tagline', type: 'string', title: 'Tagline',
      description: 'Max 12 words. No clichés. Make it punchy.',
      validation: R => R.max(80),
      group: 'content',
    }),
    defineField({ name: 'intro_paragraph', type: 'text', title: 'Intro paragraph', rows: 5, group: 'content' }),
    defineField({
      name: 'body_content', type: 'array', title: 'Full editorial content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal',     value: 'normal'     },
            { title: 'H2',         value: 'h2'         },
            { title: 'H3',         value: 'h3'         },
            { title: 'Blockquote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Em',     value: 'em'     },
            ],
          },
        }),
        defineArrayMember({ type: 'nikosTip'  }),
        defineArrayMember({ type: 'infoBox'   }),
        defineArrayMember({ type: 'image', options: { hotspot: true } }),
      ],
      group: 'content',
    }),

    // ── RICH DATA ─────────────────────────────────────────────────────────────
    defineField({ name: 'at_a_glance', type: 'atAGlance', group: 'content' }),
    defineField({
      name: 'hidden_gems', type: 'array', title: 'Hidden gems',
      of: [defineArrayMember({ type: 'hiddenGem' })],
      validation: R => R.length(3),
      group: 'content',
    }),
    defineField({
      name: 'gastronomy', type: 'array', title: 'Gastronomy spotlight',
      of: [defineArrayMember({ type: 'gastronomyItem' })],
      validation: R => R.length(3),
      group: 'content',
    }),
    defineField({
      name: 'top_experiences', type: 'array', title: 'Top experiences',
      of: [defineArrayMember({ type: 'experience' })],
      validation: R => R.min(3).max(5),
      group: 'content',
    }),

    // ── PRACTICAL ─────────────────────────────────────────────────────────────
    defineField({ name: 'practical_info', type: 'practicalInfo', group: 'practical' }),
    defineField({
      name: 'nearby_destinations', type: 'array', title: 'Nearby destinations',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'destination' }] })],
      validation: R => R.min(2).max(5),
      group: 'practical',
    }),
    defineField({
      name: 'events_feed_query', type: 'string',
      title: 'Events feed search term',
      description: 'Google Events / Ticketmaster API search term for this destination',
      group: 'practical',
    }),

    // ── MEDIA ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'hero_image', type: 'image', title: 'Hero image',
      options: { hotspot: true },
      validation: R => R.required(),
      group: 'media',
      fields: [
        defineField({ name: 'caption', type: 'string' }),
        defineField({ name: 'credit',  type: 'string', title: 'Photo credit' }),
      ],
    }),
    defineField({
      name: 'gallery', type: 'array', title: 'Photo gallery',
      of: [defineArrayMember({
        type: 'image', options: { hotspot: true },
        fields: [
          defineField({ name: 'caption',  type: 'string' }),
          defineField({ name: 'credit',   type: 'string' }),
          defineField({ name: 'location', type: 'string' }),
        ],
      })],
      validation: R => R.min(8).max(20),
      group: 'media',
    }),
    defineField({
      name: 'food_images', type: 'array', title: 'Food images (AI generated)',
      of: [defineArrayMember({ type: 'image' })],
      group: 'media',
    }),

    // ── SEO + TRANSLATIONS ────────────────────────────────────────────────────
    defineField({ name: 'seo',          type: 'seoFields',      group: 'seo' }),
    defineField({ name: 'translations', type: 'translationSet', group: 'seo' }),

    // ── WORKFLOW ──────────────────────────────────────────────────────────────
    defineField({
      name: 'review_status', type: 'string', title: 'Review status',
      options: {
        list: ['ai_draft','needs_review','in_review','local_check','approved','published'],
        layout: 'radio',
      },
      initialValue: 'ai_draft',
      group: 'workflow',
    }),
    defineField({ name: 'ai_generated',       type: 'boolean', title: 'AI generated',        initialValue: false, group: 'workflow' }),
    defineField({
      name: 'needs_verification', type: 'array', title: 'Fields needing verification',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Auto-set by content pipeline',
      group: 'workflow',
    }),
    defineField({ name: 'qa_score',        type: 'number',  title: 'QA score (0–100)', readOnly: true,  group: 'workflow' }),
    defineField({
      name: 'qa_issues', type: 'array', title: 'QA issues',
      of: [defineArrayMember({ type: 'string' })], readOnly: true,
      group: 'workflow',
    }),
    defineField({ name: 'editor_approved', type: 'boolean', title: 'Editor approved', initialValue: false, group: 'workflow' }),
    defineField({ name: 'local_verified',  type: 'boolean', title: 'Local expert verified', initialValue: false, group: 'workflow' }),
    defineField({
      name: 'reviewed_by', type: 'reference', title: 'Reviewed by',
      to: [{ type: 'contributor' }],
      group: 'workflow',
    }),
    defineField({ name: 'review_notes', type: 'text', title: 'Editor notes', rows: 3, group: 'workflow' }),
    defineField({ name: 'last_reviewed', type: 'date', title: 'Last reviewed', group: 'workflow' }),
  ],
  preview: {
    select: {
      title:    'name_en',
      subtitle: 'review_status',
      media:    'hero_image',
    },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ?? 'ai_draft',
      media,
    }),
  },
})
