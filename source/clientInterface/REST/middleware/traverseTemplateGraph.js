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
export const graphDocumentRendering = ({ entrypoint, configuredGraph }: { entrypoint: Node | NodeKey }) => {
  return async function graphDocumentRendering(middlewareContext, next) {
    let contextInstance = new Context.clientInterface({
      data: {
        // create unique context for traversal - add middleware context object to graph through the graph context instance.
        templateArgument: {
          // context is one of the required arguments in templates used in the service. NOTE; context is not asserted in the code, i.e. won't throw till a template tries to use it.
          context: middlewareContext,
        },
      },
    })
    let graph = new configuredGraph.clientInterface({ concreteBehaviorList: [contextInstance] })

    /** @return String - rendered document */
    let renderedContent = await graph.traverse({
      nodeKey: entrypoint,
      implementationKey: {
        processNode: 'templateRenderingWithInseritonPosition',
        traversalInterception: 'traverseThenProcess',
        aggregator: 'AggregatorObjectOfArray',
      },
    })

    console.log(context.path)

    context.body = renderedContent
    await next()
  }
}

// Adapter for usage from Middleware Graph processNode implementation, extracting nodeKey to use from the Middleware node.
export const graphDocumentRenderingMiddlewareAdapter = ({ middlewareNode, graphInstance, configuredGraph }) => {
  // resolve document node of template subgraph:
  let documentNode = middlewareNode.properties.documentKey // get the enrypoint node of template subgraph

  return graphDocumentRendering({ entrypoint: documentNode, configuredGraph })
}
