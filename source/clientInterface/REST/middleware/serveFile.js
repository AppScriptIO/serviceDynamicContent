import path from 'path'
import filesystem from 'fs'
import Stream from 'stream'
import multistream from 'multistream'
import underscore from 'underscore'
import send from 'koa-sendfile' // Static files.
import { wrapStringStream } from '@dependency/wrapStringStream'
import * as symbol from '../symbol.reference.js'
import { convertSharedStylesToJS, renderHTMLImportWebcomponent, covertTextFileToJSModule, renderJSImportWebcomponent, evaluateJsTemplate } from '../../../../'
import { renderLayoutTemplate } from '../../../../'

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
export const serveServerSideRenderedFile = ({ basePath, filePath, renderType, mimeType } = {}) => async (context, next) => {
  let filePath_ = filePath || context.path // a predefined path or an extracted url path
  // check if renderType is in nested unit options/arguments if not use the $ in filePath (as all paths should contain $ sign from url because the condition claims it, can be overridden using option argument)
  let renderType_ = renderType ? renderType : filePath_.substr(filePath_.lastIndexOf('$') + 1, filePath_.length) // $function extracted from url after '$' signature
  let lastIndexPosition = filePath_.lastIndexOf('$') == -1 ? filePath_.length : filePath_.lastIndexOf('$')
  let absoluteFilePath = path.join(
    context[symbol.context.clientSideProjectConfig].path,
    basePath || '', // additional folder path.
    renderType_ ? filePath_ : filePath_.substr(0, lastIndexPosition), // remove function name
  )

  let renderedContent
  switch (renderType_) {
    case 'convertSharedStylesToJS':
      context.body = await convertSharedStylesToJS({ filePath: absoluteFilePath })
      context.response.type = 'application/javascript'
      await next()
      break

    case 'covertTextFileToJSModule':
      context.body = await covertTextFileToJSModule({ filePath: absoluteFilePath })
      context.response.type = 'application/javascript'
      await next()
      break

    case 'renderHTMLImportWebcomponent':
      context.body = renderHTMLImportWebcomponent({ filePath: absoluteFilePath })
      await next()
      break

    case 'renderJSImportWebcomponent':
      context.response.type = 'application/javascript'
      context.body = renderJSImportWebcomponent({ filePath: absoluteFilePath })
      await next()
      break

    default:
      if (mimeType)
        // Implementation using filesystem read and underscore template, with a mime type e.g. `application/javascript`
        try {
          context.body = evaluateJsTemplate({ filePath: absoluteFilePath, setting: context /** Refactor context propeties to match the settings - i.e. pass object that relies on context */ })
          context.response.type = mimeType // TODO: detect MIME type automatically and support other mimes.
        } catch (error) {
          console.log(error)
          await next()
        }
      else if (filesystem.existsSync(absoluteFilePath) && filesystem.statSync(absoluteFilePath).isFile()) {
        // serve evaluated file. Implementation using render using underscore (framework like).
        await context.render(absoluteFilePath, {
          settings: context, // TODO refactor
          view: {},
          argument: { layoutElement: 'webapp-layout-list' },
        })
        context.response.type = path.extname(absoluteFilePath)
        await next()
      } else await next()

      break
  }
}

export const renderTemplateDocument = ({ documentKey }) => async (context, next) => {
  context.body = await renderLayoutTemplate({ documentKey })
  await next()
}
