import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  title: 'תוכן עשיר',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'בלוק',
      type: 'block',
      styles: [
        { title: 'רגיל', value: 'normal' },
        { title: 'כותרת 2', value: 'h2' },
        { title: 'כותרת 3', value: 'h3' },
        { title: 'כותרת 4', value: 'h4' },
        { title: 'ציטוט', value: 'blockquote' },
      ],
      lists: [
        { title: 'תבליטים', value: 'bullet' },
        { title: 'ממוספר', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'מודגש', value: 'strong' },
          { title: 'נטוי', value: 'em' },
          { title: 'קו תחתון', value: 'underline' },
          { title: 'קוד', value: 'code' },
        ],
        annotations: [
          {
            title: 'קישור',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'כתובת URL',
                name: 'href',
                type: 'url',
                validation: (rule) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ['https', 'http', 'mailto', 'tel'],
                  }),
              },
              {
                title: 'פתח בחלון חדש',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'תמונה',
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
  ],
})
