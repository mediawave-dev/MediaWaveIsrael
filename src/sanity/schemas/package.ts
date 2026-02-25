import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'package',
  title: 'חבילה',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'name',
      title: 'שם החבילה',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'מחיר',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'תיאור קצר',
      type: 'string',
    }),
    defineField({
      name: 'features',
      title: 'מה כולל',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'idealFor',
      title: 'מתאים ל',
      type: 'string',
    }),
    defineField({
      name: 'cta',
      title: 'טקסט כפתור',
      type: 'string',
      initialValue: 'בואו נדבר',
    }),
    defineField({
      name: 'ctaLink',
      title: 'קישור כפתור',
      type: 'string',
      initialValue: '#contact',
    }),
    defineField({
      name: 'popular',
      title: 'חבילה מומלצת',
      type: 'boolean',
      initialValue: false,
    }),
    orderRankField({ type: 'package' }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
    },
  },
})
