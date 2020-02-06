import { Graph, Context, Database, Traverser, Entity } from '@dependency/graphTraversal'
import { database, traversal } from '@dependency/graphTraversal-implementation'

export async function initializeGraph({ graphDataArray = [], contextData = {} /** object to be merged with context data */, host = 'localhost', port = 7687 }) {
  // context
  let contextInstance = new Context.clientInterface({
    data: contextData,
  })

  // database
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: { boltCypherModelAdapter: database.boltCypherModelAdapterFunction({ url: { protocol: 'bolt', hostname: host, port } }) },
    defaultImplementation: 'boltCypherModelAdapter',
  })

  /** traversal implementation
      add specific graph dependent implementations
      list.processNode['someCustomImplementation'] = function() {}
  */
  // traversal = traversal |> (list => list)

  let configuredTraverser = Traverser.clientInterface({
    parameter: [
      {
        concreteBehaviorList: [contextInstance],
        implementationList: {
          middlewareGraph: {
            portNode: traversal.portNode, // Port
            traversalInterception: traversal.traversalInterception, // Stage
            aggregator: traversal.aggregator,
            processNode: traversal.processNode, // Process
          },
        },
        defaultImplementation: 'middlewareGraph',
      },
    ],
  })

  // configured graph
  let configuredGraph = Graph.clientInterface({
    parameter: [{ configuredTraverser, database: concreteDatabaseBehavior, concreteBehaviorList: [] }],
  })

  // load graph data:
  console.log(`• loading service graph data...`)
  let concereteDatabase = concreteDatabaseBehavior[Database.$.key.getter]()
  for (let graphData of graphDataArray) await concereteDatabase.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })

  return { configuredGraph, service: {
    name: 'Neo4j Bolt Driver', 
    connectionHandler: concereteDatabase.driverInstance, 
    close: concereteDatabase.close
  } }
}
