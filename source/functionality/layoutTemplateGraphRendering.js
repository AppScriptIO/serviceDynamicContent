/**
 * Render document using template graph traversal.
 - in case underscore is used: Using 'context.render' using koa-views that uses consolidate.js as an underlying module.

 */
export async function renderLayoutTemplate({ documentKey }) {
  let renderedContent = await TemplateController.traverse({ nestedUnitKey: documentKey })
  this.context.body = renderedContent
  return renderedLayout
}
