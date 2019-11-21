export function setResponseHeaders() {
  return async (context, next) => {
    // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).
    await context.set('Access-Control-Allow-Origin', '*')
    await context.set('connection', 'keep-alive')
    // for specific middleware module
    context.compress = true
    await next()
  }
}

export function cacheControl() {
  return async (context, next) => {
    context.set('Cache-Control', 'max-age=604800')
    await next()
  }
}

export const handleOptionsRequest = async (context, next) => {
  context.set('Access-Control-Allow-Methods', '*' /* 'POST, GET, OPTIONS, DELETE' */)
  context.set('Access-Control-Allow-Headers', '*' /* 'Content-Type' */) // used as a response to preflight, indicating which headers can be used in the request.
  context.body = 'OK' // previous middlewares should have already defined cross origin all *.
}
