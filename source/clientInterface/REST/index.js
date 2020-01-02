import filesystem from 'fs'
import * as serviceConfig from '../../configuration/configuration.js'
import { createHttpServer } from '../../utility/server.js'
import * as assetContentDeliveryGraph from '../../../resource/assetContentDelivery.graph.json'
import * as rootContentRenderingGraph from '../../../resource/rootContentRendering.graph.json'
import { initializeGraph } from '../../utility/graphInitialization.js'
import * as graphEvaluationFunction from './graphEvaluationFunction.js'
import { graphMiddlewareImmediatelyExecute } from './middleware/traverseGraph.js'
import { functionReferenceList, fileReferenceList } from './graphReferenceContext.js'

/** Assets, different components of the site, and static files, intended to be requested from a subdomain.
  - Serves static files
  - Rendered files

  Architecture: REST + Custom concepts, Protocol: HTTP
*/
export async function initializeAssetContentDelivery({ targetProjectConfig, entrypointKey, port = serviceConfig.contentDelivery.port }) {
  // Create a grpah instance with middleware references and load graph data.
  let { configuredGraph } = await initializeGraph({
    targetProjectConfig,
    contextData: { functionReferenceContext: await functionReferenceList({ targetProjectConfig }), fileContext: await fileReferenceList({ targetProjectConfig }) },
    graphDataArray: [assetContentDeliveryGraph],
  }) // returns a configuredGraph element.

  let middlewareArray = [
    await graphMiddlewareImmediatelyExecute({ entrypointKey: '293097b9-3522-4f2b-b557-8380ff3e96e3', configuredGraph }),
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
    },
  ]

  // create http server
  await createHttpServer({ label: `${serviceConfig.contentDelivery.serviceName}`, port, middlewareArray })
}

/** Root domain content Mainly user interface related
 *  - servers template rendered files for webapp interface (manipulated files using nodejs rendering).
 *  - serves some static files required in the root domain.
 * 
 Architecture: REST + Custom concepts, Protocol: HTTP
 */
export async function initializeRootContentRendering({ targetProjectConfig, entrypointKey, port = serviceConfig.contentRendering.port }) {
  // Create a grpah instance with middleware references and load graph data.
  let { configuredGraph } = await initializeGraph({
    targetProjectConfig,
    contextData: { functionReferenceContext: await functionReferenceList({ targetProjectConfig }), fileContext: await fileReferenceList({ targetProjectConfig }) },
    graphDataArray: [rootContentRenderingGraph],
  }) // returns a configuredGraph element.

  let middlewareArray = [
    await graphMiddlewareImmediatelyExecute({ entrypointKey: '928efj94-29034jg90248-g2390jg823', configuredGraph }),
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
    },
  ]

  // create http server
  await createHttpServer({ label: `${serviceConfig.contentRendering.serviceName}`, port, middlewareArray })
}
