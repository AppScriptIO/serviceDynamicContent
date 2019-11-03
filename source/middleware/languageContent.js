import parse from 'co-body' // throws on unsupported content type.
import bodyParser from 'koa-bodyparser' // Brings extra option for handling error and unsupported content-types.
import { getMergedMultipleDocumentOfSpecificLanguage as queryPatternImplementation } from '@dependency/databaseUtility/source/patternImplementation.js'
import { mergeDeep } from '@dependency/deepObjectMerge'

export default option =>
  async function(context, next) {
    let urlQuery = context.request.query
    let queryLanguage = urlQuery.language
      ? urlQuery.language.replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter.
      : null
    let uiContent = null
    let defaultLanguage = Application.frontendStatic.setting.mode.language
    try {
      uiContent = await queryPatternImplementation({
        databaseConnection: Application.rethinkdbConnection,
        languageDocumentKey: queryLanguage || defaultLanguage,
        dataTableName: 'ui',
      })
    } catch (error) {
      console.log(error)
    }

    let frontendPerContext = {
      setting: {
        mode: {
          language: queryLanguage || defaultLanguage, // TODO: change setting default twice - fallback to prevent setting a null/undefined over the default value
        },
      },
      uiContent,
    }

    // TODO: separate frontend object creation from language middleware.

    frontendPerContext.instance = context.instance // add instance object as it is used by client side.

    context.frontend = mergeDeep(Application.frontendStatic, frontendPerContext)

    await next()
  }
