import { getRequestMethod, getUrlPathLevel, isExistUrlPathLevel, getUrlPathAsArray, ifLevel1IncludesAt, ifLastUrlPathtIncludesFunction } from './graphEvaluationFunction.js'
import { transformJavascriptMiddleware } from './middleware/babelTranspiler.js'
import { serveStaticFile, serveServerSideRenderedFile } from './middleware/serveFile.js'
import { pickClientSideProjectConfig } from './middleware/useragentDetection.js'
import { commonFunctionality } from './middleware/commonFunctionality.js'
import { notFound } from './middleware/notFound.js'
import { expandAtSignPath } from './middleware/map@PathToAbsolutePath.js'
import { bodyParserMiddleware } from './middleware/bodyParser.js'
import { debugMiddlewareProxy } from '../../utility/debugMiddlewareProxy.js'
import { setResponseHeaders, cacheControl, handleOptionsRequest } from './middleware/contextManipulation.js'
import { setFrontendSetting } from './middleware/languageContent.js'
import { templateRenderingMiddleware } from './middleware/templateRendering.js'
import { graphRenderedTemplateDocument } from './middleware/serveFile.js'
import { wrapWithJsTag } from './pipeFunction/wrapString.js'

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
      nodeDebug: ({ node }) => (async (context, next) => console.log(`• executed middleware in node: ${JSON.stringify(node.properties)}`)) |> debugMiddlewareProxy, // debug
      // bodyParser: () => bodyParserMiddleware |> debugMiddlewareProxy,
      bodyParser: () => bodyParserMiddleware,
      serveStaticFile: ({ node }) => serveStaticFile({ targetProjectConfig, filePath: node.properties.filePath, basePath: node.properties.basePath }),
      serveServerSideRenderedFile: ({ node }) =>
        serveServerSideRenderedFile({ filePath: node.properties.filePath, basePath: node.properties.basePath, renderType: node.properties.renderType, mimeType: node.properties.mimeType }),
      setResponseHeaders: () => setResponseHeaders(),
      setFrontendSetting: () => setFrontendSetting(),
      pickClientSideProjectConfig: () => pickClientSideProjectConfig({ targetProjectConfig }),
      commonFunctionality: () => commonFunctionality(),
      notFound: () => notFound(),
      cacheControl: () => cacheControl(),
      transformJavascriptMiddleware: () => transformJavascriptMiddleware(),
      expandAtSignPath: () => expandAtSignPath(),
      templateRenderingMiddleware: () => templateRenderingMiddleware(),
      graphRenderedTemplateDocument: ({ node, graph }) => graphRenderedTemplateDocument({ documentKey: node.properties.documentKey, graphInstance: graph }),
    },
    /**  conditions
     * @return {any} value for condition comparison. Could return boolean, string, array.
     */
    {
      getUrlPathLevel: ({ node, context }) => getUrlPathLevel({ middlewareContext: context.middlewareParameter.context, level: node.properties.level }),
      isExistUrlPathLevel: ({ node, context }) => isExistUrlPathLevel({ middlewareContext: context.middlewareParameter.context, level: node.properties.level }),
      ifLevel1IncludesAt: async ({ node, context }) => await ifLevel1IncludesAt(context.middlewareParameter.context),
      ifLastUrlPathtIncludesFunction: ({ node, context }) => ifLastUrlPathtIncludesFunction(context.middlewareParameter.context),
      getRequestMethod: ({ node, context }) => getRequestMethod(context.middlewareParameter.context),
      getUrlPathAsArray: ({ node, context }) => getUrlPathAsArray(context.middlewareParameter.context),
    },
    /** Pipes - for further processing results of template renderning
     * @return {Function (input)=>output } functions that return a pipe function - receiving an input and returning a processed output.
     */
    {
      wrapWithJsTag: ({ node, graph }) => wrapWithJsTag(),
    },
  )
