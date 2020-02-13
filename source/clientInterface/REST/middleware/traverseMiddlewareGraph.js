import composeMiddleware from 'koa-compose'
import { Context, Entity } from '@dependency/graphTraversal'

export const graphMiddlewareImmediatelyExecute = async ({ configuredGraph, entrypointKey, referenceList }) =>
  // Immediately executing middlewares in graph traversal.
  async function graphMiddlewareImmediatelyExecute(middlewareContext, next) {
    let contextInstance = new Context.clientInterface({
      data: Object.assign(
        {
          middlewareParameter: {}, // create unique context for traversal - add middleware context object to graph through the graph context instance.
        },
        referenceList(middlewareContext), // returns an object with `functionReferenceContext` property
      ),
    })

    let graph = new configuredGraph.clientInterface({})
    graph.configuredTraverser = graph.configuredTraverser.clientInterface({
      parameter: [{ concreteBehaviorList: [contextInstance] }],
    })

    /** @return middlewareArray - returned middleware array is for debugging purposes. The middlewares should be executed during the graph travrsal. */
    let { result: middlewareArray } = await graph.traverse({
      nodeKey: entrypointKey,
      implementationKey: {
        processNode: 'immediatelyExecuteMiddleware',
        traversalInterception: 'handleMiddlewareNextCall_branchedGraph',
      },
    }) // implementation key is derived from the graph nodes - usally 'immediatelyExecuteMiddleware'

    // debug viewing the traversals used in the graph
    // console.log(graph.statistics.traverserArray[0].statistics.traversedNodeList)

    await next()
  }

// TODO: Check if it works - as the processNode implementation no longer returns middleware functions conforming to (context, next)=>{}, rather the current implementation uses currying and returns (next)=>{} functions
export const graphMiddlewareAggregateThenExecuteasync = ({ configuredGraphInterface, entrypointKey, referenceList }) =>
  // Aggregating middleware approach - return a middleware array, then use koa-compose to merge the middlewares and execute it.
  async function graphMiddlewareAggregateThenExecute(context, next) {
    let contextInstance = new Context.clientInterface({
      // Note: 'middlewareParameter' is not used in the graph that returns a middleware array, only in the executing graph. Some nodes may override the execution processNode implementation.
      /* data: { middlewareParameter: { context } } */
      data: referenceList(), // TODO: passing with no argument should not use currying and return in stead the full middleware complient function (context, next)=>{}
    })

    let graph = new configuredGraphInterface({})
    graph.configuredTraverser = graph.configuredTraverser.clientInterface({
      parameter: [{ concreteBehaviorList: [contextInstance] }],
    })

    let { result: middlewareArray } = await graph.traverse({
      nodeKey: entrypointKey,
      implementationKey: {
        processNode: 'executeFunctionReference',
        traversalInterception: 'handleMiddlewareNextCall',
      },
    })
    await composeMiddleware(middlewareArray)(context, next)
  }
