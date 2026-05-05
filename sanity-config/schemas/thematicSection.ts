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
          { title: 'Nature & Geography', value: 'Nature' },
          { title: 'Beaches', value: 'Beaches' },
          { title: 'History & Mythology', value: 'History' },
          { title: 'Culture & Traditions', value: 'Culture' },
          { title: 'Gastronomy & Local Products', value: 'Gastronomy' },
          { title: 'Athletics & Activities', value: 'Activities' },
          { title: 'Hiking & Trails', value: 'Hiking' },
          { title: 'Mountaineering', value: 'Mountaineering' },
          { title: 'Churches & Religion', value: 'Churches' },
          { title: 'Museums & Archaeology', value: 'Museums' },
          { title: 'Entertainment & Nightlife', value: 'Entertainment' },
          { title: 'Local Secrets', value: 'Secrets' },
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
