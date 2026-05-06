// schemas/article.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const articleSchema = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: () => '📰',
  fields: [
    defineField({ name: 'title',     type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug',      type: 'slug', options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'excerpt',   type: 'text',   rows: 3 }),
    defineField({ name: 'body',      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({ type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'related_destinations', type: 'array', title: 'Related destinations',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'destination' }] })],
    }),
    defineField({ name: 'hero_image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'author',    type: 'reference', to: [{ type: 'contributor' }] }),
    defineField({ name: 'published_at', type: 'datetime' }),
    defineField({ name: 'category', type: 'string',
      options: { list: ['destinations', 'mountain', 'sea', 'culture', 'gastronomy'] },
      validation: R => R.required()
    }),
    defineField({ name: 'seo', type: 'seoFields' }),
    defineField({ name: 'translations', type: 'translationSet' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'hero_image' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
  },
})
