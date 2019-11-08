export const pickClientSideConfiguration = ({ clientSideProjectConfigList /* list of clientSide repository module */, agentInstance /** instance of 'useragent' module */ }) => {
  let clientSideProjectConfig = clientSideProjectConfigList.find(config => config.targetAgent && config.targetAgent({ agent }))
  clientSideProjectConfig ||= clientSideProjectConfigList.find(config => !config.targetAgent) // defualt to the configuration which is not restricted to specific client agent information.
  assert(clientSideProjectConfig, `• No clientSideProjectConfig was found satisfying the current agent header information.`)
  return clientSideProjectConfig
}
