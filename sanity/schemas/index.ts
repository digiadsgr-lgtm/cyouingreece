// schemas/index.ts — Barrel export for all Sanity schema types
export { destinationSchema } from './destination'
export { regionSchema      } from './region'
export { articleSchema     } from './article'
export { contributorSchema } from './contributor'
export { thematicSectionSchema } from './thematicSection'
export { default as journeySchema } from './journeySchema'

// Object types
export {
  atAGlanceSchema,
  hiddenGemSchema,
  gastronomyItemSchema,
  experienceSchema,
  practicalInfoSchema,
  seoFieldsSchema,
  translationSetSchema,
  nikosTipSchema,
  infoBoxSchema,
} from './objects'
