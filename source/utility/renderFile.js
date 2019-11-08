import filesystem from 'fs'
import { wrapStringStream } from '@dependency/wrapStringStream'
import underscore from 'underscore'

/** Wrap css style in a tag (created using javascript) - to support shared styles in Polymer 3 javascript imports
 * Polyfill from https://github.com/Polymer/polymer-modulizer/blob/f1ef5dea3978a9601248d73f4d23dc033382286c/fixtures/packages/polymer/expected/test/unit/styling-import-shared-styles.js
 */
export async function convertSharedStylesToJS({ filePath }) {
  return await wrapStringStream({
    stream: filesystem.createReadStream(filePath),
    beforeString: "const $_documentContainer = document.createElement('div'); $_documentContainer.setAttribute('style', 'display: none;'); $_documentContainer.innerHTML = `",
    afterString: '`;document.head.appendChild($_documentContainer);',
  })
}

/** Wrap text file with export default - converting it to js module */
export async function covertTextFileToJSModule({ filePath }) {
  let fileStream = filesystem.createReadStream(filePath)
  return await wrapStringStream({ stream: fileStream, beforeString: 'export default `', afterString: '`' })
}

/**
 * Webcomponent using JS imports - Combine webcomponent files according to predefined component parts locations.
 */
export function renderJSImportWebcomponent({ filePath }) {
  let fileDirectoryPath = filePath.substr(0, filePath.lastIndexOf('/'))
  let argument = { layoutElement: 'webapp-layout-list' }
  let view = {}

  let templatePart = {
    css: underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.css`, 'utf8'))({ argument }),
    html: underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.html`, 'utf8'))({ argument }),
  }
  try {
    let content = filesystem.readFileSync(filePath, 'utf8')
    let rendered = underscore.template(content)({ view, argument: Object.assign(argument, templatePart) })
    return rendered // Koa handles the stream and send it to the client.
  } catch (error) {
    console.log(error)
  }
}

/**
 * Webcomponent using HTML Imports - Combine webcomponent files according to predefined component parts locations.
 */
export function renderHTMLImportWebcomponent({ filePath }) {
  let fileDirectoryPath = filePath.substr(0, filePath.lastIndexOf('/'))
  let argument = { layoutElement: 'webapp-layout-list' }
  let view = {}

  let templatePart = {
    css: underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.css`, 'utf8'))({ Application, argument }),
    js: underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.js`, 'utf8'))({ Application, argument }),
    html: underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.html`, 'utf8'))({ Application, argument }),
  }
  try {
    let content = filesystem.readFileSync(filePath, 'utf8')
    let rendered = underscore.template(content)({ Application, view, argument: Object.assign(argument, templatePart) })
    return rendered // Koa handles the stream and send it to the client.
  } catch (error) {
    console.log(error)
  }
}

// render javascript template
export function evaluateJsTemplate({ filePath, setting }) {
  fileContent = filesystem.readFileSync(filePath, 'utf8')
  return underscore.template(fileContent)({
    setting,
    view: {},
    argument: {},
  }) // Koa handles the stream and send it to the client.
}
