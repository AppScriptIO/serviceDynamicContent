import { getMergedMultipleDocumentOfSpecificLanguage as queryPatternImplementation } from '@dependency/databaseUtility/source/patternImplementation.js'
import { mergeDeep } from '@dependency/deepObjectMerge'

export const setFrontendSetting = () =>
  async function setFrontendSetting(context, next) {
    context.frontend = {
      setting: {
        mode: {
          language: context.request.query.language
            ? context.request.query.language.replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter.
            : 'English',
        },
      },
      uiContent: null, //TODO require frontend settings
    }

    await next()
  }
