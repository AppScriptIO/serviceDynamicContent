/** Wrap css style in a tag (created using javascript) - to support shared styles in Polymer 3 javascript imports
 * Polyfill from https://github.com/Polymer/polymer-modulizer/blob/f1ef5dea3978a9601248d73f4d23dc033382286c/fixtures/packages/polymer/expected/test/unit/styling-import-shared-styles.js
 */
export async function convertSharedStylesToJS({ filePath, context }) {
  return await wrapStringStream({
    stream: filesystem.createReadStream(filePath),
    beforeString: "const $_documentContainer = document.createElement('div'); $_documentContainer.setAttribute('style', 'display: none;'); $_documentContainer.innerHTML = `",
    afterString: '`;document.head.appendChild($_documentContainer);',
  })
}

/** Wrap text file with export default - converting it to js module */
export async function covertTextFileToJSModule({ filePath, context }) {
  let fileStream = filesystem.createReadStream(filePath)
  return await wrapStringStream({ stream: fileStream, beforeString: 'export default `', afterString: '`' })
}

/**
 * Webcomponent using JS imports - Combine webcomponent files according to predefined component parts locations.
 */
export function renderJSImportWebcomponent({ filePath, context }) {
  let fileDirectoryPath = filePath.substr(0, filePath.lastIndexOf('/'))
  let argument = { layoutElement: 'webapp-layout-list' }
  let view = {}

  let templatePart = {
    css: underscore.template(filesystem.readFileSync(`${fileDirectoryPath}/component.css`, 'utf8'))({ Application, argument }),
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

/**
 * Webcomponent using HTML Imports - Combine webcomponent files according to predefined component parts locations.
 */
export function renderHTMLImportWebcomponent({ filePath, context }) {
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

/**
 * Render document using template nested unit tree.
 */
// let getTableDocument = {
//   generate: getTableDocumentDefault,
//   instance: [],
// }
// getTableDocument.instance['template_documentBackend'] = getTableDocument.generate('webappSetting', 'template_documentBackend')
export function renderTemplateDocument({ documentKey }) {
  let TemplateController = createStaticInstanceClasses({
    Superclass: Application,
    implementationType: 'Template',
  })
  return async (context, next) => {
    let connection = Application.rethinkdbConnection
    let documentObject = await getTableDocument.instance['template_documentBackend'](connection, documentKey)
    // context.instance.config.clientBasePath should be defined using useragentDetection module.
    // NOTE:  documentKey should be received from database and nested unit key retreived from there too.
    // document could have different rules for users etc.. access previlages
    let templateController = await TemplateController.createContext({ portAppInstance: context.instance })

    let renderedContent = await templateController.initializeNestedUnit({ nestedUnitKey: documentObject.templateNestedUnit })
    context.body = renderedContent

    await next()
  }
}

// example of rendering template not using the graph traversal module:
async function handleTemplateDocument(documentKey) {
  // context.instance.config.clientBasePath should be defined using useragentDetection module.
  let clientBasePath = ''

  let documentObject =
    {
      key: '0d65c113-acce-4f01-8eea-ab6cb7152405',
      label: { name: 'entrypoint' },
      templateNestedUnit: '0d65c113-acce-4f01-8eea-ab6cb7152405',
    } || (await getTableDocument.instance['template_documentBackend'](serviceConfig.rethinkdb, documentKey))

  let renderedContent = await TemplateController.traverse(documentObject.templateNestedUnit)
  this.context.body = renderedContent

  let argument = { layoutElement: 'webapp-layout-list' }
  let mainDocumentElement = await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/document-element/document-element.html`, 'utf-8')
  let mainDocumentElementImport = await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/document-element/document-element.import.html`, 'utf-8')

  // Shared arguments between all templates being rendered
  const templateArgument = {
    templateController,
    context: this.context,
    Application,
    argument: {},
  }

  const view = {
    metadata: underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/asset/metadata/metadata.html`, 'utf-8')),
    header: underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.js.html`, 'utf-8')),
    body: underscore.template(mainDocumentElement, { Application, argument }),
  }
  let template = underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`, 'utf-8'))
  this.context.body = template(Object.assign({}, templateArgument, { view, templateArgument }))

  // Using 'context.render' using koa-views that uses consolidate.js as an underlying module.
  await this.context.render(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`, Object.assign({}, templateArgument, { view, templateArgument }))
}
