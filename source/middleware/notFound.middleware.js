import path from 'path'
import send from 'koa-sendfile'

export default () => {
  return async (context, next) => {
    // fallback to sending the app index. If not found.
    await next()
    if (404 != context.status) return
    // return send(context, path.normalize(`${context.instance.config.clientBasePath}/root/entrypoint.html`))
  }
}
