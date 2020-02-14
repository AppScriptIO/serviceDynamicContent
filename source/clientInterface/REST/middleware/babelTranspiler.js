import { transformJavascript } from '../../../functionality/babelTransformJsStream.js'

// transpile only on development and non-distribution folders, i.e. on-the-fly transpilation middleware is executed only in development, while in productios the distribution folder should be already transpiled.
export const transformJavascriptMiddleware = () =>
  async function transformJavascriptMiddleware(context, next) {
    // if (context.response.type.includes('application/javascript'))
    
    // only if file serve function was successful
    if(context.response.status == 200) {
      try {
        context.body = await transformJavascript({ scriptCode: context.body, filePath: context[symbol.context.parsed.filePath] })
      } catch (error) {
        error.status = 500
        context.response.status = error.status
        throw error
      }
    }
    await next()
  }
