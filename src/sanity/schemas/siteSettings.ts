import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'הגדרות האתר',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'siteName',
      title: 'שם האתר',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'תיאור האתר',
      type: 'text',
    }),
    defineField({
      name: 'logo',
      title: 'לוגו',
      type: 'image',
    }),
    defineField({
      name: 'phone',
      title: 'טלפון',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'אימייל',
      type: 'string',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'מספר WhatsApp',
      type: 'string',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'אינסטגרם',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'פייסבוק',
      type: 'url',
    }),
    defineField({
      name: 'address',
      title: 'כתובת',
      type: 'text',
    }),
    defineField({
      name: 'responseTime',
      title: 'זמן תגובה',
      type: 'string',
      initialValue: 'אנחנו מגיבים לפניות תוך 24 שעות בימי עסקים',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'הגדרות האתר',
      }
    },
  },
})
