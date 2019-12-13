import assert from 'assert'
import http from 'http'
import { assert as chaiAssertion } from 'chai'
import utility from 'util'
import path from 'path'
import filesystem from 'fs'
import ownProjectConfig from '../configuration'
import { setUnderscoreTemplateSetting, convertSharedStylesToJS } from '../'
import { streamToString } from '@dependency/streamToStringConvertion'

suite('Functionality - service components:', () => {
  // TODO: create unit tests for server functions.
  suite('Test template rendering ', () => {
    test('Should render template correctly', async () => {
      setUnderscoreTemplateSetting()
      let renderedContent = await convertSharedStylesToJS({ filePath: path.normalize(path.join(__dirname, './asset/file.txt')) })
      await streamToString(renderedContent)
      // chaiAssertion.deepEqual(true, true)
    })
  })
})
