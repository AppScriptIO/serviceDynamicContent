import underscore from 'underscore'
import koaViews from 'koa-views'

export function createTemplateRenderingMiddleware() {
  underscore.templateSettings = serviceConfig.underscore
  console.info(`• Underscore template setting set as ${underscore.templateSettings.evaluate} ${underscore.templateSettings.interpolate} ${underscore.templateSettings.escape}`)
  return koaViews('/', { map: { html: 'underscore', js: 'underscore' } })
}
