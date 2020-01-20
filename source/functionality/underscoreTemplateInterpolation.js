import underscore from 'underscore'
export const underscoreTemplateInterpolationSetting = { evaluate: /\{\%(.+?)\%\}/g, interpolate: /\{\%=(.+?)\%\}/g, escape: /\{\%-(.+?)\%\}/g } // initial underscore template settings on first import gets applied on the rest.

/**
  Intended to be executed only once, as it affect the underscore module globally.
*/
let isUnderscoreConfigured = false // execute initialization of underscore only once.
export function setUnderscoreTemplateSetting(templateInterpolationSetting = underscoreTemplateInterpolationSetting) {
  if (isUnderscoreConfigured) return
  underscore.templateSettings = templateInterpolationSetting
  // console.info(`• Underscore template setting set as ${underscore.templateSettings.evaluate} ${underscore.templateSettings.interpolate} ${underscore.templateSettings.escape}`)
  isUnderscoreConfigured = true
}
