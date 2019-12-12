import koaViews from 'koa-views'
import { setUnderscoreTemplateSetting } from '../../../underscoreTemplateInterpolation.js'

export function templateRenderingMiddleware() {
  setUnderscoreTemplateSetting()
  return koaViews('/', { map: { html: 'underscore', js: 'underscore' } })
}
