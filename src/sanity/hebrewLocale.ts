import { definePlugin, defineLocaleResourceBundle } from 'sanity'

const hebrewStudioBundle = defineLocaleResourceBundle({
  locale: 'he',
  namespace: 'studio',
  resources: {
    'action.publish.label': 'פרסם',
    'action.unpublish.label': 'בטל פרסום',
    'action.delete.label': 'מחק',
    'action.duplicate.label': 'שכפל',
    'action.discard-changes.label': 'בטל שינויים',
    'inputs.array.action.add-item': 'הוסף פריט',
    'inputs.array.action.remove-item': 'הסר',
    'document-status.draft': 'טיוטה',
    'document-status.published': 'מפורסם',
  },
})

export const hebrewLocalePlugin = definePlugin({
  name: 'hebrew-locale',
  i18n: {
    bundles: [hebrewStudioBundle],
  },
})
