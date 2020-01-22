import path from 'path'
import filesystem from 'fs'
import stream from 'stream'
import { streamToString } from '@dependency/handleJSNativeDataStructure'

let babel, getBabelConfig // as in production appDeploymentLifecycle dependency doesn't exist.
try {
  babel = require('@babel/core')
  getBabelConfig = require('@deployment/javascriptTranspilation').getBabelConfig
} catch (error) {
  if (DEVELOPMENT) throw error
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
