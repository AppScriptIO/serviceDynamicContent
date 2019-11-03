import path from 'path'
import assert from 'assert'
const useragentParser = require('useragent') // https://www.npmjs.com/package/useragent
require('useragent/features')

// USAGE: localhost/?distribution="<clientSide folder name"
// This module defines context.instance.config.clientBasePath to be later used in template composition.
export const pickClientSideProjectConfig = ({ targetProjectConfig }) => async (context, next) => {
  let clientBasePath, clientSideFolderName
  let agent = useragentParser.lookup(context.request.headers['user-agent'])
  let clientSideProjectConfig = targetProjectConfig.clientSideProjectConfigList.find(config => config.targetAgent && config.targetAgent({ agent }))
  clientSideProjectConfig ||= targetProjectConfig.clientSideProjectConfigList.find(config => !config.targetAgent) // defualt to the configuration which is not restricted to specific client agent information.
  assert(clientSideProjectConfig, `• No clientSideProjectConfig was found satisfying the current agent header information.`)
  // set resolved clientSide config object
  context.clientSideProjectConfig = clientSideProjectConfig
  await next()
}
