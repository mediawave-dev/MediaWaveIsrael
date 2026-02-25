import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'faq',
  title: 'שאלה נפוצה',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'question',
      title: 'שאלה',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'תשובה',
      type: 'blockContent',
    }),
    orderRankField({ type: 'faq' }),
  ],
  preview: {
    select: {
      title: 'question',
    },
  },
})
