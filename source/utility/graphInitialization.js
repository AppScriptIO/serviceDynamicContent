import { Graph, Context, Database, Traversal, Entity, schemeReference } from '@dependency/graphTraversal'
import { database, traversal as traversalImplementation } from '@dependency/graphTraversal-implementation'

export async function initializeGraph({ graphDataArray = [], contextData = {} /** object to be merged with context data */ }) {
  // context
  let context = new Context.clientInterface({
    data: contextData,
  })

  // database
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: { boltCypherModelAdapter: database.boltCypherModelAdapterFunction({ schemeReference, url: { protocol: 'bolt', hostname: 'localhost', port: 7687 } }) },
    defaultImplementation: 'boltCypherModelAdapter',
  })

  // traversal implementation
  let implementationList =
    traversalImplementation
    |> (list => {
      // add specific graph dependent implementations
      // list.processNode['someCustomImplementation'] = function() {}
      return list
    })
  let concreteGraphTraversalBehavior = new Traversal.clientInterface({ implementationList: { middlewareGraph: implementationList }, defaultImplementation: 'middlewareGraph' })

  // configured graph
  let configuredGraph = Graph.clientInterface({
    parameter: [
      {
        traversal: concreteGraphTraversalBehavior,
        database: concreteDatabaseBehavior,
        concreteBehaviorList: [context],
      },
    ],
  })

  // load graph data:
  console.log(`• loading service graph data...`)
  let concereteDatabase = concreteDatabaseBehavior[Database.$.key.getter]()
  for (let graphData of graphDataArray) await concereteDatabase.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })

  return { configuredGraph }
}
