import underscore from 'underscore'
export const underscoreTemplateInterpolationSetting = { evaluate: /\{\%(.+?)\%\}/g, interpolate: /\{\%=(.+?)\%\}/g, escape: /\{\%-(.+?)\%\}/g } // initial underscore template settings on first import gets applied on the rest.

export function setUnderscoreTemplateSetting(templateInterpolationSetting = underscoreTemplateInterpolationSetting) {
  underscore.templateSettings = templateInterpolationSetting
  console.info(`• Underscore template setting set as ${underscore.templateSettings.evaluate} ${underscore.templateSettings.interpolate} ${underscore.templateSettings.escape}`)
}
