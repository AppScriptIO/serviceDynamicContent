import path from 'path'
import assert from 'assert'
import filesystem from 'fs'
import Stream from 'stream'
import multistream from 'multistream'
import underscore from 'underscore'
import send from 'koa-sendfile' // Static files.
import { wrapStringStream } from '@dependency/wrapStringStream'
import * as symbol from '../symbol.reference.js'
import {
  convertSharedStylesToJS,
  covertTextFileToJSModule,
  renderTemplateEvaluatingJs,
  renderTemplateInsertionPosition,
  combineJSImportWebcomponent,
  combineHTMLImportWebcomponent,
  renderGraphTemplate,
} from '../../../functionality/renderFile.js'
import * as renderFile from '../../../functionality/renderFile.js'

/** extract function name from keyword following $ signature.
 * Usage: `import html from './.html$convertTextToJSModule'`
 */
function extractDollarSignKeyword(string) {
  if (string.lastIndexOf('$') == -1) return false
  let keyword = string.substr(string.lastIndexOf('$') + 1, string.length) // $function extracted from url after '$' signature
  string = string.substr(0, string.lastIndexOf('$')) // remove function name
  return { signKeyword: keyword, stringWithRemovedSign: string }
}

export const serveServerSideRenderedFile = ({ basePath, filePath, renderType, mimeType = 'application/javascript' } = {}) => async (context, next) => {
  assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)

  filePath ||= context.path // a predefined path or an extracted url path
  basePath ||= '' // additional folder path.

  if (!renderType) {
    let { signKeyword, stringWithRemovedSign } = extractDollarSignKeyword(filePath)
    filePath = stringWithRemovedSign // if sign exist the actual file path woule be what comes before `./.html$convertTextToJSModule`
    renderType ||= signKeyword
  }

  let absoluteFilePath = path.join(context[symbol.context.clientSideProjectConfig].path, basePath, filePath)
  //TODO: - reconsider the function context used for referencing the dollar extracted function keyword.
  let functionReference = renderFile[renderType] // the reference context is actually the module "renderFile.js"
  assert(functionReference, `• function keyword in the url must have an equivalent in the function reference.`)
  context.body = await functionReference({ filePath: absoluteFilePath })
  context.response.type = mimeType
  await next()
}

// import serverStatic from 'koa-static' // Static files.
// import mount from 'koa-mount'
// export let serverDirectory() {
// Previously used - serving directoryPath:
// let directoryPath = await path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.directoryPath}`))
// let mountMiddleware = mount(setting.urlPath, serverStatic(`${directoryPath}`, setting.options))
// }

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
    let absoluteFilePath = path.join(
      context[symbol.context.clientSideProjectConfig].path,
      basePath || '', // additional folder path.
      filePath || context.path, // a predefined path or an extracted url path
    )
    let fileStats = await send(context, absoluteFilePath)
    // if file doesn't exist then pass to the next middleware.
    if (!fileStats || !fileStats.isFile()) await next()
  }

/**
 * servers serverside rendered javascript blocks or other rendering.
 * @dependency useragentDetection middleware, userAgent modules
 * @dependency templateRenderingMiddleware middleware, koa-views & underscore modules
 * @param context[symbol.context.clientSideProjectConfig] is a property created by a previous useragentDetection middleware
 * Resources:
 * - read streams and send them using koa - https://github.com/koajs/koa/issues/944 http://book.mixu.net/node/ch9.html
 */
export const renderSharedStyle = ({ filePath, basePath, mimeType = 'application/javascript' }) =>
  async function renderSharedStyle(context, next) {
    assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
    let clientSidePath = context[symbol.context.clientSideProjectConfig].path
    let filePath_ = filePath || context.path // a predefined path or an extracted url path
    let absoluteFilePath = path.join(
      clientSidePath,
      basePath || '', // additional folder path.
      filePath_,
    )
    context.body = await convertSharedStylesToJS({ filePath: absoluteFilePath })
    context.response.type = mimeType
    await next()
  }

export const renderFileAsJSModule = ({ filePath, basePath, mimeType = 'application/javascript' }) =>
  async function renderFileAsJSModule(context, next) {
    assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
    let clientSidePath = context[symbol.context.clientSideProjectConfig].path
    let filePath_ = filePath || context.path // a predefined path or an extracted url path
    let absoluteFilePath = path.join(
      clientSidePath,
      basePath || '', // additional folder path.
      filePath_,
    )
    context.body = await covertTextFileToJSModule({ filePath: absoluteFilePath })
    context.response.type = mimeType
    await next()
  }

export const renderHTMLImportWebcomponent = ({ filePath, basePath }) =>
  async function renderHTMLImportWebcomponent(context, next) {
    assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
    let clientSidePath = context[symbol.context.clientSideProjectConfig].path
    let filePath_ = filePath || context.path // a predefined path or an extracted url path
    let absoluteFilePath = path.join(
      clientSidePath,
      basePath || '', // additional folder path.
      filePath_,
    )
    context.body = await combineHTMLImportWebcomponent({ filePath: absoluteFilePath })
    await next()
  }

export const renderJSImportWebcomponent = ({ filePath, basePath }) =>
  async function renderJSImportWebcomponent(context, next) {
    assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
    let clientSidePath = context[symbol.context.clientSideProjectConfig].path
    let filePath_ = filePath || context.path // a predefined path or an extracted url path
    let absoluteFilePath = path.join(
      clientSidePath,
      basePath || '', // additional folder path.
      filePath_,
    )
    context.body = await combineJSImportWebcomponent({ filePath: absoluteFilePath })
    await next()
  }

// Implementation using filesystem read and underscore template, with a mime type e.g. `application/javascript`
export const renderJsTemplateUsingUnderscore = ({ filePath, basePath }) =>
  async function renderJsTemplateUsingUnderscore(context, next) {
    assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
    let clientSidePath = context[symbol.context.clientSideProjectConfig].path
    let filePath_ = filePath || context.path // a predefined path or an extracted url path
    let absoluteFilePath = path.join(
      clientSidePath,
      basePath || '', // additional folder path.
      filePath_,
    )
    try {
      context.body = renderTemplateEvaluatingJs({ filePath: absoluteFilePath, argument: { context } })
      context.response.type = mimeType // TODO: detect MIME type automatically and support other mimes.
    } catch (error) {
      console.log(error)
      await next()
    }
  }

// serve evaluated file. Implementation using render using underlying `underscore` through `consolidate` module(framework like).
// Takes into account
export const renderTemplateUsingKoaViews = ({ filePath, basePath }) =>
  async function renderTemplateUsingKoaViews(context, next) {
    assert(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
    let clientSidePath = context[symbol.context.clientSideProjectConfig].path
    let filePath_ = filePath || context.path // a predefined path or an extracted url path
    let absoluteFilePath = path.join(
      clientSidePath,
      basePath || '', // additional folder path.
      filePath_,
    )

    if (filesystem.existsSync(absoluteFilePath) && filesystem.statSync(absoluteFilePath).isFile()) {
      await context.render(absoluteFilePath, { argument: { context } })
      context.response.type = path.extname(absoluteFilePath)
      await next()
    } else await next()
  }
