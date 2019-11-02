// Static content server - could be upgraded to Content Delivery Network
import { createTemplateRenderingMiddleware } from './middleware/templateRendering.js'
import { graphMiddleware } from './middleware/graphMiddleware.js'
import serviceConfig from './configuration/configuration.js'
import { createHttpServer } from '../../utility/server.js'

import { transformJavascriptMiddleware } from '../../middleware/babelTranspiler.middleware.js'
import { serveStaticFile } from '../../middleware/serveFile.middleware.js'

/**
Static content Condition Graph (cdn.domain.com): 

GET request:
  /@<...> "serve files/directories with @ prefix"
    babelTranspiler.middleware.js TODO: add condition if(targetProjectConfig.runtimeVariable.DEPLOYMENT == 'development' && !targetProjectConfig.runtimeVariable.DISTRIBUTION)
    serveFile.middlewareGenerator.js arguments:"{"options":{"gzip":true}}"
    "Map @ folder path" map@PathToAbsolutePath.middleware.js
    *"set response headers + Common functions + language content + cache"
  /asset --> callback: "{"name":"a8sdf52-43cd-91fd-9eae5843c74c" [or other entry was found with value] "da18242e-792e-4e44-a12b-b280f6331b7c","type":"middlewareNestedUnit"}"  ""{"name":"da18242e-792e-4e44-a12b-b280f6331b7c","type":"middlewareNestedUnit"}""
      <...>$function (ifLastUrlPathtIncludesFunction.js) --> callback: "{"name":"2yvc-91fd-9eae5843c74c","type":"middlewareNestedUnit"}"
      javascript/jspm.config.js --> value: ""{"name":"68fb59e3-af0b-4ea2-800e-7e7e37d7cc31","type":"middlewareNestedUnit"}""
  /upload --> callback: "{"name":"9w9f-9ab6-43cd-91fd-9eae5843c74c","type":"middlewareNestedUnit"}"


*/
export async function initialize({ targetProjectConfig, entrypointKey, additionalData, port = serviceConfig.port }) {
  let middlewareArray = [
    transformJavascriptMiddleware(),
    serveStaticFile({ targetProjectConfig }),
    createTemplateRenderingMiddleware(),
    // authorizationMiddleware(),
    await graphMiddleware({ targetProjectConfig, entrypointKey }),
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
      context.compress = true
    },
  ]
  // create http server
  await createHttpServer({ label: serviceConfig.serviceName, port, middlewareArray })
}
