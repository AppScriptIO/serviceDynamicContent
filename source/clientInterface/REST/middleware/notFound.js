import path from 'path'
import send from 'koa-sendfile'
import * as symbol from '../symbol.reference.js'

export const notFound = () =>
  async function notFound(context, next) {
    // fallback to sending the app index. If not found.
    await next()
    if (404 != context.status) return
    return send(context, path.normalize(`${context[symbol.context.clientSideProjectConfig].path}/template/root/entrypoint.html`))
  }
