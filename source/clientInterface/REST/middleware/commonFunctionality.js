import compose from 'koa-compose'
import responseTime from 'koa-response-time'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors'
// import helmet from 'koa-helmet'
import error from 'koa-json-error'
// import enforceHTTPS from 'koa-sslify'
import koaCompress from 'koa-compress'
import zlib from 'zlib'

export const commonFunctionality = ({ ssl = false } = {}) => {
  let middlewareArray = [
    // async (context, next) => {
    //   /* Important: that using this is not supported by Koa. This may break intended functionality of Koa middleware and Koa itself. Using this property is considered a hack and is only a convenience to those wishing to use traditional fn(req, res) functions and middleware within Koa.
    //     This will cause Koa to hang.
    //   */
    //   // context.respond = false // bypass default koa built-in response handling
    //   await next()
    // },
    responseTime(), // Response time x-response-time
    logger(), // Console logger
    // bodyParser(),
    // cors(), // Cross-Origin Resource Sharing(CORS)

    // Only for debugging, as it exposes nodejs error on response.
    // error(), // Error handler for pure-JSON Koa apps - this will return error when
    koaCompress({ flush: zlib.Z_SYNC_FLUSH }),
  ]
  if (!ssl)
    middlewareArray = [
      ...middlewareArray,
      // enforceHTTPS(),
      // helmet()
    ]

  return compose(middlewareArray)
}
