import koaViews from 'koa-views'
import { setUnderscoreTemplateSetting } from '../../../../'

export function templateRenderingMiddleware() {
  setUnderscoreTemplateSetting()
  return koaViews('/', { map: { html: 'underscore', js: 'underscore' } })
}
