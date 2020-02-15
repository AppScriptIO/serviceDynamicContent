import path from 'path'
import assert from 'assert'
import filesystem from 'fs'
import stream from 'stream'
import multistream from 'multistream'
import underscore from 'underscore'
import calculate from 'etag'
import send from 'koa-sendfile' // Static files.
// import serverStatic from 'koa-static' // Static files.
// import mount from 'koa-mount'
import { wrapStringStream } from '@dependency/handleJSNativeDataStructure'
import * as symbol from '../symbol.reference.js'
import * as renderReferenceContext from '../../../functionality/renderFile.js'
import * as processReferenceContext from '../../../functionality/postProcessFile.js'
var notfound = { ENOENT: true, ENAMETOOLONG: true, ENOTDIR: true }

/* resolve module without extension, defaulting to .js file (e.g. `/x/y/z` => `/x/y/z.js`)
  deal with requested resources that do not have an extension, intended to be resolved automatically.
*/
async function resolvePathExtension(requestedPath) {
  let fileStats = await filesystem.promises.stat(requestedPath).catch(error => {
    if (notfound[error.code]) return
    error.status = 500
    context.response.status = error.status
    throw error
  })

  if (fileStats) return requestedPath // in case a directory or the actual file is without an extension.

  return `${requestedPath}.js` // presume the path is ommitted as in Nodejs practice.
}

/**
 * serve static file.
 * @dependency useragentDetection middleware, userAgent modules
 * @param filepath maybe a partial path which uses basePath to create an absolute path, or it may provide a full path without basePath
 * @param basePath relative to the clientside source/distribution path.
 * @param context[symbol.context.clientSideProjectConfig] is a property created by a previous useragentDetection middleware
 */
export const serveStaticFile = ({ filePath, basePath } = {}) =>
  async function serveStaticFile(context, next) {
    assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)

    // // Previously used - koa-mount for serving directory contents:
    // let directoryPath = await path.resolve(path.normalize(`${context[symbol.context.clientSideProjectConfig].path}${basePath}`))
    // let mountMiddleware = mount(filePath || context.path, serverStatic(`${directoryPath}`, {}))

    context[symbol.context.parsed.filePath] = path.join(
      context[symbol.context.clientSideProjectConfig].path,
      basePath || '', // additional folder path.
      filePath || context.path, // a predefined path or an extracted url path
    )

    if (!path.extname(context[symbol.context.parsed.filePath])) context[symbol.context.parsed.filePath] = await resolvePathExtension(context[symbol.context.parsed.filePath])

    let fileStats = await send(context, context[symbol.context.parsed.filePath])

    await next()
  }

/**
 * Apply render function before serving file, $ function is extracted from context.path
 * servers serverside rendered javascript blocks or other rendering.
 * @dependency useragentDetection middleware, userAgent modules
 * @dependency templateRenderingMiddleware middleware, koa-views & underscore modules
 * @param context[symbol.context.clientSideProjectConfig] is a property created by a previous useragentDetection middleware
 * Resources:
 * - read streams and send them using koa - https://github.com/koajs/koa/issues/944 http://book.mixu.net/node/ch9.html
 */
export const serveServerSideRenderedFile = ({ basePath, filePath, renderType, processType, mimeType /*= 'application/javascript'*/ } = {}) => async (context, next) => {
  assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)

  filePath ||= context[symbol.context.parsed.path] // a predefined path or an extracted url path
  context[symbol.context.parsed.filePath] = path.join(context[symbol.context.clientSideProjectConfig].path, basePath || '', filePath)

  if (!path.extname(context[symbol.context.parsed.filePath])) context[symbol.context.parsed.filePath] = await resolvePathExtension(context[symbol.context.parsed.filePath])

  let renderFunction, processFunction
  try {
    if (!renderType && context[symbol.context.parsed.dollarSign]?.referenceContextName == 'render') {
      renderType = context[symbol.context.parsed.dollarSign].functionName
      renderFunction = renderReferenceContext[renderType] // the reference context is actually the module "renderFile.js"
      if (!renderFunction) throw new Error(`• function keyword in the url must have an equivalent in the function reference - "${renderType}" was not found.`)
    }
    if (!processType && context[symbol.context.parsed.dollarSign]?.referenceContextName == 'process') {
      processType = context[symbol.context.parsed.dollarSign].functionName
      processFunction = processReferenceContext[processType] // the reference context is actually the module "renderFile.js"
      if (!processFunction) throw new Error(`• function keyword in the url must have an equivalent in the function reference - "${processType}" was not found.`)
    }

    let fileStats = await filesystem.promises.stat(context[symbol.context.parsed.filePath]).catch(error => {
      if (notfound[error.code]) return
      error.status = 500
      context.response.status = error.status
      throw error
    })

    if (fileStats && fileStats.isFile()) {
      context.response.lastModified = fileStats.mtime
      context.response.length = fileStats.size
      context.response.type = mimeType || path.extname(context[symbol.context.parsed.filePath])
      if (!context.response.etag) context.response.etag = calculate(fileStats, { weak: true })

      // fresh based solely on last-modified - Check if a request cache is "fresh", aka the contents have not changed. This method is for cache negotiation between If-None-Match / ETag, and If-Modified-Since and Last-Modified. It should be referenced after setting one or more of these response headers.
      if (context.request.fresh) context.response.status = 304
      else {
        // render requested resource
        if (renderType) context.body = await renderFunction({ filePath: context[symbol.context.parsed.filePath] })
        else context.body = filesystem.createReadStream(context[symbol.context.parsed.filePath])
      }
    }

    await next()

    if (processType) context.body = await processFunction({ content: context.body })
  } catch (error) {
    error.status = 500
    context.response.status = error.status
    throw error
  }
}

// serve evaluated file. Implementation using render using underlying `underscore` through `consolidate` module(framework like).
// Takes into account
export const renderTemplateUsingKoaViews = ({ filePath, basePath }) =>
  async function renderTemplateUsingKoaViews(context, next) {
    assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
    let clientSidePath = context[symbol.context.clientSideProjectConfig].path
    let filePath_ = filePath || context.path // a predefined path or an extracted url path
    context[symbol.context.parsed.filePath] = path.join(
      clientSidePath,
      basePath || '', // additional folder path.
      filePath_,
    )

    if (filesystem.existsSync(context[symbol.context.parsed.filePath]) && filesystem.statSync(context[symbol.context.parsed.filePath]).isFile()) {
      await context.render(context[symbol.context.parsed.filePath], { argument: { context } })
      context.response.type = path.extname(context[symbol.context.parsed.filePath])
      await next()
    } else await next()
  }
