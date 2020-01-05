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
  return async function graphDocumentRendering(middlewareContext, next) {
    let graph = new configuredGraph.clientInterface({
      concreteBehaviorList: [
        new Context.clientInterface({
          data: Object.assing(
            {
              // create unique context for traversal - add middleware context object to graph through the graph context instance.
              templateParameter: {},
            },
            // returns an object with `functionReferenceContext` property
            referenceList(middlewareContext),
          ),
        }),
      ],
    })

    /** @return String - rendered document */
    let renderedContent = await graph.traverse({
      nodeKey: entrypoint,
      implementationKey: {
        processNode: 'templateRenderingWithInseritonPosition',
        traversalInterception: 'traverseThenProcess',
        aggregator: 'AggregatorObjectOfArray',
      },
    })

    context.body = renderedContent
    await next()
  }
}

// Adapter for usage from Middleware Graph processNode implementation, extracting nodeKey to use from the Middleware node.
export const graphDocumentRenderingMiddlewareAdapter = ({ middlewareNode, graphInstance, configuredGraph, referenceList }) => {
  // get key
  let documentKey = middlewareNode.properties.documentKey // get the enrypoint node of template subgraph
  // resolve document node of template subgraph:
  let documentNode = graphInstance.databaseWrapper.getDocument() // resolve reference to node

  return graphDocumentRendering({ entrypoint: documentNode, configuredGraph, referenceList })
}
