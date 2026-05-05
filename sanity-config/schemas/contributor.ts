// schemas/contributor.ts
import { defineType, defineField } from 'sanity'

export const contributorSchema = defineType({
  name: 'contributor',
  title: 'Contributor',
  type: 'document',
  icon: () => '✍️',
  fields: [
    defineField({ name: 'name',      type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug',      type: 'slug', options: { source: 'name' }, validation: R => R.required() }),
    defineField({ name: 'bio',       type: 'text', rows: 3 }),
    defineField({ name: 'avatar',    type: 'image', options: { hotspot: true } }),
    defineField({ name: 'role',      type: 'string',
      options: { list: ['editor','local_expert','photographer','writer','ai_reviewer'] },
    }),
    defineField({ name: 'location',  type: 'string', description: 'Where they are based in Greece' }),
    defineField({ name: 'expertise', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'avatar' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
  },
})
