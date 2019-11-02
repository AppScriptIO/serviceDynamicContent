import underscore from 'underscore'
import koaViews from 'koa-views'
import { underscoreTemplateInterpolationSetting } from '../utility/underscoreTemplateInterpolation.js'

export function createTemplateRenderingMiddleware() {
  underscore.templateSettings = underscoreTemplateInterpolationSetting
  console.info(`• Underscore template setting set as ${underscore.templateSettings.evaluate} ${underscore.templateSettings.interpolate} ${underscore.templateSettings.escape}`)
  return koaViews('/', { map: { html: 'underscore', js: 'underscore' } })
}
