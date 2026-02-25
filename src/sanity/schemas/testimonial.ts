import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'testimonial',
  title: 'המלצה',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'name',
      title: 'שם',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'business',
      title: 'עסק',
      type: 'string',
    }),
    defineField({
      name: 'quote',
      title: 'ציטוט',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'תמונה',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'rating',
      title: 'דירוג',
      type: 'number',
      validation: (rule) => rule.min(1).max(5).integer(),
    }),
    defineField({
      name: 'url',
      title: 'קישור לאתר',
      type: 'url',
    }),
    orderRankField({ type: 'testimonial' }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'business',
      media: 'image',
    },
  },
})
