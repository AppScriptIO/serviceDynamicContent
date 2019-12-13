import assert from 'assert'
import http from 'http'
import { assert as chaiAssertion } from 'chai'
import utility from 'util'
import path from 'path'
import filesystem from 'fs'
import ownProjectConfig from '../configuration'
import { streamToString } from '@dependency/streamToStringConvertion'
import mockUserAgent from 'user-agents'
const useragentParser = require('useragent')
import { setUnderscoreTemplateSetting } from '../source/functionality/underscoreTemplateInterpolation.js'
import { convertSharedStylesToJS, covertTextFileToJSModule, combineJSImportWebcomponent, combineHTMLImportWebcomponent, evaluateJsTemplate } from '../source/functionality/renderFile.js'
import { transformJavascript } from '../source/functionality/babelTransformJsStream.js'
import { pickClientSideConfiguration } from '../source/functionality/pickClientSideConfiguration.js'

// TODO: create unit tests for server functions.
suite('Functionality used in the service:', () => {
  suiteSetup(() => {
    setUnderscoreTemplateSetting() // set underscore settings for template string characters used for rendering.
  })

  const fixture =
    {}
    |> (object => {
      filesystem.readdirSync(path.join(__dirname, 'fixture')).forEach(filename => {
        object[filename] = filesystem.readFileSync(path.join(__dirname, 'fixture', filename), { encoding: 'utf-8' })
      })
      return object
    })

  //* Write new fixtures `filesystem.writeFileSync(path.join(__dirname, 'fixture', 'filename'), content)`
  suite('Template rendering functions', () => {
    test('convertSharedStylesToJS', async () => {
      let rendered = await streamToString(await convertSharedStylesToJS({ filePath: path.join(__dirname, './asset/file.css') }))
      // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'convertSharedStylesToJS'), rendered)
      assert(rendered === fixture.convertSharedStylesToJS, `• Content must be rendered correctly.`)
    })

    test('covertTextFileToJSModule', async () => {
      let rendered = await streamToString(await covertTextFileToJSModule({ filePath: path.join(__dirname, './asset/file.txt') }))
      // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'covertTextFileToJSModule'), rendered)
      assert(rendered === fixture.covertTextFileToJSModule, `• Content must be rendered correctly.`)
    })

    test('combineJSImportWebcomponent', async () => {
      let rendered = await combineJSImportWebcomponent({ filePath: path.join(__dirname, './asset/webcomponent-element/element.html') })
      // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'combineJSImportWebcomponent'), rendered)
      assert(rendered === fixture.combineJSImportWebcomponent, `• Content must be rendered correctly.`)
    })

    test('combineHTMLImportWebcomponent', async () => {
      let rendered = await combineHTMLImportWebcomponent({ filePath: path.join(__dirname, './asset/webcomponent-element/element.html') })
      // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'combineHTMLImportWebcomponent'), rendered)
      assert(rendered === fixture.combineHTMLImportWebcomponent, `• Content must be rendered correctly.`)
    })

    test('evaluateJsTemplate', async () => {
      let rendered = await evaluateJsTemplate({ filePath: path.join(__dirname, './asset/file.js'), argument: { someConfig1: 'someConfig1', someConfig2: 'someConfig2' } })
      // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'evaluateJsTemplate'), rendered)
      assert(rendered === fixture.evaluateJsTemplate, `• Content must be rendered correctly.`)
    })
  })

  suite('Template rendering functions', () => {
    test('evaluateJsTemplate', async () => {
      let transpiled = await transformJavascript({ scriptCode: filesystem.readFileSync(path.join(__dirname, './asset/file.js'), { encoding: 'utf8' }) })
      // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'transformJavascript'), transpiled)
      assert(transpiled === fixture.transformJavascript, `• Content must be rendered correctly.`)
    })
  })

  suite('pickClientSideConfiguration', () => {
    const fixture = {
      clientSideConfig: {
        targetAgent({ agent }) {
          return agent.family == 'Chrome'
        },
      },
    }
    test('Choose client-side configuration', async () => {
      let userAgentHeader = new mockUserAgent(/Chrome/) // pass a regular expression to generate a user agent containing the text.
      let agentInstance = useragentParser.lookup(userAgentHeader)
      let clientSideConfig = pickClientSideConfiguration({
        clientSideProjectConfigList: [{ path: path.join(__dirname, 'asset') }, fixture.clientSideConfig],
        agentInstance,
      })

      assert(clientSideConfig === fixture.clientSideConfig, `• Content must be rendered correctly.`)
    })
  })
})
