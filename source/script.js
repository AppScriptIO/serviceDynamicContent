import filesystem from 'fs'
import * as serviceConfig from './configuration/configuration.js'
import { createHttpServer } from './utility/server.js'
import { graphMiddleware } from './middleware/graph.js'
import { templateRenderingMiddleware } from './middleware/templateRendering.js'
import { transformJavascriptMiddleware } from './middleware/babelTranspiler.js'
import { serveStaticFile } from './middleware/serveFile.js'
import { pickClientSideProjectConfig } from './middleware/useragentDetection.js'

/**
Static content Condition Graph (cdn.domain.com): 

GET request:
/@<...> 
    babelTranspiler.js TODO: add condition if(targetProjectConfig.runtimeVariable.DEPLOYMENT == 'development' && !targetProjectConfig.runtimeVariable.DISTRIBUTION)
    serveFile.js 
    map@PathToAbsolutePath.js
    setResponseHeaders.js
    languageContent.js
    useragentDetection.js
    bodyParser.js
    serverCommonFunctionality.js
    notFound.js
    cacheControl.js

if(/asset)
    setResponseHeaders.js
    languageContent.js
    useragentDetection.js
    bodyParser.js
    serverCommonFunctionality.js
    notFound.js
    cacheControl.js
    serveFile.js

    if(<...>$function)
      setResponseHeaders.js
      languageContent.js
      useragentDetection.js
      bodyParser.js
      serverCommonFunctionality.js
      notFound.js
      cacheControl.js
      serveServerSideRenderedFile:serveFile.js

    if(javascript/jspm.config.js) 
      serve jspm file (/asset/javascript/jspm.config.js).

if(/upload)
    setResponseHeaders.js
    languageContent.js
    useragentDetection.js
    bodyParser.js
    serverCommonFunctionality.js
    notFound.js
    cacheControl.js
    serveFile




arguments:"{"options":{"gzip":true}}"

*/
export async function initializeContentDelivery({ targetProjectConfig, entrypointKey, additionalData, port = serviceConfig.contentDelivery.port }) {
  let middlewareArray = [
    pickClientSideProjectConfig({ targetProjectConfig }),
    transformJavascriptMiddleware(),
    // serveStaticFile({ targetProjectConfig }),
    templateRenderingMiddleware(),
    // authorizationMiddleware(),
    // await graphMiddleware({ targetProjectConfig, entrypointKey }),
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
      context.compress = true
    },
  ]
  // create http server
  await createHttpServer({ label: `${serviceConfig.contentDelivery.serviceName}`, port, middlewareArray })
}

// Mainly user interface rendering.
export async function initializeContentRendering({ targetProjectConfig, entrypointKey = 'default', additionalData, port = serviceConfig.contentRendering.port }) {
  let middlewareArray = [
    templateRenderingMiddleware(),
    async (context, next) => {
      context.set('connection', 'keep-alive')
      await next()
    },
    await graphMiddleware({ targetProjectConfig, entrypointKey }),
  ]

  // create http server
  await createHttpServer({ label: `${serviceConfig.contentRendering.serviceName}`, port, middlewareArray })
}
