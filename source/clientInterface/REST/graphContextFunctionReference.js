import { getRequestMethod, getUrlPathLevel1, ifLevel1IncludesAt, ifLastUrlPathtIncludesFunction } from './graphEvaluationFunction.js'
import { transformJavascriptMiddleware } from './middleware/babelTranspiler.js'
import { serveStaticFile, serveServerSideRenderedFile } from './middleware/serveFile.js'
import { pickClientSideProjectConfig } from './middleware/useragentDetection.js'
import { commonFunctionality } from './middleware/commonFunctionality.js'
import { notFound } from './middleware/notFound.js'
import { expandAtSignPath } from './middleware/map@PathToAbsolutePath.js'
import { bodyParserMiddleware } from './middleware/bodyParser.js'
import { debugMiddlewareProxy } from '../../utility/debugMiddlewareProxy.js'
import { setResponseHeaders, cacheControl, handleOptionsRequest } from './middleware/bodyParser.js'
import { setFrontendSetting } from './middleware/languageContent.js'
import { templateRenderingMiddleware } from './middleware/templateRendering.js'

// list of function used in the context of graph traversal.
export const functionReferenceList = async ({ targetProjectConfig }) =>
  /** 
    context that will be used by the graph traversal during execution.
    functions registered in this object must comply (use adapter - wrapper function) with the graph middleware implementation - i.e. a function wrapped middleware.
    add parameters to graph shared context.
  */
  Object.assign(
    /**  middlewares
     * @return {Function (context, next)=>{} } functions that return a middleware.
     */
    {
      bodyParser: () => bodyParserMiddleware |> debugMiddlewareProxy,
      serveStaticFile: ({ node }) => serveStaticFile({ targetProjectConfig, filePath: node.properties.filePath, basePath: node.properties.basePath }),
      serveServerSideRenderedFile: ({ node }) =>
        serveServerSideRenderedFile({ filePath: node.properties.filePath, basePath: node.properties.basePath, renderType: node.properties.renderType, mimeType: node.properties.mimeType }),
      nodeDebug: ({ node }) => async (context, next) => console.log(`• executed middleware in node: ${JSON.stringify(node.properties)}`), // debug
      setResponseHeaders: () => setResponseHeaders(),
      setFrontendSetting: () => setFrontendSetting(),
      pickClientSideProjectConfig: () => pickClientSideProjectConfig({ targetProjectConfig }),
      commonFunctionality: () => commonFunctionality(),
      notFound: () => notFound(),
      cacheControl: () => cacheControl(),
      transformJavascriptMiddleware: () => transformJavascriptMiddleware(),
      expandAtSignPath: () => expandAtSignPath(),
      templateRenderingMiddleware: () => templateRenderingMiddleware(),
    },
    /**  conditions
     * @return {any} value for condition comparison.
     */
    {
      debugMode: ({ node, context }) => targetProjectConfig.runtimeVariable.DEPLOYMENT == 'development' && !targetProjectConfig.runtimeVariable.DISTRIBUTION,
      ifLevel1IncludesAt: ({ node, context }) => ifLevel1IncludesAt(context.middlewareParameter.context),
      ifLastUrlPathtIncludesFunction: ({ node, context }) => ifLastUrlPathtIncludesFunction(context.middlewareParameter.context),
      getRequestMethod: ({ node, context }) => getRequestMethod(context.middlewareParameter.context),
      getUrlPathLevel1: ({ node, context }) => getUrlPathLevel1(context.middlewareParameter.context),
    },
  )
