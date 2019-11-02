import {
  Graph as GraphModule,
  Context as ContextModule,
  Database as DatabaseModule,
  GraphTraversal as GraphTraversalModule,
  modelAdapter,
  Entity,
  defaultImplementationList,
} from '@dependency/graphTraversal'

const { Graph } = GraphModule,
  { Context } = ContextModule,
  { Database } = DatabaseModule,
  { GraphTraversal } = GraphTraversalModule

import composeMiddleware from 'koa-compose'
import { bodyParserMiddleware } from '../middleware/bodyParser.middleware.js'

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
const functionContext = {
    bodyParser: bodyParserMiddleware |> debugGraphMiddleware,
  },
  conditionContext = {}

export async function initializeGraph({ targetProjectConfig, graphDataArray = [] }) {
  // context
  let contextInstance = new Context.clientInterface({ targetProjectConfig, functionContext, conditionContext, implementationKey: { traversalInterception: 'handleMiddlewareNextCall' } })
  // database
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: { boltCypherModelAdapter: modelAdapter.boltCypherModelAdapterFunction({ url: { protocol: 'bolt', hostname: 'localhost', port: 7687 } }) },
    defaultImplementation: 'boltCypherModelAdapter',
  })
  // traversal implementation
  let implementationList =
    defaultImplementationList
    |> (list => {
      // add specific graph dependent implementations
      // list.processData['someCustomImplementation'] = function() {}
      return list
    })
  let concreteGraphTraversalBehavior = new GraphTraversal.clientInterface({ implementationList: { middlewareGraph: implementationList }, defaultImplementation: 'middlewareGraph' })
  // configured graph
  let configuredGraph = Graph.clientInterface({
    parameter: [
      {
        traversal: concreteGraphTraversalBehavior,
        database: concreteDatabaseBehavior,
        concreteBehaviorList: [contextInstance],
      },
    ],
  })

  // load graph data:
  console.log(`• loading service graph data...`)
  let concereteDatabaseInstance = concreteDatabaseBehavior[Entity.reference.getInstanceOf](Database)
  let concereteDatabase = concereteDatabaseInstance[Database.reference.key.getter]()
  for (let graphData of graphDataArray) await concereteDatabase.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })

  return { createGraphMiddleware: createGraphMiddlewareImmediatelyExecutedCallback(configuredGraph), configuredGraph }
}

// Immediately executing middlewares in graph traversal.
const createGraphMiddlewareImmediatelyExecutedCallback = configuredGraph => ({ entrypointKey }) => async (context, next) => {
  let graph = new configuredGraph({ data: { middlewareParameter: { context } } })
  await graph.traverse({ nodeKey: entrypointKey }) // implementation key is derived from the graph nodes - usally 'immediatelyExecuteMiddleware'
  await next()
}

// Aggregating middleware approach - return a middleware array, then use koa-compose to merge the middlewares and execute it.
const createGraphMiddlewareAggregationCallback = configuredGraph => ({ entrypointKey }) => async (context, next) => {
  let graph = new configuredGraph({})
  let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processData: 'returnMiddlewareFunction' } })
  await composeMiddleware(middlewareArray)(context, next)
}
