import assert from 'assert'
import http from 'http'
import { assert as chaiAssertion } from 'chai'
import utility from 'util'
import path from 'path'
import filesystem from 'fs'
import ownProjectConfig from '../configuration'
import { streamToString } from '@dependency/handleJSNativeDataStructure'
import mockUserAgent from 'user-agents'
const useragentParser = require('useragent')
import { setUnderscoreTemplateSetting } from '../source/functionality/underscoreTemplateInterpolation.js'
import {
  convertSharedStylesToJS,
  covertTextFileToJSModule,
  renderTemplateEvaluatingJs,
  renderTemplateInsertionPosition,
  combineJSImportWebcomponent,
  combineHTMLImportWebcomponent,
  renderGraphTemplate,
} from '../source/functionality/renderFile.js'
import { transformJavascript } from '../source/functionality/babelTransformJsStream.js'
import { pickClientSideConfiguration } from '../source/functionality/pickClientSideConfiguration.js'

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

    test('renderTemplateEvaluatingJs', async () => {
      let rendered = await renderTemplateEvaluatingJs({ filePath: path.join(__dirname, './asset/file.js'), argument: { someConfig1: 'someConfig1', someConfig2: 'someConfig2' } })
      // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'renderTemplateEvaluatingJs'), rendered)
      assert(rendered === fixture.renderTemplateEvaluatingJs, `• Content must be rendered correctly.`)
    })

    suite('renderTemplateInsertionPosition', () => {
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
    })

    suite('templateGraphRendering', () => {
      const underscore = require('underscore') // should be already loaded and initialized in the suite setup ('setUnderscoreTemplateSetting')

      suite('Render template using underscore algorithm or other engine, without graph traversal.', () => {
        test('Should render template correctly', async () => {
          // template resource
          let resource = [
            await filesystem.readFileSync(`${__dirname}/asset/template.html`, 'utf-8'),
            `<h1>{%= insert[1] && insert[1]('@') %}</h1>`,
            await filesystem.readFileSync(`${__dirname}/asset/file.html`, 'utf-8'),
          ]

          const concatinateWithPrefix = (character = '•', content) => character + content

          // expose the insert function to the template insertion positions to use.
          const insertionAlgorithm = content => character => concatinateWithPrefix(character, content)

          let parsedTemplate2 = underscore.template(resource[1])
          let renderedDocument2 = parsedTemplate2({
            insert: {
              1: underscore.template(resource[2])() |> insertionAlgorithm,
            },
            argument: {},
          })

          let parsedTemplate1 = underscore.template(resource[0])
          let renderedDocument1 = parsedTemplate1({
            insert: {
              1: underscore.template(resource[2])() |> insertionAlgorithm,
              2: undefined, // ignore key
              3: renderedDocument2 |> insertionAlgorithm,
            },
            argument: {},
          })

          // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'renderedDocument'), renderedDocument1)
          assert(renderedDocument1 === fixture.renderedDocument, `• Document must be rendered correctly.`)
        })
      })
    })
  })

  suite('Transform javascript file using Babel', () => {
    test('transformJavascript', async () => {
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
