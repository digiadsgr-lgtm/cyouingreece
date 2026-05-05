import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'journey',
  title: 'Curated Journey',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration_days',
      title: 'Duration (Days)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'islands_count',
      title: 'Number of Islands',
      type: 'number',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero_image',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'itinerary',
      title: 'Daily Itinerary',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', type: 'number', title: 'Day Number' },
            { name: 'location', type: 'string', title: 'Location' },
            { name: 'description', type: 'text', title: 'Description' },
          ],
        },
      ],
    }),
  ],
});
