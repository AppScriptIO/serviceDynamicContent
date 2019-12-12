import path from 'path'
import filesystem from 'fs'
import Stream from 'stream'
import multistream from 'multistream'
import underscore from 'underscore'
import send from 'koa-sendfile' // Static files.
import { wrapStringStream } from '@dependency/wrapStringStream'
import * as symbol from '../symbol.reference.js'
import { convertSharedStylesToJS, combineHTMLImportWebcomponent, covertTextFileToJSModule, combineJSImportWebcomponent, evaluateJsTemplate } from '../../../renderFile.js'
import { renderLayoutTemplate } from '../../../layoutTemplateGraphRendering.js'

/** extract function name from keyword following $ signature.
 * Usage: `import html from './.html$convertTextToJSModule'`
 */
function extractDollarSignKeyword(string) {
  if (string.lastIndexOf('$') == -1) return false
  let keyword = string.substr(string.lastIndexOf('$') + 1, string.length) // $function extracted from url after '$' signature
  string.substr(0, string.lastIndexOf('$')) // remove function name
  return { signKeyword, stringWithRemovedSign }
}

//TODO:
export const serveServerSideRenderedFile = ({ basePath, filePath, renderType, mimeType } = {}) => async (context, next) => {
  let { signKeyword, stringWithRemovedSign } = extractDollarSignKeyword(filePath)
  filePath = stringWithRemovedSign // if sign exist the actual file path woule be what comes before `./.html$convertTextToJSModule`
  let renderType = signKeyword
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
export let serveStaticFile = ({ filePath, basePath } = {}) =>
  async function(context, next) {
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
export const renderSharedStyle = ({ filePath, basePath }) => async (context, next) => {
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path
  let filePath_ = filePath || context.path // a predefined path or an extracted url path
  let absoluteFilePath = path.join(
    clientSidePath,
    basePath || '', // additional folder path.
    filePath_,
  )
  context.body = await convertSharedStylesToJS({ filePath: absoluteFilePath })
  context.response.type = 'application/javascript'
  await next()
}

export const renderFileAsJSModule = ({ filePath, basePath }) => async (context, next) => {
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path
  let filePath_ = filePath || context.path // a predefined path or an extracted url path
  let absoluteFilePath = path.join(
    clientSidePath,
    basePath || '', // additional folder path.
    filePath_,
  )
  context.body = await covertTextFileToJSModule({ filePath: absoluteFilePath })
  context.response.type = 'application/javascript'
  await next()
}

export const renderHTMLImportWebcomponent = ({ filePath, basePath }) => async (context, next) => {
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

export const renderJSImportWebcomponent = ({ filePath, basePath }) => async (context, next) => {
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
export const renderJsTemplateUsingUnderscore = ({ filePath, basePath }) => async (context, next) => {
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path
  let filePath_ = filePath || context.path // a predefined path or an extracted url path
  let absoluteFilePath = path.join(
    clientSidePath,
    basePath || '', // additional folder path.
    filePath_,
  )
  try {
    context.body = evaluateJsTemplate({ filePath: absoluteFilePath, setting: context /** Refactor context propeties to match the settings - i.e. pass object that relies on context */ })
    context.response.type = mimeType // TODO: detect MIME type automatically and support other mimes.
  } catch (error) {
    console.log(error)
    await next()
  }
}

// serve evaluated file. Implementation using render using underscore (framework like).
export const renderJsTemplateKoaMiddleware = ({ filePath, basePath }) => async (context, next) => {
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path
  let filePath_ = filePath || context.path // a predefined path or an extracted url path
  let absoluteFilePath = path.join(
    clientSidePath,
    basePath || '', // additional folder path.
    filePath_,
  )

  if (filesystem.existsSync(absoluteFilePath) && filesystem.statSync(absoluteFilePath).isFile()) {
    await context.render(absoluteFilePath, {
      settings: context, // TODO refactor
      view: {},
      argument: { layoutElement: 'webapp-layout-list' },
    })
    context.response.type = path.extname(absoluteFilePath)
    await next()
  } else await next()
}

export const renderTemplateDocument = ({ documentKey }) => async (context, next) => {
  context.body = await renderLayoutTemplate({ documentKey })
  await next()
}
