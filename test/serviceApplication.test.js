import assert from 'assert'
import http from 'http'
import { assert as chaiAssertion } from 'chai'
import utility from 'util'
import path from 'path'
import filesystem from 'fs'
import { service } from '..'
import ownProjectConfig from '../configuration'
const boltProtocolDriver = require('neo4j-driver').v1
import { memgraphContainer } from '@dependency/deploymentProvisioning'
async function clearGraphData() {
  console.groupCollapsed('• Run prerequisite containers:')
  memgraphContainer.runDockerContainer() // temporary solution
  console.groupEnd()
  // Delete all nodes in the in-memory database
  console.log('• Cleared graph database.')
  const url = { protocol: 'bolt', hostname: 'localhost', port: 7687 },
    authentication = { username: 'neo4j', password: 'test' }
  const graphDBDriver = boltProtocolDriver.driver(`${url.protocol}://${url.hostname}:${url.port}`, boltProtocolDriver.auth.basic(authentication.username, authentication.password))
  let session = await graphDBDriver.session()
  let result = await session.run(`match (n) detach delete n`)
  session.close()
}

// Mock project configuration settings that the service depends upon.
const targetProjectConfig = Object.assign({
  runtimeVariable: {
    DEPLOYMENT: 'development', // Deployment type
    DISTRIBUTION: false,
  },
  clientSideProjectConfigList: [{ path: path.join(__dirname, 'asset/clientSide') }],
})

suite('Service components:', () => {
  setup(async () => await clearGraphData())

  suite('REST API - Http server', () => {
    const port = 9999
    const url = `http://localhost:${port}`
    test('Should respond to requests', async () => {
      await service.restApi.initializeAssetContentDelivery({ port, targetProjectConfig }).catch(error => throw error)

      try {
        await new Promise((resolve, reject) => {
          let urlPath = `/@javascript`
          http.get(`${url}${urlPath}`, response => resolve())
        })
        await new Promise((resolve, reject) => {
          let urlPath = `/asset`
          http.get(`${url}${urlPath}`, response => resolve())
        })
        await new Promise((resolve, reject) => {
          let urlPath = `/upload`
          http.get(`${url}${urlPath}`, response => resolve())
        })
      } catch (error) {
        throw error
      }
    })
  })
})
