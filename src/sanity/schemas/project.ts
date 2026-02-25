import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'project',
  title: 'פרויקט',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'שם הפרויקט',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'סוג',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'תיאור',
      type: 'text',
    }),
    defineField({
      name: 'url',
      title: 'קישור לאתר',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'תמונת מסך',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'טקסט חלופי',
        },
      ],
    }),
    defineField({
      name: 'imageMobile',
      title: 'תמונת מסך - מובייל',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'טקסט חלופי',
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'תגיות',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'features',
      title: "פיצ'רים",
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'featured',
      title: 'מוצג בעמוד הראשי',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'selfLink',
      title: 'קישור פנימי',
      type: 'boolean',
      initialValue: false,
    }),
    orderRankField({ type: 'project' }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'image',
    },
  },
})
