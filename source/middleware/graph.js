import { initializeGraph } from '../utility/graphInitialization.js'
import * as graphData from '../../resource/graphData.json'

import composeMiddleware from 'koa-compose'
import { bodyParserMiddleware } from '../middleware/bodyParser.js'

const debugGraphMiddleware = targetMiddleware =>
  new Proxy(targetMiddleware, {
    apply: function(target, thisArg, argumentsList) {
      console.log(target.name, ' Openning.')
      let result = Reflect.apply(...arguments)
      console.log(target.name, ' Closing.')
      return result
    },
  })

// context that will be used by the graph traversal during execution.
const functionReferenceContext = {
  // middlewares
  bodyParser: () => bodyParserMiddleware |> debugGraphMiddleware,
  // conditions
}

export async function graphMiddlewareImmediatelyExecuted({ targetProjectConfig, entrypointKey = '05bd55ed-212c-4609-8caf-e464a7cceb74' }) {
  let configuredGraph = await initializeGraph({ targetProjectConfig, graphDataArray: [graphData], functionReferenceContext })
  // Immediately executing middlewares in graph traversal.
  return async (context, next) => {
    let graph = new configuredGraph({ data: { middlewareParameter: { context } } })
    let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processData: 'immediatelyExecuteMiddleware' } }) // implementation key is derived from the graph nodes - usally 'immediatelyExecuteMiddleware'
    // console.log(middlewareArray) // returned middleware array is for debugging purposes. The middlewares should be executed during the graph travrsal.
    await next()
  }
}

export async function graphMiddlewareAggregation({ targetProjectConfig, entrypointKey = '05bd55ed-212c-4609-8caf-e464a7cceb74' }) {
  let configuredGraph = await initializeGraph({ targetProjectConfig, graphDataArray: [graphData], functionReferenceContext })
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
