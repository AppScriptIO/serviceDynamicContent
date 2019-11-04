import { initializeGraph } from '../utility/graphInitialization.js'
import * as graphData from '../../resource/graphData.json'

import composeMiddleware from 'koa-compose'
import { bodyParserMiddleware } from '../middleware/bodyParser.js'
import { serveStaticFile, serveServerSideRenderedFile } from '../middleware/serveFile.js'

const debugGraphMiddleware = targetMiddleware =>
  new Proxy(targetMiddleware, {
    apply: function(target, thisArg, argumentsList) {
      console.log(target.name, ' Openning.')
      let result = Reflect.apply(...arguments)
      console.log(target.name, ' Closing.')
      return result
    },
  })

export async function graphMiddleware({
  targetProjectConfig,
  entrypointKey = '05bd55ed-212c-4609-8caf-e464a7cceb74',
  implementation,
}: {
  implementation: 'immediatelyExecute' | 'aggregateThenExecute',
}) {
  // context that will be used by the graph traversal during execution.
  // functions registered in this object must comply (use adapter - wrapper function) with the graph middleware implementation - i.e. a function wrapped middleware.
  const functionReferenceContext = {
    // middlewares
    bodyParser: () => bodyParserMiddleware |> debugGraphMiddleware,
    serveStaticFile: ({ node }) => serveStaticFile({ targetProjectConfig, filePath: node.properties.filePath, basePath: node.properties.basePath }),
    serveServerSideRenderedFile: ({ node }) =>
      serveServerSideRenderedFile({ filePath: node.properties.filePath, basePath: node.properties.basePath, renderType: node.properties.renderType, mimeType: node.properties.mimeType }),
    // conditions
  }

  let configuredGraph = await initializeGraph({ targetProjectConfig, graphDataArray: [graphData], functionReferenceContext })
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
