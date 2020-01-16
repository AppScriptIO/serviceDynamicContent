"use strict";var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.renderTemplateUsingKoaViews = exports.renderJsTemplateUsingUnderscore = exports.renderJSImportWebcomponent = exports.renderHTMLImportWebcomponent = exports.renderFileAsJSModule = exports.renderSharedStyle = exports.serveStaticFile = exports.serveServerSideRenderedFile = void 0;var _path = _interopRequireDefault(require("path"));
var _assert = _interopRequireDefault(require("assert"));
var _fs = _interopRequireDefault(require("fs"));



var _koaSendfile = _interopRequireDefault(require("koa-sendfile"));

var symbol = _interopRequireWildcard(require("../symbol.reference.js"));
var renderFile = _interopRequireWildcard(require("../../../functionality/renderFile.js"));













function extractDollarSignKeyword(string) {
  if (string.lastIndexOf('$') == -1) return false;
  let keyword = string.substr(string.lastIndexOf('$') + 1, string.length);
  string = string.substr(0, string.lastIndexOf('$'));
  return { signKeyword: keyword, stringWithRemovedSign: string };
}

const serveServerSideRenderedFile = ({ basePath, filePath, renderType, mimeType = 'application/javascript' } = {}) => async (context, next) => {
  (0, _assert.default)(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`);

  filePath || (filePath = context.path);
  basePath || (basePath = '');

  if (!renderType) {
    let { signKeyword, stringWithRemovedSign } = extractDollarSignKeyword(filePath);
    filePath = stringWithRemovedSign;
    renderType || (renderType = signKeyword);
  }

  let absoluteFilePath = _path.default.join(context[symbol.context.clientSideProjectConfig].path, basePath, filePath);

  let functionReference = renderFile[renderType];
  (0, _assert.default)(functionReference, `• function keyword in the url must have an equivalent in the function reference.`);
  context.body = await functionReference({ filePath: absoluteFilePath });
  context.response.type = mimeType;
  await next();
};exports.serveServerSideRenderedFile = serveServerSideRenderedFile;
















const serveStaticFile = ({ filePath, basePath } = {}) =>
async function serveStaticFile(context, next) {
  (0, _assert.default)(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`);
  let absoluteFilePath = _path.default.join(
  context[symbol.context.clientSideProjectConfig].path,
  basePath || '',
  filePath || context.path);

  let fileStats = await (0, _koaSendfile.default)(context, absoluteFilePath);

  if (!fileStats || !fileStats.isFile()) await next();
};exports.serveStaticFile = serveStaticFile;









const renderSharedStyle = ({ filePath, basePath, mimeType = 'application/javascript' }) =>
async function renderSharedStyle(context, next) {
  (0, _assert.default)(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`);
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path;
  let filePath_ = filePath || context.path;
  let absoluteFilePath = _path.default.join(
  clientSidePath,
  basePath || '',
  filePath_);

  context.body = await (0, renderFile.convertSharedStylesToJS)({ filePath: absoluteFilePath });
  context.response.type = mimeType;
  await next();
};exports.renderSharedStyle = renderSharedStyle;

const renderFileAsJSModule = ({ filePath, basePath, mimeType = 'application/javascript' }) =>
async function renderFileAsJSModule(context, next) {
  (0, _assert.default)(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`);
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path;
  let filePath_ = filePath || context.path;
  let absoluteFilePath = _path.default.join(
  clientSidePath,
  basePath || '',
  filePath_);

  context.body = await (0, renderFile.covertTextFileToJSModule)({ filePath: absoluteFilePath });
  context.response.type = mimeType;
  await next();
};exports.renderFileAsJSModule = renderFileAsJSModule;

const renderHTMLImportWebcomponent = ({ filePath, basePath }) =>
async function renderHTMLImportWebcomponent(context, next) {
  (0, _assert.default)(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`);
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path;
  let filePath_ = filePath || context.path;
  let absoluteFilePath = _path.default.join(
  clientSidePath,
  basePath || '',
  filePath_);

  context.body = await (0, renderFile.combineHTMLImportWebcomponent)({ filePath: absoluteFilePath });
  await next();
};exports.renderHTMLImportWebcomponent = renderHTMLImportWebcomponent;

const renderJSImportWebcomponent = ({ filePath, basePath }) =>
async function renderJSImportWebcomponent(context, next) {
  (0, _assert.default)(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`);
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path;
  let filePath_ = filePath || context.path;
  let absoluteFilePath = _path.default.join(
  clientSidePath,
  basePath || '',
  filePath_);

  context.body = await (0, renderFile.combineJSImportWebcomponent)({ filePath: absoluteFilePath });
  await next();
};exports.renderJSImportWebcomponent = renderJSImportWebcomponent;


const renderJsTemplateUsingUnderscore = ({ filePath, basePath }) =>
async function renderJsTemplateUsingUnderscore(context, next) {
  (0, _assert.default)(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`);
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path;
  let filePath_ = filePath || context.path;
  let absoluteFilePath = _path.default.join(
  clientSidePath,
  basePath || '',
  filePath_);

  try {
    context.body = (0, renderFile.renderTemplateEvaluatingJs)({ filePath: absoluteFilePath, argument: { context } });
    context.response.type = mimeType;
  } catch (error) {
    console.log(error);
    await next();
  }
};exports.renderJsTemplateUsingUnderscore = renderJsTemplateUsingUnderscore;



const renderTemplateUsingKoaViews = ({ filePath, basePath }) =>
async function renderTemplateUsingKoaViews(context, next) {
  (0, _assert.default)(context[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`);
  let clientSidePath = context[symbol.context.clientSideProjectConfig].path;
  let filePath_ = filePath || context.path;
  let absoluteFilePath = _path.default.join(
  clientSidePath,
  basePath || '',
  filePath_);


  if (_fs.default.existsSync(absoluteFilePath) && _fs.default.statSync(absoluteFilePath).isFile()) {
    await context.render(absoluteFilePath, { argument: { context } });
    context.response.type = _path.default.extname(absoluteFilePath);
    await next();
  } else await next();
};exports.renderTemplateUsingKoaViews = renderTemplateUsingKoaViews;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9jbGllbnRJbnRlcmZhY2UvUkVTVC9taWRkbGV3YXJlL3NlcnZlRmlsZS5qcyJdLCJuYW1lcyI6WyJleHRyYWN0RG9sbGFyU2lnbktleXdvcmQiLCJzdHJpbmciLCJsYXN0SW5kZXhPZiIsImtleXdvcmQiLCJzdWJzdHIiLCJsZW5ndGgiLCJzaWduS2V5d29yZCIsInN0cmluZ1dpdGhSZW1vdmVkU2lnbiIsInNlcnZlU2VydmVyU2lkZVJlbmRlcmVkRmlsZSIsImJhc2VQYXRoIiwiZmlsZVBhdGgiLCJyZW5kZXJUeXBlIiwibWltZVR5cGUiLCJjb250ZXh0IiwibmV4dCIsInN5bWJvbCIsImNsaWVudFNpZGVQcm9qZWN0Q29uZmlnIiwicGF0aCIsImFic29sdXRlRmlsZVBhdGgiLCJqb2luIiwiZnVuY3Rpb25SZWZlcmVuY2UiLCJyZW5kZXJGaWxlIiwiYm9keSIsInJlc3BvbnNlIiwidHlwZSIsInNlcnZlU3RhdGljRmlsZSIsImZpbGVTdGF0cyIsImlzRmlsZSIsInJlbmRlclNoYXJlZFN0eWxlIiwiY2xpZW50U2lkZVBhdGgiLCJmaWxlUGF0aF8iLCJyZW5kZXJGaWxlQXNKU01vZHVsZSIsInJlbmRlckhUTUxJbXBvcnRXZWJjb21wb25lbnQiLCJyZW5kZXJKU0ltcG9ydFdlYmNvbXBvbmVudCIsInJlbmRlckpzVGVtcGxhdGVVc2luZ1VuZGVyc2NvcmUiLCJhcmd1bWVudCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInJlbmRlclRlbXBsYXRlVXNpbmdLb2FWaWV3cyIsImZpbGVzeXN0ZW0iLCJleGlzdHNTeW5jIiwic3RhdFN5bmMiLCJyZW5kZXIiLCJleHRuYW1lIl0sIm1hcHBpbmdzIjoicWhCQUFBO0FBQ0E7QUFDQTs7OztBQUlBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBY0EsU0FBU0Esd0JBQVQsQ0FBa0NDLE1BQWxDLEVBQTBDO0FBQ3hDLE1BQUlBLE1BQU0sQ0FBQ0MsV0FBUCxDQUFtQixHQUFu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Z0JBQWIsQ0FBeEI7QUFDQSxVQUFNSixJQUFJLEVBQVY7QUFDRCxHQUpELE1BSU8sTUFBTUEsSUFBSSxFQUFWO0FBQ1IsQ0FoQkksQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcbmltcG9ydCBmaWxlc3lzdGVtIGZyb20gJ2ZzJ1xuaW1wb3J0IFN0cmVhbSBmcm9tICdzdHJlYW0nXG5pbXBvcnQgbXVsdGlzdHJlYW0gZnJvbSAnbXVsdGlzdHJlYW0nXG5pbXBvcnQgdW5kZXJzY29yZSBmcm9tICd1bmRlcnNjb3JlJ1xuaW1wb3J0IHNlbmQgZnJvbSAna29hLXNlbmRmaWxlJyAvLyBTdGF0aWMgZmlsZXMuXG5pbXBvcnQgeyB3cmFwU3RyaW5nU3RyZWFtIH0gZnJvbSAnQGRlcGVuZGVuY3kvd3JhcFN0cmluZ1N0cmVhbSdcbmltcG9ydCAqIGFzIHN5bWJvbCBmcm9tICcuLi9zeW1ib2wucmVmZXJlbmNlLmpzJ1xuaW1wb3J0IHtcbiAgY29udmVydFNoYXJlZFN0eWxlc1RvSlMsXG4gIGNvdmVydFRleHRGaWxlVG9KU01vZHVsZSxcbiAgcmVuZGVyVGVtcGxhdGVFdmFsdWF0aW5nSnMsXG4gIHJlbmRlclRlbXBsYXRlSW5zZXJ0aW9uUG9zaXRpb24sXG4gIGNvbWJpbmVKU0ltcG9ydFdlYmNvbXBvbmVudCxcbiAgY29tYmluZUhUTUxJbXBvcnRXZWJjb21wb25lbnQsXG4gIHJlbmRlckdyYXBoVGVtcGxhdGUsXG59IGZyb20gJy4uLy4uLy4uL2Z1bmN0aW9uYWxpdHkvcmVuZGVyRmlsZS5qcydcbmltcG9ydCAqIGFzIHJlbmRlckZpbGUgZnJvbSAnLi4vLi4vLi4vZnVuY3Rpb25hbGl0eS9yZW5kZXJGaWxlLmpzJ1xuXG4vKiogZXh0cmFjdCBmdW5jdGlvbiBuYW1lIGZyb20ga2V5d29yZCBmb2xsb3dpbmcgJCBzaWduYXR1cmUuXG4gKiBVc2FnZTogYGltcG9ydCBodG1sIGZyb20gJy4vLmh0bWwkY29udmVydFRleHRUb0pTTW9kdWxlJ2BcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdERvbGxhclNpZ25LZXl3b3JkKHN0cmluZykge1xuICBpZiAoc3RyaW5nLmxhc3RJbmRleE9mKCckJykgPT0gLTEpIHJldHVybiBmYWxzZVxuICBsZXQga2V5d29yZCA9IHN0cmluZy5zdWJzdHIoc3RyaW5nLmxhc3RJbmRleE9mKCckJykgKyAxLCBzdHJpbmcubGVuZ3RoKSAvLyAkZnVuY3Rpb24gZXh0cmFjdGVkIGZyb20gdXJsIGFmdGVyICckJyBzaWduYXR1cmVcbiAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcubGFzdEluZGV4T2YoJyQnKSkgLy8gcmVtb3ZlIGZ1bmN0aW9uIG5hbWVcbiAgcmV0dXJuIHsgc2lnbktleXdvcmQ6IGtleXdvcmQsIHN0cmluZ1dpdGhSZW1vdmVkU2lnbjogc3RyaW5nIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNlcnZlU2VydmVyU2lkZVJlbmRlcmVkRmlsZSA9ICh7IGJhc2VQYXRoLCBmaWxlUGF0aCwgcmVuZGVyVHlwZSwgbWltZVR5cGUgPSAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSA9IHt9KSA9PiBhc3luYyAoY29udGV4dCwgbmV4dCkgPT4ge1xuICBhc3NlcnQoY29udGV4dFtzeW1ib2wuY29udGV4dC5jbGllbnRTaWRlUHJvamVjdENvbmZpZ10sIGDigKIgY2xpZW50U2lkZVByb2plY3RDb25maWcgbXVzdCBiZSBzZXQgYnkgYSBwcmV2aW91cyBtaWRkbGV3YXJlLmApXG5cbiAgZmlsZVBhdGggfHw9IGNvbnRleHQucGF0aCAvLyBhIHByZWRlZmluZWQgcGF0aCBvciBhbiBleHRyYWN0ZWQgdXJsIHBhdGhcbiAgYmFzZVBhdGggfHw9ICcnIC8vIGFkZGl0aW9uYWwgZm9sZGVyIHBhdGguXG5cbiAgaWYgKCFyZW5kZXJUeXBlKSB7XG4gICAgbGV0IHsgc2lnbktleXdvcmQsIHN0cmluZ1dpdGhSZW1vdmVkU2lnbiB9ID0gZXh0cmFjdERvbGxhclNpZ25LZXl3b3JkKGZpbGVQYXRoKVxuICAgIGZpbGVQYXRoID0gc3RyaW5nV2l0aFJlbW92ZWRTaWduIC8vIGlmIHNpZ24gZXhpc3QgdGhlIGFjdHVhbCBmaWxlIHBhdGggd291bGUgYmUgd2hhdCBjb21lcyBiZWZvcmUgYC4vLmh0bWwkY29udmVydFRleHRUb0pTTW9kdWxlYFxuICAgIHJlbmRlclR5cGUgfHw9IHNpZ25LZXl3b3JkXG4gIH1cblxuICBsZXQgYWJzb2x1dGVGaWxlUGF0aCA9IHBhdGguam9pbihjb250ZXh0W3N5bWJvbC5jb250ZXh0LmNsaWVudFNpZGVQcm9qZWN0Q29uZmlnXS5wYXRoLCBiYXNlUGF0aCwgZmlsZVBhdGgpXG4gIC8vVE9ETzogLSByZWNvbnNpZGVyIHRoZSBmdW5jdGlvbiBjb250ZXh0IHVzZWQgZm9yIHJlZmVyZW5jaW5nIHRoZSBkb2xsYXIgZXh0cmFjdGVkIGZ1bmN0aW9uIGtleXdvcmQuXG4gIGxldCBmdW5jdGlvblJlZmVyZW5jZSA9IHJlbmRlckZpbGVbcmVuZGVyVHlwZV0gLy8gdGhlIHJlZmVyZW5jZSBjb250ZXh0IGlzIGFjdHVhbGx5IHRoZSBtb2R1bGUgXCJyZW5kZXJGaWxlLmpzXCJcbiAgYXNzZXJ0KGZ1bmN0aW9uUmVmZXJlbmNlLCBg4oCiIGZ1bmN0aW9uIGtleXdvcmQgaW4gdGhlIHVybCBtdXN0IGhhdmUgYW4gZXF1aXZhbGVudCBpbiB0aGUgZnVuY3Rpb24gcmVmZXJlbmNlLmApXG4gIGNvbnRleHQuYm9keSA9IGF3YWl0IGZ1bmN0aW9uUmVmZXJlbmNlKHsgZmlsZVBhdGg6IGFic29sdXRlRmlsZVBhdGggfSlcbiAgY29udGV4dC5yZXNwb25zZS50eXBlID0gbWltZVR5cGVcbiAgYXdhaXQgbmV4dCgpXG59XG5cbi8vIGltcG9ydCBzZXJ2ZXJTdGF0aWMgZnJvbSAna29hLXN0YXRpYycgLy8gU3RhdGljIGZpbGVzLlxuLy8gaW1wb3J0IG1vdW50IGZyb20gJ2tvYS1tb3VudCdcbi8vIGV4cG9ydCBsZXQgc2VydmVyRGlyZWN0b3J5KCkge1xuLy8gUHJldmlvdXNseSB1c2VkIC0gc2VydmluZyBkaXJlY3RvcnlQYXRoOlxuLy8gbGV0IGRpcmVjdG9yeVBhdGggPSBhd2FpdCBwYXRoLnJlc29sdmUocGF0aC5ub3JtYWxpemUoYCR7Y29udGV4dC5pbnN0YW5jZS5jb25maWcuY2xpZW50QmFzZVBhdGh9JHtzZXR0aW5nLmRpcmVjdG9yeVBhdGh9YCkpXG4vLyBsZXQgbW91bnRNaWRkbGV3YXJlID0gbW91bnQoc2V0dGluZy51cmxQYXRoLCBzZXJ2ZXJTdGF0aWMoYCR7ZGlyZWN0b3J5UGF0aH1gLCBzZXR0aW5nLm9wdGlvbnMpKVxuLy8gfVxuXG4vKipcbiAqIHNlcnZlIHN0YXRpYyBmaWxlLlxuICogQGRlcGVuZGVuY3kgdXNlcmFnZW50RGV0ZWN0aW9uIG1pZGRsZXdhcmUsIHVzZXJBZ2VudCBtb2R1bGVzXG4gKiBAcGFyYW0gZmlsZXBhdGggbWF5YmUgYSBwYXJ0aWFsIHBhdGggd2hpY2ggdXNlcyBiYXNlUGF0aCB0byBjcmVhdGUgYW4gYWJzb2x1dGUgcGF0aCwgb3IgaXQgbWF5IHByb3ZpZGUgYSBmdWxsIHBhdGggd2l0aG91dCBiYXNlUGF0aFxuICogQHBhcmFtIGJhc2VQYXRoIHJlbGF0aXZlIHRvIHRoZSBjbGllbnRzaWRlIHNvdXJjZS9kaXN0cmlidXRpb24gcGF0aC5cbiAqIEBwYXJhbSBjb250ZXh0W3N5bWJvbC5jb250ZXh0LmNsaWVudFNpZGVQcm9qZWN0Q29uZmlnXSBpcyBhIHByb3BlcnR5IGNyZWF0ZWQgYnkgYSBwcmV2aW91cyB1c2VyYWdlbnREZXRlY3Rpb24gbWlkZGxld2FyZVxuICovXG5leHBvcnQgY29uc3Qgc2VydmVTdGF0aWNGaWxlID0gKHsgZmlsZVBhdGgsIGJhc2VQYXRoIH0gPSB7fSkgPT5cbiAgYXN5bmMgZnVuY3Rpb24gc2VydmVTdGF0aWNGaWxlKGNvbnRleHQsIG5leHQpIHtcbiAgICBhc3NlcnQoY29udGV4dFtzeW1ib2wuY29udGV4dC5jbGllbnRTaWRlUHJvamVjdENvbmZpZ10sIGDigKIgY2xpZW50U2lkZVByb2plY3RDb25maWcgbXVzdCBiZSBzZXQgYnkgYSBwcmV2aW91cyBtaWRkbGV3YXJlLmApXG4gICAgbGV0IGFic29sdXRlRmlsZVBhdGggPSBwYXRoLmpvaW4oXG4gICAgICBjb250ZXh0W3N5bWJvbC5jb250ZXh0LmNsaWVudFNpZGVQcm9qZWN0Q29uZmlnXS5wYXRoLFxuICAgICAgYmFzZVBhdGggfHwgJycsIC8vIGFkZGl0aW9uYWwgZm9sZGVyIHBhdGguXG4gICAgICBmaWxlUGF0aCB8fCBjb250ZXh0LnBhdGgsIC8vIGEgcHJlZGVmaW5lZCBwYXRoIG9yIGFuIGV4dHJhY3RlZCB1cmwgcGF0aFxuICAgIClcbiAgICBsZXQgZmlsZVN0YXRzID0gYXdhaXQgc2VuZChjb250ZXh0LCBhYnNvbHV0ZUZpbGVQYXRoKVxuICAgIC8vIGlmIGZpbGUgZG9lc24ndCBleGlzdCB0aGVuIHBhc3MgdG8gdGhlIG5leHQgbWlkZGxld2FyZS5cbiAgICBpZiAoIWZpbGVTdGF0cyB8fCAhZmlsZVN0YXRzLmlzRmlsZSgpKSBhd2FpdCBuZXh0KClcbiAgfVxuXG4vKipcbiAqIHNlcnZlcnMgc2VydmVyc2lkZSByZW5kZXJlZCBqYXZhc2NyaXB0IGJsb2NrcyBvciBvdGhlciByZW5kZXJpbmcuXG4gKiBAZGVwZW5kZW5jeSB1c2VyYWdlbnREZXRlY3Rpb24gbWlkZGxld2FyZSwgdXNlckFnZW50IG1vZHVsZXNcbiAqIEBkZXBlbmRlbmN5IHRlbXBsYXRlUmVuZGVyaW5nTWlkZGxld2FyZSBtaWRkbGV3YXJlLCBrb2Etdmlld3MgJiB1bmRlcnNjb3JlIG1vZHVsZXNcbiAqIEBwYXJhbSBjb250ZXh0W3N5bWJvbC5jb250ZXh0LmNsaWVudFNpZGVQcm9qZWN0Q29uZmlnXSBpcyBhIHByb3BlcnR5IGNyZWF0ZWQgYnkgYSBwcmV2aW91cyB1c2VyYWdlbnREZXRlY3Rpb24gbWlkZGxld2FyZVxuICogUmVzb3VyY2VzOlxuICogLSByZWFkIHN0cmVhbXMgYW5kIHNlbmQgdGhlbSB1c2luZyBrb2EgLSBodHRwczovL2dpdGh1Yi5jb20va29hanMva29hL2lzc3Vlcy85NDQgaHR0cDovL2Jvb2subWl4dS5uZXQvbm9kZS9jaDkuaHRtbFxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyU2hhcmVkU3R5bGUgPSAoeyBmaWxlUGF0aCwgYmFzZVBhdGgsIG1pbWVUeXBlID0gJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pID0+XG4gIGFzeW5jIGZ1bmN0aW9uIHJlbmRlclNoYXJlZFN0eWxlKGNvbnRleHQsIG5leHQpIHtcbiAgICBhc3NlcnQoY29udGV4dFtzeW1ib2wuY29udGV4dC5jbGllbnRTaWRlUHJvamVjdENvbmZpZ10sIGDigKIgY2xpZW50U2lkZVByb2plY3RDb25maWcgbXVzdCBiZSBzZXQgYnkgYSBwcmV2aW91cyBtaWRkbGV3YXJlLmApXG4gICAgbGV0IGNsaWVudFNpZGVQYXRoID0gY29udGV4dFtzeW1ib2wuY29udGV4dC5jbGllbnRTaWRlUHJvamVjdENvbmZpZ10ucGF0aFxuICAgIGxldCBmaWxlUGF0aF8gPSBmaWxlUGF0aCB8fCBjb250ZXh0LnBhdGggLy8gYSBwcmVkZWZpbmVkIHBhdGggb3IgYW4gZXh0cmFjdGVkIHVybCBwYXRoXG4gICAgbGV0IGFic29sdXRlRmlsZVBhdGggPSBwYXRoLmpvaW4oXG4gICAgICBjbGllbnRTaWRlUGF0aCxcbiAgICAgIGJhc2VQYXRoIHx8ICcnLCAvLyBhZGRpdGlvbmFsIGZvbGRlciBwYXRoLlxuICAgICAgZmlsZVBhdGhfLFxuICAgIClcbiAgICBjb250ZXh0LmJvZHkgPSBhd2FpdCBjb252ZXJ0U2hhcmVkU3R5bGVzVG9KUyh7IGZpbGVQYXRoOiBhYnNvbHV0ZUZpbGVQYXRoIH0pXG4gICAgY29udGV4dC5yZXNwb25zZS50eXBlID0gbWltZVR5cGVcbiAgICBhd2FpdCBuZXh0KClcbiAgfVxuXG5leHBvcnQgY29uc3QgcmVuZGVyRmlsZUFzSlNNb2R1bGUgPSAoeyBmaWxlUGF0aCwgYmFzZVBhdGgsIG1pbWVUeXBlID0gJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pID0+XG4gIGFzeW5jIGZ1bmN0aW9uIHJlbmRlckZpbGVBc0pTTW9kdWxlKGNvbnRleHQsIG5leHQpIHtcbiAgICBhc3NlcnQoY29udGV4dFtzeW1ib2wuY29udGV4dC5jbGllbnRTaWRlUHJvamVjdENvbmZpZ10sIGDigKIgY2xpZW50U2lkZVByb2plY3RDb25maWcgbXVzdCBiZSBzZXQgYnkgYSBwcmV2aW91cyBtaWRkbGV3YXJlLmApXG4gICAgbGV0IGNsaWVudFNpZGVQYXRoID0gY29udGV4dFtzeW1ib2wuY29udGV4dC5jbGllbnRTaWRlUHJvamVjdENvbmZpZ10ucGF0aFxuICAgIGxldCBmaWxlUGF0aF8gPSBmaWxlUGF0aCB8fCBjb250ZXh0LnBhdGggLy8gYSBwcmVkZWZpbmVkIHBhdGggb3IgYW4gZXh0cmFjdGVkIHVybCBwYXRoXG4gICAgbGV0IGFic29sdXRlRmlsZVBhdGggPSBwYXRoLmpvaW4oXG4gICAgICBjbGllbnRTaWRlUGF0aCxcbiAgICAgIGJhc2VQYXRoIHx8ICcnLCAvLyBhZGRpdGlvbmFsIGZvbGRlciBwYXRoLlxuICAgICAgZmlsZVBhdGhfLFxuICAgIClcbiAgICBjb250ZXh0LmJvZHkgPSBhd2FpdCBjb3ZlcnRUZXh0RmlsZVRvSlNNb2R1bGUoeyBmaWxlUGF0aDogYWJzb2x1dGVGaWxlUGF0aCB9KVxuICAgIGNvbnRleHQucmVzcG9uc2UudHlwZSA9IG1pbWVUeXBlXG4gICAgYXdhaXQgbmV4dCgpXG4gIH1cblxuZXhwb3J0IGNvbnN0IHJlbmRlckhUTUxJbXBvcnRXZWJjb21wb25lbnQgPSAoeyBmaWxlUGF0aCwgYmFzZVBhdGggfSkgPT5cbiAgYXN5bmMgZnVuY3Rpb24gcmVuZGVySFRNTEltcG9ydFdlYmNvbXBvbmVudChjb250ZXh0LCBuZXh0KSB7XG4gICAgYXNzZXJ0KGNvbnRleHRbc3ltYm9sLmNvbnRleHQuY2xpZW50U2lkZVByb2plY3RDb25maWddLCBg4oCiIGNsaWVudFNpZGVQcm9qZWN0Q29uZmlnIG11c3QgYmUgc2V0IGJ5IGEgcHJldmlvdXMgbWlkZGxld2FyZS5gKVxuICAgIGxldCBjbGllbnRTaWRlUGF0aCA9IGNvbnRleHRbc3ltYm9sLmNvbnRleHQuY2xpZW50U2lkZVByb2plY3RDb25maWddLnBhdGhcbiAgICBsZXQgZmlsZVBhdGhfID0gZmlsZVBhdGggfHwgY29udGV4dC5wYXRoIC8vIGEgcHJlZGVmaW5lZCBwYXRoIG9yIGFuIGV4dHJhY3RlZCB1cmwgcGF0aFxuICAgIGxldCBhYnNvbHV0ZUZpbGVQYXRoID0gcGF0aC5qb2luKFxuICAgICAgY2xpZW50U2lkZVBhdGgsXG4gICAgICBiYXNlUGF0aCB8fCAnJywgLy8gYWRkaXRpb25hbCBmb2xkZXIgcGF0aC5cbiAgICAgIGZpbGVQYXRoXyxcbiAgICApXG4gICAgY29udGV4dC5ib2R5ID0gYXdhaXQgY29tYmluZUhUTUxJbXBvcnRXZWJjb21wb25lbnQoeyBmaWxlUGF0aDogYWJzb2x1dGVGaWxlUGF0aCB9KVxuICAgIGF3YWl0IG5leHQoKVxuICB9XG5cbmV4cG9ydCBjb25zdCByZW5kZXJKU0ltcG9ydFdlYmNvbXBvbmVudCA9ICh7IGZpbGVQYXRoLCBiYXNlUGF0aCB9KSA9PlxuICBhc3luYyBmdW5jdGlvbiByZW5kZXJKU0ltcG9ydFdlYmNvbXBvbmVudChjb250ZXh0LCBuZXh0KSB7XG4gICAgYXNzZXJ0KGNvbnRleHRbc3ltYm9sLmNvbnRleHQuY2xpZW50U2lkZVByb2plY3RDb25maWddLCBg4oCiIGNsaWVudFNpZGVQcm9qZWN0Q29uZmlnIG11c3QgYmUgc2V0IGJ5IGEgcHJldmlvdXMgbWlkZGxld2FyZS5gKVxuICAgIGxldCBjbGllbnRTaWRlUGF0aCA9IGNvbnRleHRbc3ltYm9sLmNvbnRleHQuY2xpZW50U2lkZVByb2plY3RDb25maWddLnBhdGhcbiAgICBsZXQgZmlsZVBhdGhfID0gZmlsZVBhdGggfHwgY29udGV4dC5wYXRoIC8vIGEgcHJlZGVmaW5lZCBwYXRoIG9yIGFuIGV4dHJhY3RlZCB1cmwgcGF0aFxuICAgIGxldCBhYnNvbHV0ZUZpbGVQYXRoID0gcGF0aC5qb2luKFxuICAgICAgY2xpZW50U2lkZVBhdGgsXG4gICAgICBiYXNlUGF0aCB8fCAnJywgLy8gYWRkaXRpb25hbCBmb2xkZXIgcGF0aC5cbiAgICAgIGZpbGVQYXRoXyxcbiAgICApXG4gICAgY29udGV4dC5ib2R5ID0gYXdhaXQgY29tYmluZUpTSW1wb3J0V2ViY29tcG9uZW50KHsgZmlsZVBhdGg6IGFic29sdXRlRmlsZVBhdGggfSlcbiAgICBhd2FpdCBuZXh0KClcbiAgfVxuXG4vLyBJbXBsZW1lbnRhdGlvbiB1c2luZyBmaWxlc3lzdGVtIHJlYWQgYW5kIHVuZGVyc2NvcmUgdGVtcGxhdGUsIHdpdGggYSBtaW1lIHR5cGUgZS5nLiBgYXBwbGljYXRpb24vamF2YXNjcmlwdGBcbmV4cG9ydCBjb25zdCByZW5kZXJKc1RlbXBsYXRlVXNpbmdVbmRlcnNjb3JlID0gKHsgZmlsZVBhdGgsIGJhc2VQYXRoIH0pID0+XG4gIGFzeW5jIGZ1bmN0aW9uIHJlbmRlckpzVGVtcGxhdGVVc2luZ1VuZGVyc2NvcmUoY29udGV4dCwgbmV4dCkge1xuICAgIGFzc2VydChjb250ZXh0W3N5bWJvbC5jb250ZXh0LmNsaWVudFNpZGVQcm9qZWN0Q29uZmlnXSwgYOKAoiBjbGllbnRTaWRlUHJvamVjdENvbmZpZyBtdXN0IGJlIHNldCBieSBhIHByZXZpb3VzIG1pZGRsZXdhcmUuYClcbiAgICBsZXQgY2xpZW50U2lkZVBhdGggPSBjb250ZXh0W3N5bWJvbC5jb250ZXh0LmNsaWVudFNpZGVQcm9qZWN0Q29uZmlnXS5wYXRoXG4gICAgbGV0IGZpbGVQYXRoXyA9IGZpbGVQYXRoIHx8IGNvbnRleHQucGF0aCAvLyBhIHByZWRlZmluZWQgcGF0aCBvciBhbiBleHRyYWN0ZWQgdXJsIHBhdGhcbiAgICBsZXQgYWJzb2x1dGVGaWxlUGF0aCA9IHBhdGguam9pbihcbiAgICAgIGNsaWVudFNpZGVQYXRoLFxuICAgICAgYmFzZVBhdGggfHwgJycsIC8vIGFkZGl0aW9uYWwgZm9sZGVyIHBhdGguXG4gICAgICBmaWxlUGF0aF8sXG4gICAgKVxuICAgIHRyeSB7XG4gICAgICBjb250ZXh0LmJvZHkgPSByZW5kZXJUZW1wbGF0ZUV2YWx1YXRpbmdKcyh7IGZpbGVQYXRoOiBhYnNvbHV0ZUZpbGVQYXRoLCBhcmd1bWVudDogeyBjb250ZXh0IH0gfSlcbiAgICAgIGNvbnRleHQucmVzcG9uc2UudHlwZSA9IG1pbWVUeXBlIC8vIFRPRE86IGRldGVjdCBNSU1FIHR5cGUgYXV0b21hdGljYWxseSBhbmQgc3VwcG9ydCBvdGhlciBtaW1lcy5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9XG4gIH1cblxuLy8gc2VydmUgZXZhbHVhdGVkIGZpbGUuIEltcGxlbWVudGF0aW9uIHVzaW5nIHJlbmRlciB1c2luZyB1bmRlcmx5aW5nIGB1bmRlcnNjb3JlYCB0aHJvdWdoIGBjb25zb2xpZGF0ZWAgbW9kdWxlKGZyYW1ld29yayBsaWtlKS5cbi8vIFRha2VzIGludG8gYWNjb3VudFxuZXhwb3J0IGNvbnN0IHJlbmRlclRlbXBsYXRlVXNpbmdLb2FWaWV3cyA9ICh7IGZpbGVQYXRoLCBiYXNlUGF0aCB9KSA9PlxuICBhc3luYyBmdW5jdGlvbiByZW5kZXJUZW1wbGF0ZVVzaW5nS29hVmlld3MoY29udGV4dCwgbmV4dCkge1xuICAgIGFzc2VydChjb250ZXh0W3N5bWJvbC5jb250ZXh0LmNsaWVudFNpZGVQcm9qZWN0Q29uZmlnXSwgYOKAoiBjbGllbnRTaWRlUHJvamVjdENvbmZpZyBtdXN0IGJlIHNldCBieSBhIHByZXZpb3VzIG1pZGRsZXdhcmUuYClcbiAgICBsZXQgY2xpZW50U2lkZVBhdGggPSBjb250ZXh0W3N5bWJvbC5jb250ZXh0LmNsaWVudFNpZGVQcm9qZWN0Q29uZmlnXS5wYXRoXG4gICAgbGV0IGZpbGVQYXRoXyA9IGZpbGVQYXRoIHx8IGNvbnRleHQucGF0aCAvLyBhIHByZWRlZmluZWQgcGF0aCBvciBhbiBleHRyYWN0ZWQgdXJsIHBhdGhcbiAgICBsZXQgYWJzb2x1dGVGaWxlUGF0aCA9IHBhdGguam9pbihcbiAgICAgIGNsaWVudFNpZGVQYXRoLFxuICAgICAgYmFzZVBhdGggfHwgJycsIC8vIGFkZGl0aW9uYWwgZm9sZGVyIHBhdGguXG4gICAgICBmaWxlUGF0aF8sXG4gICAgKVxuXG4gICAgaWYgKGZpbGVzeXN0ZW0uZXhpc3RzU3luYyhhYnNvbHV0ZUZpbGVQYXRoKSAmJiBmaWxlc3lzdGVtLnN0YXRTeW5jKGFic29sdXRlRmlsZVBhdGgpLmlzRmlsZSgpKSB7XG4gICAgICBhd2FpdCBjb250ZXh0LnJlbmRlcihhYnNvbHV0ZUZpbGVQYXRoLCB7IGFyZ3VtZW50OiB7IGNvbnRleHQgfSB9KVxuICAgICAgY29udGV4dC5yZXNwb25zZS50eXBlID0gcGF0aC5leHRuYW1lKGFic29sdXRlRmlsZVBhdGgpXG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9IGVsc2UgYXdhaXQgbmV4dCgpXG4gIH1cbiJdfQ==