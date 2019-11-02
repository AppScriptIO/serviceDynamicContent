import path from 'path'
const useragentParser = require('useragent') // https://www.npmjs.com/package/useragent
require('useragent/features')

function isES5(agent) {
  switch (
    agent.family // Polymer serve https://github.com/Polymer/tools/blob/707ae99d2c0fd6e3edd7894d98a45ce574b39e6d/packages/browser-capabilities/src/browser-capabilities.ts
  ) {
    case 'Chrome':
    case 'Chromium':
    case 'Chrome Headless':
      return agent.satisfies('<49.0.0') ? true : false
    case 'Opera':
    case 'OPR':
      return agent.satisfies('<36.0.0') ? true : false
    case 'Vivaldi':
      return agent.satisfies('<1') ? true : false
    case 'Safari':
    case 'Mobile Safari':
      return agent.satisfies('<10.0.0') ? true : false
    case 'Firefox':
      return agent.satisfies('<51.0.0') ? true : false
    case 'Edge':
      return agent.satisfies('<15.0.63') ? true : false
    case 'Other':
    default:
      return agent.source.toLowerCase().includes('postman') ? false : false // default for native version rather than previous choice of polyfill as defalult
      break
  }
}
// USAGE: localhost/?distribution="<clientSide folder name"
// This module defines context.instance.config.clientBasePath to be later used in template composition.
export default async (context, next) => {
  let clientBasePath, clientSideFolderName
  let agent = useragentParser.lookup(context.request.headers['user-agent'])

  context.instance.distribution = isES5(agent) ? 'polyfill' : 'native'
  switch (context.instance.distribution) {
    case 'polyfill':
      clientSideFolderName = Application.config.distribution.clientSide.polyfill.prefix
      break
    case 'native':
      clientSideFolderName = Application.config.distribution.clientSide.native.prefix
      break
  }

  if (Application.config.DEPLOYMENT == 'production') {
    clientBasePath = Application.config.distributionPath
  } else if (Application.config.DEPLOYMENT == 'development') {
    if (Application.config.DISTRIBUTION) {
      clientBasePath = Application.config.distributionPath
    } else {
      clientBasePath = Application.config.sourceCodePath
      clientSideFolderName = Application.config.directory.clientSide.folderName
    }
  }

  if (context.request.query.distribution) {
    clientBasePath = Application.config.distributionPath
    clientSideFolderName = context.request.query.distribution
  }

  // set resolved clientSide directory path.
  context.instance.config.clientSidePath = path.join(clientBasePath, clientSideFolderName)
  await next()
}
