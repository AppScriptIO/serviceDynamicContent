export const handleOptionsRequest = async (context, next) => {
  context.set('Access-Control-Allow-Methods', '*' /* 'POST, GET, OPTIONS, DELETE' */)
  context.set('Access-Control-Allow-Headers', '*' /* 'Content-Type' */) // used as a response to preflight, indicating which headers can be used in the request.
  context.body = 'OK' // previous middlewares should have already defined cross origin all *.
}
