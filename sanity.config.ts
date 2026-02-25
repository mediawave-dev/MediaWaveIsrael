import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import {
  ThLargeIcon,
  DocumentTextIcon,
  TagIcon,
  StarIcon,
  UlistIcon,
  CommentIcon,
  BlockContentIcon,
  ImageIcon,
  UsersIcon,
  CogIcon,
} from '@sanity/icons'
import { schemaTypes } from './src/sanity/schemas'
import { hebrewLocalePlugin } from './src/sanity/hebrewLocale'

const singletonTypes = new Set(['siteSettings'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'mediawave-studio',
  title: 'MediaWave Studio',
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || 'PLACEHOLDER',
  dataset: import.meta.env.SANITY_STUDIO_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    hebrewLocalePlugin(),
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('ניהול תוכן')
          .items([
            // Group: תוכן האתר
            S.listItem()
              .title('תוכן האתר')
              .icon(ThLargeIcon)
              .child(
                S.list()
                  .title('תוכן האתר')
                  .items([
                    orderableDocumentListDeskItem({
                      type: 'service',
                      title: 'שירותים',
                      icon: DocumentTextIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'package',
                      title: 'חבילות מחירים',
                      icon: TagIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'whyUs',
                      title: 'למה אנחנו',
                      icon: StarIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'howWeWork',
                      title: 'איך אנחנו עובדים',
                      icon: UlistIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'faq',
                      title: 'שאלות נפוצות',
                      icon: CommentIcon,
                      S,
                      context,
                    }),
                  ]),
              ),

            S.divider(),

            // Group: בלוג ופורטפוליו
            S.listItem()
              .title('בלוג ופורטפוליו')
              .icon(BlockContentIcon)
              .child(
                S.list()
                  .title('בלוג ופורטפוליו')
                  .items([
                    S.documentTypeListItem('blogPost')
                      .title('פוסטים בבלוג')
                      .icon(DocumentTextIcon),
                    orderableDocumentListDeskItem({
                      type: 'project',
                      title: 'פרויקטים',
                      icon: ImageIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'testimonial',
                      title: 'המלצות',
                      icon: UsersIcon,
                      S,
                      context,
                    }),
                  ]),
              ),

            S.divider(),

            // Singleton: הגדרות אתר
            S.listItem()
              .title('הגדרות אתר')
              .icon(CogIcon)
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2025-01-01' }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) => action && singletonActions.has(action),
          )
        : input,
  },
})
