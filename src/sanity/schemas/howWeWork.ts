import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'howWeWork',
  title: 'איך אנחנו עובדים',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'stepNumber',
      title: 'מספר שלב',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'כותרת',
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
      name: 'animationPath',
      title: 'נתיב אנימציה',
      type: 'string',
      description: 'נתיב לקובץ JSON של אנימציית Lottie',
    }),
    orderRankField({ type: 'howWeWork' }),
  ],
  preview: {
    select: {
      stepNumber: 'stepNumber',
      title: 'title',
    },
    prepare({ stepNumber, title }) {
      return {
        title: `${stepNumber} — ${title}`,
      }
    },
  },
})
