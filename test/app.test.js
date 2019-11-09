import assert from 'assert'
import http from 'http'
import { assert as chaiAssertion } from 'chai'
import utility from 'util'
import path from 'path'
import filesystem from 'fs'
import { application } from '..'
import ownProjectConfig from '../configuration'
const boltProtocolDriver = require('neo4j-driver').v1
import { memgraphContainer } from '@dependency/deploymentProvisioning'
import { setUnderscoreTemplateSetting, convertSharedStylesToJS } from '../'
import { streamToString } from '@dependency/streamToStringConvertion'

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

suite('Service components:', () => {
  setup(async () => await clearGraphData())

  suite('Test template rendering ', () => {
    test('Should render template correctly', async () => {
      setUnderscoreTemplateSetting()
      let renderedContent = await convertSharedStylesToJS({ filePath: path.normalize(path.join(__dirname, './asset/file.txt')) })
      console.log(await streamToString(renderedContent))
      // chaiAssertion.deepEqual(true, true)
    })
  })
})
