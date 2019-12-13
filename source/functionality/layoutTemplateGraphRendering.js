/**
 * Render document using template nested unit tree.

 let getTableDocument = {
  generate: getTableDocumentDefault,
  instance: [],
}
getTableDocument.instance['template_documentBackend'] = getTableDocument.generate('webappSetting', 'template_documentBackend')

 */
export async function renderLayoutTemplate({ documentKey }) {
  // document could have different rules for users etc.. access previlages
  let templateController = await TemplateController.createContext({})
  let renderedLayout = await templateController.initializeNestedUnit({ nestedUnitKey: get['template_documentBackend'](documentKey).templateNestedUnit })
  return renderedLayout
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
    } || (await getTableDocument.instance['template_documentBackend'](connection, documentKey))

  let renderedContent = await TemplateController.traverse(documentObject.templateNestedUnit)
  this.context.body = renderedContent

  let argument = { layoutElement: 'webapp-layout-list' }
  let mainDocumentElement = await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/document-element/document-element.html`, 'utf-8')
  let mainDocumentElementImport = await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/document-element/document-element.import.html`, 'utf-8')

  // Shared arguments between all templates being rendered
  const templateArgument = {
    templateController,
    context: this.context,
    argument: {},
  }

  const view = {
    metadata: underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/asset/metadata/metadata.html`, 'utf-8')),
    header: underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.js.html`, 'utf-8')),
    body: underscore.template(mainDocumentElement, { argument }),
  }
  let template = underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`, 'utf-8'))
  this.context.body = template(Object.assign({}, templateArgument, { view, templateArgument }))

  // Using 'context.render' using koa-views that uses consolidate.js as an underlying module.
  await this.context.render(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`, Object.assign({}, templateArgument, { view, templateArgument }))
}
