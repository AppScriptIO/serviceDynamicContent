export function authorizationMiddleware() {
  return async (context, next) => {
    // Authorization access example:
    let token = await OAuthClass.authenticateMiddleware()(context.request, context.response)
    if (token) {
      await next()
    } else {
      console.log('Sorry unauthorized access')
    }
    await next()
  }
}
