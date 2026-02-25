import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'whyUs',
  title: 'למה אנחנו',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
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
      name: 'lottieAnimation',
      title: 'נתיב אנימציית Lottie',
      type: 'string',
      description: 'נתיב לקובץ JSON של האנימציה',
    }),
    defineField({
      name: 'color',
      title: 'צבע',
      type: 'string',
      options: {
        list: [
          { title: 'כתום', value: 'orange' },
          { title: 'טרקוטה', value: 'terracotta' },
          { title: 'ירוק-אפור', value: 'sage' },
        ],
        layout: 'radio',
      },
    }),
    orderRankField({ type: 'whyUs' }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
