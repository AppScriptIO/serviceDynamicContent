import path from 'path'
import send from 'koa-sendfile'
import * as symbol from '../symbol.reference.js'

export const notFound = () =>
  async function notFound(context, next) {
    // fallback to sending the app index. If not found.
    await next()
    if (404 != context.status) return

    await send(context, path.normalize(`${context[symbol.context.clientSideProjectConfig].path}/asset/template/entrypoint.html`))

    // if still not found (if the html template was not found)
    if (!context.body && 404 != context.status) {
      context.body = 'Ops.. Not Found 404'
      context.status = 404 // set explicively, preserving status value.
    }
  }
