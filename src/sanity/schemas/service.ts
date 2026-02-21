import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'service',
  title: 'שירות',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'שם השירות',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'תיאור',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lottieAnimation',
      title: 'נתיב אנימציית Lottie',
      type: 'string',
      description: 'נתיב לקובץ JSON של האנימציה, לדוגמה: /animations/1/web-design.json',
    }),
    defineField({
      name: 'lottieSize',
      title: 'גודל אנימציה',
      type: 'number',
      initialValue: 128,
    }),
    defineField({
      name: 'tags',
      title: 'תגיות',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    orderRankField({ type: 'service' }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
