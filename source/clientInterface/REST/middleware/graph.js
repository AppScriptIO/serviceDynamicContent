import composeMiddleware from 'koa-compose'

export async function graphMiddlewareImmediatelyExecute({ configuredGraph, entrypointKey }) {
  // Immediately executing middlewares in graph traversal.
  return async (context, next) => {
    let graph = new configuredGraph({ data: { middlewareParameter: { context } } })
    let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processData: 'immediatelyExecuteMiddleware' } }) // implementation key is derived from the graph nodes - usally 'immediatelyExecuteMiddleware'
    // console.log(middlewareArray) // returned middleware array is for debugging purposes. The middlewares should be executed during the graph travrsal.
    await next()
  }
}

export async function graphMiddlewareAggregateThenExecute({ configuredGraph, entrypointKey }) {
  // Aggregating middleware approach - return a middleware array, then use koa-compose to merge the middlewares and execute it.
  return async (context, next) => {
    // Note: 'middlewareParameter' is not used in the graph that returns a middleware array, only in the executing graph. Some nodes may override the execution processData implementation.
    let graph = new configuredGraph({
      /*data: { middlewareParameter: { context } } */
    })
    let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processData: 'executeFunctionReference' } })
    await composeMiddleware(middlewareArray)(context, next)
  }
}
