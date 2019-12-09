import { templateRenderingMiddleware } from './middleware/templateRendering.js'
import { transformJavascriptMiddleware } from './middleware/babelTranspiler.js'
import { serveStaticFile, serveServerSideRenderedFile } from './middleware/serveFile.js'
import { pickClientSideProjectConfig } from './middleware/useragentDetection.js'
import { commonFunctionality } from './middleware/commonFunctionality.js'
import { notFound } from './middleware/notFound.js'
import { expandAtSignPath } from './middleware/map@PathToAbsolutePath.js'
import { bodyParserMiddleware } from './middleware/bodyParser.js'
import { debugMiddlewareProxy } from '../../utility/debugMiddlewareProxy.js'
import { getRequestMethod } from './graphEvaluationFunction.js'

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
      // debug
      nodeDebug: ({ node }) => async (context, next) => console.log(`• executed middleware in node: ${JSON.stringify(node.properties)}`),
    },
    /**  conditions
     * @return {any} value for condition comparison.
     */
    {
      getRequestMethod: ({ node, context }) => {
        return getRequestMethod(context.middlewareParameter.context)
      },
    },
  )
