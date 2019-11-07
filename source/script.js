import filesystem from 'fs'
import * as serviceConfig from './configuration/configuration.js'
import { createHttpServer } from './utility/server.js'
import * as assetContentDeliveryGraph from '../resource/assetContentDelivery.graph.json'
import * as rootContentRenderingGraph from '../resource/rootContentRendering.graph.json'
import { initialieGraph } from './utility/graphInitialization.js'
import * as graphEvaluationFunction from './utility/graphEvaluationFunction.js'
import { initializeGraph } from './utility/graphInitialization.js'

import { graphMiddleware } from './middleware/graph.js'
import { templateRenderingMiddleware } from './middleware/templateRendering.js'
import { transformJavascriptMiddleware } from './middleware/babelTranspiler.js'
import { serveStaticFile, serveServerSideRenderedFile } from './middleware/serveFile.js'
import { pickClientSideProjectConfig } from './middleware/useragentDetection.js'
import { commonFunctionality } from './middleware/commonFunctionality.js'
import { notFound } from './middleware/notFound.js'
import { mapAtSignPathToAbsolutePathMiddleware } from './middleware/map@PathToAbsolutePath.js'
import { bodyParserMiddleware } from './middleware/bodyParser.js'

// Create a grpah instance with middleware references and load graph data.
async function configureGrpah({ targetProjectConfig, graphDataArray }) {
  // context that will be used by the graph traversal during execution.
  // functions registered in this object must comply (use adapter - wrapper function) with the graph middleware implementation - i.e. a function wrapped middleware.
  const functionReferenceContext = Object.assign(
    // middlewares
    {
      bodyParser: () => bodyParserMiddleware |> debugGraphMiddleware,
      serveStaticFile: ({ node }) => serveStaticFile({ targetProjectConfig, filePath: node.properties.filePath, basePath: node.properties.basePath }),
      serveServerSideRenderedFile: ({ node }) =>
        serveServerSideRenderedFile({ filePath: node.properties.filePath, basePath: node.properties.basePath, renderType: node.properties.renderType, mimeType: node.properties.mimeType }),
    },
    // conditions
    graphEvaluationFunction,
  )
  return await initializeGraph({ targetProjectConfig, graphDataArray, functionReferenceContext }) // returns a configuredGraph element.
}

/** Assets, different components of the site, and static files, intended to be requested from a subdomain.
  - Serves static files
  - Rendered files
*/
export async function initializeAssetContentDelivery({ targetProjectConfig, entrypointKey, port = serviceConfig.contentDelivery.port }) {
  let configuredGraph = await configureGrpah({ targetProjectConfig, graphDataArray: [assetContentDeliveryGraph] })
  let middlewareArray = [
    // mapAtSignPathToAbsolutePathMiddleware(),
    // notFound(),
    // pickClientSideProjectConfig({ targetProjectConfig }),
    // templateRenderingMiddleware(),
    // serveStaticFile({ targetProjectConfig }),
    // commonFunctionality(),
    // serveServerSideRenderedFile({ renderType: 'convertSharedStylesToJS' }),
    await graphMiddleware({ entrypointKey, configuredGraph }),
    // transformJavascriptMiddleware(),
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
      context.compress = true
    },
  ]
  // create http server
  await createHttpServer({ label: `${serviceConfig.contentDelivery.serviceName}`, port, middlewareArray })
}

/** Root domain content Mainly user interface related
 *  - servers template rendered files for webapp interface.
 *  - serves some static files required in the root domain.
 */
export async function initializeRootContentRendering({ targetProjectConfig, entrypointKey = 'default', port = serviceConfig.contentRendering.port }) {
  let configuredGraph = await configureGrpah({ targetProjectConfig, graphDataArray: [rootContentRenderingGraph] })
  let middlewareArray = [
    await graphMiddleware({ entrypointKey, configuredGraph }),
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
      context.compress = true
    },
  ]

  // create http server
  await createHttpServer({ label: `${serviceConfig.contentRendering.serviceName}`, port, middlewareArray })
}
