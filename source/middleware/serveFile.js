import path from 'path'
import filesystem from 'fs'
import Stream from 'stream'
import multistream from 'multistream'
import underscore from 'underscore'
import send from 'koa-sendfile' // Static files.
import { wrapStringStream } from '@dependency/wrapStringStream'
import * as symbol from '../symbol.reference.js'
import { convertSharedStylesToJS, renderHTMLImportWebcomponent, covertTextFileToJSModule, renderJSImportWebcomponent, renderTemplateDocument } from '../utility/renderFile.js'

// import serverStatic from 'koa-static' // Static files.
// import mount from 'koa-mount'
// export let serverDirectory() {
// Previously used - serving directoryPath:
// let directoryPath = await path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.directoryPath}`))
// let mountMiddleware = mount(setting.urlPath, serverStatic(`${directoryPath}`, setting.options))
// }

/**
 * serve static file.
 * @dependence userAgent middleware
 * @param filepath maybe a partial path which uses basePath to create an absolute path, or it may provide a full path without basePath
 * @param basePath relative to the clientside source/distribution path.
 */
export let serveStaticFile = ({ targetProjectConfig, filePath, basePath } = {}) =>
  async function(context, next) {
    let relativeFilePath = filePath || context.path // a predefined path or an extracted url path
    let baseFolderRelativePath = basePath || '' // additional folder path.
    let absoluteFilePath = path.join(context[symbol.context.clientSideProjectConfig].path, basePath, relativeFilePath)

    let fileStats = await send(context, absoluteFilePath)
    // if file doesn't exist then pass to the next middleware.
    if (!fileStats || !fileStats.isFile()) await next()
  }

// read streams and send them using koa - https://github.com/koajs/koa/issues/944 http://book.mixu.net/node/ch9.html
// TODO: change file name to something like 'render serverside javascript' & convert function to be used for other files not only web components.
export const serveServerSideRenderedFile = option => async (context, next) => {
  let clientSidePath = context.instance.config.clientSidePath
  let baseFolderRelativePath = option.directoryRelativePath || '' // additional folder path.
  let filePath = option.filePath || context.path // a predefined path or an extracted url path
  let renderType = option.renderType // check if renderType is in nested unit options/arguments if not use the $ in filePath (as all paths should contain $ sign from url because the condition claims it, can be overridden using option argument)
    ? option.renderType
    : filePath.substr(filePath.lastIndexOf('$') + 1, filePath.length) // $function extracted from url after '$' signature
  let lastIndexPosition = filePath.lastIndexOf('$') == -1 ? filePath.length : filePath.lastIndexOf('$')
  let relativeFilePath = option.renderType ? filePath : filePath.substr(0, lastIndexPosition) // remove function name
  let absoluteFilePath = path.normalize(path.join(clientSidePath, baseFolderRelativePath, relativeFilePath))

  let renderedContent
  switch (renderType) {
    case 'convertSharedStylesToJS':
      renderedContent = await convertSharedStylesToJS({ filePath: absoluteFilePath, context })
      context.body = renderedContent
      context.response.type = 'application/javascript'
      await next()
      break

    case 'covertTextFileToJSModule':
      renderedContent = await covertTextFileToJSModule({ filePath: absoluteFilePath, context })
      context.body = renderedContent
      context.response.type = 'application/javascript'
      await next()
      break

    case 'renderHTMLImportWebcomponent':
      renderedContent = renderHTMLImportWebcomponent({ filePath: absoluteFilePath, context })
      context.body = renderedContent
      await next()
      break

    case 'renderJSImportWebcomponent':
      renderedContent = renderJSImportWebcomponent({ filePath: absoluteFilePath, context })
      context.response.type = 'application/javascript'
      context.body = renderedContent
      await next()
      break

    default:
      if (option.mimeType) {
        // Implementation using filesystem read and underscore template, with a mime type e.g. `application/javascript`
        try {
          // render template
          renderedContent = filesystem.readFileSync(absoluteFilePath, 'utf8')
          context.body = underscore.template(renderedContent)({
            Application,
            context,
            view: {},
            argument: {},
          }) // Koa handles the stream and send it to the client.
          // TODO: detect MIME type automatically and support other mimes.
          context.response.type = option.mimeType
        } catch (error) {
          console.log(error)
          await next()
        }
      } else {
        if (filesystem.existsSync(absoluteFilePath) && filesystem.statSync(absoluteFilePath).isFile()) {
          // serve rendered file. Implementation using render using underscore (framework like).
          await context.render(absoluteFilePath, {
            context,
            Application,
            view: {},
            argument: { layoutElement: 'webapp-layout-list' },
          })
          context.response.type = path.extname(absoluteFilePath)
          await next()
        } else {
          await next()
        }
      }
      break
  }
}
