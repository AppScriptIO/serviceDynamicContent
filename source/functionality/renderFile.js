import filesystem from 'fs'
// Note: Every function dependent on underscore will be affected by the configuration of the template string of the underscore imported instance.
import underscore from 'underscore'

/** Template rendering related functionality, which doesn't change the type of content (MIME type) */

// render template using underscore - evaluating js code. Implementation using filesystem read and underscore template, with a mime type e.g. `application/javascript`
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
