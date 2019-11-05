import composeMiddleware from 'koa-compose'

const debugGraphMiddleware = targetMiddleware =>
  new Proxy(targetMiddleware, {
    apply: function(target, thisArg, argumentsList) {
      console.log(target.name, ' Openning.')
      let result = Reflect.apply(...arguments)
      console.log(target.name, ' Closing.')
      return result
    },
  })

export async function graphMiddleware({ configuredGraph, entrypointKey, implementation }: { implementation: 'immediatelyExecute' | 'aggregateThenExecute' }) {
  switch (implementation) {
    case 'aggregateThenExecute':
      // Aggregating middleware approach - return a middleware array, then use koa-compose to merge the middlewares and execute it.
      return async (context, next) => {
        // Note: 'middlewareParameter' is not used in the graph that returns a middleware array, only in the executing graph. Some nodes may override the execution processData implementation.
        let graph = new configuredGraph({
          /*data: { middlewareParameter: { context } } */
        })
        let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processData: 'executeFunctionReference' } })
        await composeMiddleware(middlewareArray)(context, next)
      }
      break

    case 'immediatelyExecute':
    default:
      // Immediately executing middlewares in graph traversal.
      return async (context, next) => {
        let graph = new configuredGraph({ data: { middlewareParameter: { context } } })
        let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processData: 'immediatelyExecuteMiddleware' } }) // implementation key is derived from the graph nodes - usally 'immediatelyExecuteMiddleware'
        // console.log(middlewareArray) // returned middleware array is for debugging purposes. The middlewares should be executed during the graph travrsal.
        await next()
      }
      break
  }
}
