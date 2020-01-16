import assert from 'assert'
import { Context, Entity } from '@dependency/graphTraversal'

/**
 * Use graph traversal module to render document - Render document using template graph traversal.
 Documents are represented by templates graph (as template File nodes only reference a template, while the Stage nodes relates different templats together, defining a document).
 - in case underscore is used through koa-views: Using 'context.render' using koa-views that uses consolidate.js as an underlying module.
 @dependency `graphTraversal` module - instance of Graph class.

 General steps specifying the relationship between Middleware subgraph & Template subgraph:  
 In the middleware graph: 
  - Parse request.
  - Select/Match document (collection of templates & configs).
  - Render document (Template subgraph)
  - serve.
 */
export const graphDocumentRendering = ({ entrypoint, configuredGraph, referenceList }: { entrypoint: Node | NodeKey }) => {
  assert(entrypoint, `• Document/Template graph entrypoint node/key must be provided: entrypoint = ${entrypoint}`)

  return async function graphDocumentRendering(middlewareContext, next) {
    let contextInstance = new Context.clientInterface({
      data: Object.assign(
        {
          templateParameter: {}, // create unique context for traversal - add middleware context object to graph through the graph context instance.
        },
        referenceList(middlewareContext), // returns an object with `functionReferenceContext` property
      ),
    })

    let graph = new configuredGraph.clientInterface({ concreteBehaviorList: [] })
    graph.configuredTraverser = graph.configuredTraverser.clientInterface({
      parameter: [{ concreteBehaviorList: [contextInstance] }],
    })

    /** @return String - rendered document */
    let { result: renderedContent } = await graph.traverse({
      nodeKey: typeof entrypoint == 'string' ? entrypoint : undefined,
      nodeInstance: typeof entrypoint == 'object' ? entrypoint : undefined,
      implementationKey: {
        processNode: 'templateRenderingWithInseritonPosition',
        traversalInterception: 'traverseThenProcess',
        aggregator: 'AggregatorObjectOfArray',
      },
    })

    middlewareContext.body = renderedContent
    await next()
  }
}

// Adapter for usage from Middleware Graph processNode implementation, extracting nodeKey to use from the Middleware node.
// Logic of docuent key retrieval stays this way separate from the function envoking the traversal.
export const graphDocumentRenderingMiddlewareAdapter = async ({ middlewareNode, graphInstance, configuredGraph, referenceList }) => {
  let documentNode, documentKey

  // resolve document node of direct property or subgraph template reference
  documentKey = middlewareNode.properties.documentKey // get the enrypoint node of template subgraph
  let { subgraphArray } = await graphInstance.database.getSubgraph({ concreteDatabase: graphInstance.database, nodeID: middlewareNode.identity }) // resolve reference to node
  if (subgraphArray) {
    assert(subgraphArray.length <= 1, `• Multiple SUBGRAPH connections is not supported.`)
    documentNode = subgraphArray[0].source
  }

  return await graphDocumentRendering({ entrypoint: documentKey || documentNode, configuredGraph, referenceList })
}
