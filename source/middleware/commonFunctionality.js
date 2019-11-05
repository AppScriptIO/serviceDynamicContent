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
    responseTime(), // Response time x-response-time
    logger(), // Console logger
    // bodyParser(),
    // cors(), // Cross-Origin Resource Sharing(CORS)
    error(), // Error handler for pure-JSON Koa apps
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
