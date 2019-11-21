import { Graph as GraphModule, Context as ContextModule, Database as DatabaseModule, Traversal as TraversalModule, Entity, schemeReference } from '@dependency/graphTraversal'
import { database, traversal as traversalImplementation } from '@dependency/graphTraversal-implementation'

const { Graph } = GraphModule,
  { Context } = ContextModule,
  { Database } = DatabaseModule,
  { Traversal } = TraversalModule

export async function initializeGraph({ targetProjectConfig, graphDataArray = [], functionReferenceContext }) {
  // context
  let contextInstance = new Context.clientInterface({ targetProjectConfig, functionReferenceContext, implementationKey: { traversalInterception: 'handleMiddlewareNextCall' } })
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
      // list.processData['someCustomImplementation'] = function() {}
      return list
    })
  let concreteGraphTraversalBehavior = new Traversal.clientInterface({ implementationList: { middlewareGraph: implementationList }, defaultImplementation: 'middlewareGraph' })
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

  return configuredGraph
}
