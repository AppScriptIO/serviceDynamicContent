import { transformJavascript } from '../../../functionality/babelTransformJsStream.js'

// transpile only on development and non-distribution folders, i.e. on-the-fly transpilation middleware is executed only in development, while in productios the distribution folder should be already transpiled.
export const transformJavascriptMiddleware = () => async (context, next) => {
  if (context.response.type == `application/javascript`) context.body = await transformJavascript({ scriptCode: context.body })
  await next()
}
