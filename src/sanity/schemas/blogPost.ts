import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'פוסט בבלוג',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'כותרת',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'תקציר',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'תוכן',
      type: 'blockContent',
    }),
    defineField({
      name: 'featuredImage',
      title: 'תמונה ראשית',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'טקסט חלופי',
          description: 'חשוב לנגישות ו-SEO',
        },
      ],
    }),
    defineField({
      name: 'author',
      title: 'כותב',
      type: 'string',
      initialValue: 'MediaWave',
    }),
    defineField({
      name: 'tags',
      title: 'תגיות',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'תאריך פרסום',
      type: 'datetime',
    }),
    defineField({
      name: 'published',
      title: 'מפורסם',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'featuredImage',
    },
  },
})
