export function setResponseHeaders() {
  return async (context, next) => {
    // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).
    await context.set('Access-Control-Allow-Origin', '*')
    await context.set('connection', 'keep-alive')
    await next()
  }
}

export function cacheControl() {
  return async (context, next) => {
    context.set('Cache-Control', 'max-age=604800')
    await next()
  }
}
