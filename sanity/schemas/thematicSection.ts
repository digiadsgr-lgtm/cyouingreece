import { defineType, defineField } from 'sanity'

export const thematicSectionSchema = defineType({
  name: 'thematicSection',
  title: 'Thematic Section',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Gastronomy', value: 'Gastronomy' },
          { title: 'Culture', value: 'Culture' },
          { title: 'Churches & Religion', value: 'Churches' },
          { title: 'Museums & History', value: 'Museums' },
          { title: 'Entertainment & Nightlife', value: 'Entertainment' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'A catchy, editorial title for this section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Editorial Content',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero_image',
      type: 'image',
      title: 'Hero Image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
        defineField({ name: 'credit', type: 'string', title: 'Credit' })
      ],
      validation: (Rule) => Rule.required(),
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'hero_image',
    }
  }
});
