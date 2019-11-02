import filesystem from 'fs'
import { createServer } from './server.js'
import { createTemplateRenderingMiddleware } from './middleware/templateRendering.js'
import { graphMiddleware } from './middleware/graphMiddleware.js'

export async function initialize({ targetProjectConfig, entrypointKey = 'default', additionalData }) {
  let middlewareArray = [
    createTemplateRenderingMiddleware(),
    async (context, next) => {
      context.set('connection', 'keep-alive')
      await next()
    },
    await graphMiddleware({ targetProjectConfig, entrypointKey }),
  ]

  // create http server
  await createServer({ port: 11, middlewareArray })
}
