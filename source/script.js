// expose all functionality as programmatic api first:
export * from './functionality/babelTransformJsStream.js'
export * from './functionality/pickClientSideConfiguration.js'
export * from './functionality/underscoreTemplateInterpolation.js'
export * from './functionality/renderFile.js'
export * from './functionality/layoutTemplateGraphRendering.js'

// rest api initialization functions
import * as restApi from './clientInterface/REST'

export const service = {
  restApi,
}
