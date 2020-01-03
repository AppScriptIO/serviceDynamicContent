import composeMiddleware from 'koa-compose'
import { Context, Entity } from '@dependency/graphTraversal'

export const graphMiddlewareImmediatelyExecute = async ({ configuredGraph, entrypointKey }) =>
  // Immediately executing middlewares in graph traversal.
  async function graphMiddlewareImmediatelyExecute(middlewareContext, next) {
    let contextInstance = new Context.clientInterface({
      data: {
        // create unique context for traversal - add middleware context object to graph through the graph context instance.
        middlewareParameter: { context: middlewareContext },
      },
    })

    let graph = new configuredGraph.clientInterface({
      concreteBehaviorList: [contextInstance],
    })

    /** @return middlewareArray - returned middleware array is for debugging purposes. The middlewares should be executed during the graph travrsal. */
    let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processNode: 'immediatelyExecuteMiddleware' } }) // implementation key is derived from the graph nodes - usally 'immediatelyExecuteMiddleware'
    await next()
  }

export const graphMiddlewareAggregateThenExecuteasync = ({ configuredGraphInterface, entrypointKey }) =>
  // Aggregating middleware approach - return a middleware array, then use koa-compose to merge the middlewares and execute it.
  async function graphMiddlewareAggregateThenExecute(context, next) {
    let graph = new configuredGraphInterface({
      // Note: 'middlewareParameter' is not used in the graph that returns a middleware array, only in the executing graph. Some nodes may override the execution processNode implementation.
      /*data: { middlewareParameter: { context } } */
    })
    let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processNode: 'executeFunctionReference' } })
    await composeMiddleware(middlewareArray)(context, next)
  }
