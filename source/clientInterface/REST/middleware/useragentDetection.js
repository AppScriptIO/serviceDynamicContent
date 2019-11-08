import path from 'path'
import assert from 'assert'
import * as symbol from '../symbol.reference.js'
import { pickClientSideConfiguration } from '../../../../'
const useragentParser = require('useragent') // https://www.npmjs.com/package/useragent
require('useragent/features')

// USAGE: localhost/?distribution="<clientSide folder name"
// This module defines context.instance.config.clientBasePath to be later used in template composition.
export const pickClientSideProjectConfig = ({ targetProjectConfig }) => async (context, next) => {
  let agent = useragentParser.lookup(context.request.headers['user-agent'])
  // set resolved clientSide config object
  context[symbol.context.clientSideProjectConfig] = pickClientSideConfiguration({ clientSideProjectConfigList: targetProjectConfig.clientSideProjectConfigList, agentInstance: agent })
  await next()
}
