import filesystem from 'fs'
import * as serviceConfig from '../../configuration/configuration.js'
import { createHttpServer } from '../../utility/server.js'
import * as assetContentDeliveryGraph from '../../../resource/assetContentDelivery.graph.json'
import * as rootContentRenderingGraph from '../../../resource/rootContentRendering.graph.json'
import { initializeGraph } from '../../utility/graphInitialization.js'
import * as graphEvaluationFunction from './graphEvaluationFunction.js'
import { graphMiddlewareImmediatelyExecute } from './middleware/traverseMiddlewareGraph.js'
import { middlewareFunctionReferenceList, conditionFunctionReferenceList } from './graphReferenceContext.js'

// TODO: Use logging plugin: for debug allow to log middlewares traversed, through applying logs in graphTraversal and implementation e.g. immediatelyExecuteMiddleware.

/** 
@param#1  service configurations
@param#2  dependency services configurations

Assets, different components of the site, and static files, intended to be requested from a subdomain.
  - Serves static files
  - Rendered files

  Architecture: REST + Custom concepts, Protocol: HTTP
*/
export async function initializeAssetContentDelivery(
  { targetProjectConfig, entrypointKey, port = serviceConfig.contentDelivery.port },
  { memgraph = {} }: { memgraph: { port: Number, host: String } } = {},
) {
  // Create a grpah instance with middleware references and load graph data.
  let { configuredGraph, service: graphDbService } = await initializeGraph({
    contextData: { targetProjectConfig },
    graphDataArray: [assetContentDeliveryGraph],
    host: memgraph?.host,
    port: memgraph?.port,
  }) // returns a configuredGraph element.

  // set server middlewares
  let curriedMiddlewareFunctionReferenceList = middlewareFunctionReferenceList({ targetProjectConfig, configuredGraph }),
    curriedConditionFunctionReferenceList = conditionFunctionReferenceList({ targetProjectConfig, configuredGraph })
  let middlewareArray = [
    await graphMiddlewareImmediatelyExecute({
      entrypointKey: '293097b9-3522-4f2b-b557-8380ff3e96e3',
      configuredGraph,
      referenceList: middlewareContext => ({
        functionReferenceContext: Object.assign(curriedMiddlewareFunctionReferenceList({ middlewareContext }), curriedConditionFunctionReferenceList({ middlewareContext })),
      }),
    }),
    // async (context, next) => {
    //   console.log('Last Middleware reached.')
    //   await next()
    // },
  ]

  // create http server
  let serverService = await createHttpServer({ serviceName: `${serviceConfig.contentDelivery.serviceName}`, port, middlewareArray })

  return { service: [serverService, graphDbService] }
}

/** 
@param#1  service configurations
@param#2  dependency services configurations

Root domain content Mainly user interface related
 *  - servers template rendered files for webapp interface (manipulated files using nodejs rendering).
 *  - serves some static files required in the root domain.
 * 
 Architecture: REST + Custom concepts, Protocol: HTTP
 */
export async function initializeRootContentRendering(
  { targetProjectConfig, entrypointKey, port = serviceConfig.contentRendering.port },
  { memgraph = {} }: { memgraph: { port: Number, host: String } } = {},
) {
  // Create a grpah instance with middleware references and load graph data.
  let { configuredGraph, service: graphDbService } = await initializeGraph({
    contextData: { targetProjectConfig },
    graphDataArray: [rootContentRenderingGraph],
    host: memgraph?.host,
    port: memgraph?.port,
  }) // returns a configuredGraph element.

  // set server middlewares
  let curriedMiddlewareFunctionReferenceList = middlewareFunctionReferenceList({ targetProjectConfig, configuredGraph }),
    curriedConditionFunctionReferenceList = conditionFunctionReferenceList({ targetProjectConfig, configuredGraph })
  let middlewareArray = [
    await graphMiddlewareImmediatelyExecute({
      entrypointKey: '928efj94-29034jg90248-g2390jg823',
      configuredGraph,
      referenceList: middlewareContext => ({
        functionReferenceContext: Object.assign(curriedMiddlewareFunctionReferenceList({ middlewareContext }), curriedConditionFunctionReferenceList({ middlewareContext })),
      }),
    }),
    // async (context, next) => {
    //   console.log('Last Middleware reached.')
    //   await next()
    // },
  ]

  // create http server
  let serverService = await createHttpServer({ serviceName: `${serviceConfig.contentRendering.serviceName}`, port, middlewareArray })

  return { service: [serverService, graphDbService] }
}
