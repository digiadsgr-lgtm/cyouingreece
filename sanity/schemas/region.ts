// schemas/region.ts
import { defineType, defineField } from 'sanity'

export const regionSchema = defineType({
  name: 'region',
  title: 'Region',
  type: 'document',
  icon: () => '🗺',
  fields: [
    defineField({ name: 'name',        type: 'string',  title: 'Region name (EN)', validation: R => R.required() }),
    defineField({ name: 'name_el',     type: 'string',  title: 'Greek name' }),
    defineField({ name: 'slug',        type: 'slug',    options: { source: 'name' }, validation: R => R.required() }),
    defineField({ name: 'description', type: 'text',    rows: 3 }),
    defineField({ name: 'hero_image',  type: 'image',   options: { hotspot: true } }),
    defineField({ name: 'coordinates', type: 'geopoint', title: 'Region centre' }),
    defineField({
      name: 'highlights', type: 'array',
      of: [{ type: 'string' }],
      title: 'Key highlights',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'hero_image' },
    prepare: ({ title, media }) => ({ title, media }),
  },
})
