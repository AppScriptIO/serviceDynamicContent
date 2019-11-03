import compose from 'koa-compose'
import responseTime from 'koa-response-time'
import logger from 'koa-logger'
// import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
// import cors from 'kcors'
// import helmet from 'koa-helmet'
import error from 'koa-json-error'
// import enforceHTTPS from 'koa-sslify'
import koaCompress from 'koa-compress'
import zlib from 'zlib'

// Database
import { handleConnection, createDatabase, createTable } from './commonDatabaseFunctionality.js'

let middlewareArray = [
  responseTime(), // Response time x-response-time
  logger(), // Console logger
  // bodyParser(),
  // cors(), // Cross-Origin Resource Sharing(CORS)
  error(), // Error handler for pure-JSON Koa apps
  // handleConnection(), // Open connection on middleware downstream, Close connection on upstream.
  // createDatabase(),
  // createTable(),
  koaCompress({
    flush: zlib.Z_SYNC_FLUSH,
  }),
]
if (!serverConfig.ssl) {
  // middleware.push(compress())  // Compress responses
  // middleware.push(enforceHTTPS())
  // middleware.push(helmet()) // Security header middleware collection
}

export default () => compose(middlewareArray)
