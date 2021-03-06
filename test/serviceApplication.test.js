import assert from 'assert'
import http from 'http'
import { assert as chaiAssertion } from 'chai'
import utility from 'util'
import path from 'path'
import loadtest from 'loadtest'
import filesystem from 'fs'
import { service } from '..'
import ownProjectConfig from '../configuration'
const boltProtocolDriver = require('neo4j-driver').v1
import { streamToString } from '@dependency/handleJSNativeDataStructure'
import { container } from '@deployment/deploymentScript'

async function clearGraphData() {
  console.groupCollapsed('• Run prerequisite containers:')
  container.memgraph.runDockerContainer() // temporary solution
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
  suiteSetup(async () => await clearGraphData())

  suite('Asset content delivery: REST API - Http server', () => {
    const port = 9991
    const url = `http://localhost:${port}`
    test('Should respond to requests and responed correctly', async () => {
      await service.restApi.initializeAssetContentDelivery({ port, targetProjectConfig }).catch(error => throw error)

      {
        let responseStream = await new Promise((resolve, reject) => {
          let urlPath = `/upload/file.txt`
          http.get(`${url}${urlPath}`, response => resolve(response))
        })

        assert(responseStream.statusCode == 200, `• Response return non successful statusCode.`)
        let content = await streamToString(responseStream)
        assert(content === filesystem.readFileSync(path.join(__dirname, 'asset', 'clientSide/asset/upload/file.txt'), { encoding: 'utf-8' }), `• Correct content must be served.`)
      }
      {
        let responseStream = await new Promise((resolve, reject) => {
          let urlPath = `/@javascript/file.js`
          let content = http.get(`${url}${urlPath}`, response => resolve(response))
        })

        assert(responseStream.statusCode == 200, `• Response return non successful statusCode.`)
        let content = await streamToString(responseStream)
        assert(content === filesystem.readFileSync(path.join(__dirname, 'asset', 'clientSide/asset/javascript/file.js'), { encoding: 'utf-8' }), `• Correct content must be served.`)
      }
      {
        let responseStream = await new Promise((resolve, reject) => {
          let urlPath = `/asset/file.css`
          http.get(`${url}${urlPath}`, response => resolve(response))
        })

        assert(responseStream.statusCode == 200, `• Response return non successful statusCode.`)
        let content = await streamToString(responseStream)
        assert(content === filesystem.readFileSync(path.join(__dirname, 'asset', 'clientSide/asset/file.css'), { encoding: 'utf-8' }), `• Correct content must be served.`)
      }
      {
        let responseStream = await new Promise((resolve, reject) => {
          let urlPath = `/asset/file.txt$covertTextFileToJSModule`
          let content = http.get(`${url}${urlPath}`, response => resolve(response))
        })

        assert(responseStream.statusCode == 200, `• Response return non successful statusCode.`)
        let content = await streamToString(responseStream)
        assert(content === filesystem.readFileSync(path.join(__dirname, 'fixture', 'covertTextFileToJSModule'), { encoding: 'utf-8' }), `• Correct content must be served.`)
      }
      {
        // test explicitely mentioned paths in the graph:
        let responseStream = await new Promise((resolve, reject) => {
          let urlPath = `/javascript/jspm.config.js`
          http.get(`${url}${urlPath}`, response => resolve(response))
        })

        assert(responseStream.statusCode == 200, `• Response return non successful statusCode.`)
        let content = await streamToString(responseStream)
        assert(content === filesystem.readFileSync(path.join(__dirname, 'asset', 'clientSide/asset/javascript/file.js'), { encoding: 'utf-8' }), `• Correct content must be served.`)
      }
    })
  })

  suite('Root content rendering: REST API - Http server', () => {
    const port = 9992
    const url = `http://localhost:${port}`
    test('Should respond to requests', async () => {
      await service.restApi.initializeRootContentRendering({ port, targetProjectConfig }).catch(error => throw error)

      // const underscore = require('underscore')
      // const underscoreTemplateInterpolationSetting = { evaluate: /\{\%(.+?)\%\}/g, interpolate: /\{\%=(.+?)\%\}/g, escape: /\{\%-(.+?)\%\}/g } // initial underscore template settings on first import gets applied on the rest.
      // underscore.templateSettings = underscoreTemplateInterpolationSetting

      {
        let responseStream = await new Promise((resolve, reject) => {
          let urlPath = `/`
          http.get(`${url}${urlPath}`, response => resolve(response))
        })

        assert(responseStream.statusCode == 200, `• Response return non successful statusCode.`)
        let content = await streamToString(responseStream)
        // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'graphDocumentRendering'), content)
        assert(content === filesystem.readFileSync(path.join(__dirname, 'fixture', 'graphDocumentRendering'), { encoding: 'utf-8' }), `• Correct content must be served.`)
      }
    })
  })
})

// https://medium.com/@rishikesh.dhokare/performance-testing-for-your-nodejs-api-20471cd045e0
suite('Performance measure:', () => {
  const port = 9992
  const url = `http://localhost:${port}`

  const noRequestPerHour = 10000, // goal: 100,000
    avgRequestTime = 4000 // goal: 1000

  suite('service root delivery:', () => {
    suiteSetup(async () => {
      await clearGraphData()
      await service.restApi.initializeRootContentRendering({ port, targetProjectConfig }).catch(error => throw error)
    })

    test('Performance measure:', function(done) {
      let gLatency
      this.timeout(1000 * 60)

      let operation = loadtest.loadTest(
        {
          url,
          maxRequests: 20, // 100
          maxSeconds: 30,
          concurrency: 25,
          statusCallback: function(error, result, latency) {
            gLatency = latency
            // console.log('Current latency %j, result %j, error %j', latency, result, error)
            console.log(`#${result.requestIndex} - Request elapsed milliseconds: `, result.requestElapsed)
            // console.log('Request loadtest() instance index: ', result.instanceIndex)
          },
        },
        error => {
          // timeout to finish any request and console.log after active requests
          setTimeout(() => {
            if (error) console.error('Got an error: %s', error)
            else if (operation.running == false) {
              console.info('\n==============================\n')
              console.info('Target measures to achieve:')
              console.info('Requests per hour: ' + noRequestPerHour)
              console.info('Avg request time(Millis): ' + avgRequestTime)
              console.info('\n==============================\n')
              console.info('Total Requests :', gLatency.totalRequests)
              console.info('Total Failures :', gLatency.totalErrors)
              console.info('Requests/Second :', gLatency.rps)
              console.info('Requests/Hour :', gLatency.rps * 3600)
              console.info('Avg Request Time:', gLatency.meanLatencyMs)
              console.info('Min Request Time:', gLatency.minLatencyMs)
              console.info('Max Request Time:', gLatency.maxLatencyMs)
              console.info('Percentiles :', gLatency.percentiles)
              console.info('\n===============================\n')
              assert(gLatency.totalErrors == 0, `• No errors should be thrown.`)
              assert(gLatency.rps * 3600 > noRequestPerHour, `• Calculated request per hour (${gLatency.rps * 3600}) must be greater than ${noRequestPerHour}`)
              assert(gLatency.meanLatencyMs < avgRequestTime, `• Calculated average request time (${gLatency.meanLatencyMs}) must be under ${avgRequestTime}`)
              console.log('✔ Tests run successfully')

              done()
            }
          }, 300)
        },
      )
    })
  })
})
