import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import {
  destinationSchema,
  regionSchema,
  articleSchema,
  contributorSchema,
  atAGlanceSchema,
  hiddenGemSchema,
  gastronomyItemSchema,
  experienceSchema,
  practicalInfoSchema,
  seoFieldsSchema,
  translationSetSchema,
  nikosTipSchema,
  infoBoxSchema,
} from './schemas'

export default defineConfig({
  name:      'cyouingreece-studio',
  title:     'CYouInGreece',
  projectId: process.env.SANITY_PROJECT_ID || 'sntl6fxn',
  dataset:   'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('CYouInGreece')
          .items([
            // ── Editorial workflow queues ─────────────────────────────────
            S.listItem()
              .title('🔴 Needs review')
              .child(
                S.documentList()
                  .title('Needs review')
                  .filter('_type == "destination" && review_status == "needs_review"')
                  .defaultOrdering([{ field: 'qa_score', direction: 'asc' }])
              ),

            S.listItem()
              .title('📍 Local check needed')
              .child(
                S.documentList()
                  .title('Local check')
                  .filter('_type == "destination" && review_status == "local_check"')
              ),

            S.listItem()
              .title('🔍 In review')
              .child(
                S.documentList()
                  .title('In review')
                  .filter('_type == "destination" && review_status == "in_review"')
              ),

            S.listItem()
              .title('✅ Approved (ready to publish)')
              .child(
                S.documentList()
                  .title('Approved')
                  .filter('_type == "destination" && review_status == "approved"')
                  .defaultOrdering([{ field: 'name_en', direction: 'asc' }])
              ),

            S.listItem()
              .title('🌐 Published')
              .child(
                S.documentList()
                  .title('Published')
                  .filter('_type == "destination" && review_status == "published"')
                  .defaultOrdering([{ field: 'name_en', direction: 'asc' }])
              ),

            S.listItem()
              .title('🤖 AI draft')
              .child(
                S.documentList()
                  .title('AI drafts')
                  .filter('_type == "destination" && review_status == "ai_draft"')
              ),

            S.listItem()
              .title('🗺 All destinations')
              .child(
                S.documentList()
                  .title('All destinations')
                  .filter('_type == "destination"')
                  .defaultOrdering([{ field: 'name_en', direction: 'asc' }])
              ),

            S.divider(),

            // ── Content ───────────────────────────────────────────────────
            S.listItem()
              .title('📰 Articles')
              .child(S.documentList().filter('_type == "article"').defaultOrdering([{ field: 'published_at', direction: 'desc' }])),

            S.listItem()
              .title('🗺 Regions')
              .child(S.documentList().filter('_type == "region"').defaultOrdering([{ field: 'name', direction: 'asc' }])),

            S.listItem()
              .title('✍ Contributors')
              .child(S.documentList().filter('_type == "contributor"').defaultOrdering([{ field: 'name', direction: 'asc' }])),
          ]),
    }),

    visionTool(), // GROQ query tester — remove in production if needed
  ],

  schema: {
    types: [
      // Documents
      destinationSchema,
      regionSchema,
      articleSchema,
      contributorSchema,
      // Object types
      atAGlanceSchema,
      hiddenGemSchema,
      gastronomyItemSchema,
      experienceSchema,
      practicalInfoSchema,
      seoFieldsSchema,
      translationSetSchema,
      nikosTipSchema,
      infoBoxSchema,
    ],
  },
})
