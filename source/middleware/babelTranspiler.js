import path from 'path'
import filesystem from 'fs'
import stream from 'stream'
import { streamToString } from '@dependency/streamToStringConvertion'

let babel, getBabelConfig // as in production appDeploymentLifecycle dependency doesn't exist.
try {
  babel = require('@babel/core')
  getBabelConfig = require('@dependency/javascriptTranspilation').getBabelConfig
} catch (error) {
  if (DEVELOPMENT) throw error
}

// transpile only on development and non-distribution folders, i.e. on-the-fly transpilation middleware is executed only in development, while in productios the distribution folder should be already transpiled.
export const transformJavascriptMiddleware = () => async (context, next) => {
  if (context.response.type == `application/javascript`) context.body = await transformJavascript({ scriptCode: context.body })
  await next()
}

export async function transformJavascript({
  scriptCode,
  transformBabelPreset = getBabelConfig('nativeClientSideRuntime.BabelConfig.js').presets,
  transformBabelPlugin = getBabelConfig('nativeClientSideRuntime.BabelConfig.js').plugins,
}: {
  scriptCode: stream,
}) {
  if (transformBabelPlugin.length) {
    // convert stream into string
    if (scriptCode instanceof stream.Stream) scriptCode = await streamToString(scriptCode)
    // transform code using array of plugins.
    let transformedObject = babel.transformSync(scriptCode, { presets: transformBabelPreset, plugins: transformBabelPlugin })
    return transformedObject.code // object containing 'code' property
  }
}
