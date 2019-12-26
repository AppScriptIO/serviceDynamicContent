import filesystem from 'fs'
import { wrapStringStream } from '@dependency/wrapStringStream'
// Note: Every function dependent on underscore will be affected by the configuration of the template string of the underscore imported instance.
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

// render template using underscore - evaluating js code.
export function renderTemplateEvaluatingJs({ filePath, argument = {} }) {
  return underscore.template(filesystem.readFileSync(filePath, 'utf8'))({ argument }) // Koa handles the stream and send it to the client.
}

// render template using underscore with insertion positions concept
export function renderTemplateInsertionPosition({ filePath, insert = {}, argument = {} }) {
  return underscore.template(filesystem.readFileSync(filePath, 'utf8'))({ insert, argument }) // Koa handles the stream and send it to the client.
}

/**
 * Webcomponent using JS imports - Combine webcomponent files according to predefined component parts locations relative to the file path received.
 */
export function combineJSImportWebcomponent({ filePath, argument = {} }) {
  let fileDirectoryPath = filePath.substr(0, filePath.lastIndexOf('/')) // directory base path of file
  return renderTemplateInsertionPosition({
    filePath,
    insert: {
      css: () => underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.css`, 'utf8'))({ argument }),
      html: () => underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.html`, 'utf8'))({ argument }),
    },
    argument,
  })
}

/**
 * Webcomponent using HTML Imports - Combine webcomponent files according to predefined component parts locations relative to the file path received.
 */
export function combineHTMLImportWebcomponent({ filePath, argument = {} }) {
  let fileDirectoryPath = filePath.substr(0, filePath.lastIndexOf('/'))
  return renderTemplateInsertionPosition({
    filePath,
    insert: {
      css: () => underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.css`, 'utf8'))({ argument }),
      js: () => underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.js`, 'utf8'))({ argument }),
      html: () => underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.html`, 'utf8'))({ argument }),
    },
    argument,
  })
}
