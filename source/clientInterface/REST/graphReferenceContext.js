import assert from 'assert'
import path from 'path'
import { curryNamed } from '@dependency/namedCurry'
import { curry } from 'ramda'
import * as symbol from './symbol.reference.js'

import { getRequestMethod, getUrlPathLevel, isExistUrlPathLevel, getUrlPathAsArray, ifLevel1IncludesAt, ifLastUrlPathtIncludesFunction } from './graphEvaluationFunction.js'
import { transformJavascriptMiddleware } from './middleware/babelTranspiler.js'
import { serveStaticFile, serveServerSideRenderedFile } from './middleware/serveFile.js'
import { pickClientSideProjectConfig } from './middleware/useragentDetection.js'
import { commonFunctionality } from './middleware/commonFunctionality.js'
import { notFound } from './middleware/notFound.js'
import { expandAtSignPath, parseAtSignPath } from './middleware/atSign.js'
import { parseDollarSignPath, removeDollarSignPath } from './middleware/dollarSign.js'
import { bodyParserMiddleware } from './middleware/bodyParser.js'
import { debugMiddlewareProxy } from '../../utility/debugMiddlewareProxy.js'
import { setResponseHeaders, cacheControl, handleOptionsRequest } from './middleware/contextManipulation.js'
import { setFrontendSetting } from './middleware/languageContent.js'
import { templateRenderingMiddleware } from './middleware/templateRendering.js'
import { graphDocumentRenderingMiddlewareAdapter } from './middleware/traverseTemplateGraph.js'
import { wrapWithJsTag } from './pipeFunction/wrapString.js'

// Note: function are curried to allow initialization in stages.
/** 
    context that will be used by the graph traversal during execution.
    functions registered in this object must comply (use adapter - wrapper function) with the graph middleware implementation - i.e. a function wrapped middleware.
    add parameters to graph shared context.
  */

// list of function used in the context of graph traversal.
let middlewareFunctionReferenceList = ({ targetProjectConfig, configuredGraph, middlewareContext }) =>
  /**  middlewares
   * @return {Function (context, next)=>{} } functions that return a middleware.
   */
  ({
    nodeDebug: ({ node, traverser }) => (async next => console.log(`• executed middleware in node: ${JSON.stringify(node.properties)}`)) |> debugMiddlewareProxy, // debug
    bodyParser: ({ node, traverser }) => (bodyParserMiddleware |> curry)(middlewareContext),
    serveStaticFile: ({ node, traverser }) => curry(serveStaticFile({ targetProjectConfig, filePath: node.properties.filePath, basePath: node.properties.basePath }))(middlewareContext),
    serveServerSideRenderedFile: ({ node, traverser }) =>
      (
        serveServerSideRenderedFile({
          filePath: node.properties.filePath,
          basePath: node.properties.basePath,
          renderType: node.properties.renderType,
          mimeType: node.properties.mimeType,
        }) |> curry
      )(middlewareContext),
    setResponseHeaders: ({ node, traverser }) => (setResponseHeaders() |> curry)(middlewareContext),
    setFrontendSetting: ({ node, traverser }) => (setFrontendSetting() |> curry)(middlewareContext),
    pickClientSideProjectConfig: ({ node, traverser }) => (pickClientSideProjectConfig({ targetProjectConfig }) |> curry)(middlewareContext),
    commonFunctionality: ({ node, traverser }) => (commonFunctionality({ middlewareContext }) |> curry)(middlewareContext),
    notFound: ({ node, traverser }) => (notFound() |> curry)(middlewareContext),
    cacheControl: ({ node, traverser }) => (cacheControl() |> curry)(middlewareContext),
    transformJavascriptMiddleware: ({ node, traverser }) => (transformJavascriptMiddleware() |> curry)(middlewareContext),
    parseAtSignPath: ({ node, traverser }) => (parseAtSignPath() |> curry)(middlewareContext),
    expandAtSignPath: ({ node, traverser }) => (expandAtSignPath() |> curry)(middlewareContext),
    parseDollarSignPath: ({ node, traverser }) => (parseDollarSignPath() |> curry)(middlewareContext),
    removeDollarSignPath: ({ node, traverser }) => (removeDollarSignPath() |> curry)(middlewareContext),
    templateRenderingMiddleware: ({ node, traverser }) => (templateRenderingMiddleware() |> curry)(middlewareContext),
    graphRenderedTemplateDocument: async function({ node, traverser }) {
      let curriedFileReferenceList = fileReferenceList({ targetProjectConfig, configuredGraph }),
        curriedPipeFunctionReferenceList = pipeFunctionReferenceList({ targetProjectConfig, configuredGraph })

      return (
        (await graphDocumentRenderingMiddlewareAdapter({
          middlewareNode: node,
          graphInstance: traverser.graph,
          configuredGraph /*Graph Class*/,
          referenceList: middlewareContext => ({
            functionReferenceContext: curriedPipeFunctionReferenceList({ middlewareContext }),
            fileContext: curriedFileReferenceList({ middlewareContext }),
          }),
        })) |> curry
      )(middlewareContext)
    },
  })

let conditionFunctionReferenceList = ({ targetProjectConfig, configuredGraph, middlewareContext }) =>
  /**  conditions
   * @return {any} value for condition comparison. Could return boolean, string, array.
   */
  ({
    getUrlPathLevel: ({ node, traverser }) => getUrlPathLevel({ middlewareContext, level: node.properties.level }),
    isExistUrlPathLevel: ({ node, traverser }) => isExistUrlPathLevel({ middlewareContext, level: node.properties.level }),
    ifLevel1IncludesAt: async ({ node, traverser }) => await ifLevel1IncludesAt(middlewareContext),
    ifLastUrlPathtIncludesFunction: ({ node, traverser }) => ifLastUrlPathtIncludesFunction(middlewareContext),
    getRequestMethod: ({ node, traverser }) => getRequestMethod(middlewareContext),
    getUrlPathAsArray: ({ node, traverser }) => getUrlPathAsArray(middlewareContext),
  })

let pipeFunctionReferenceList = ({ targetProjectConfig, configuredGraph, middlewareContext }) =>
  /** Pipes - for further processing results of template renderning
   * @return {Function (input)=>output } functions that return a pipe function - receiving an input and returning a processed output.
   */
  ({
    wrapWithJsTag: ({ node, traverser }) => wrapWithJsTag(),
  })

// list of files used in the context of graph traversal.
let fileReferenceList = ({ targetProjectConfig, configuredGraph, middlewareContext }) =>
  /** Template files */
  ({
    entrypointHTML: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./template/entrypoint.html`)
    },
    systemjsSetting: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./javascript/jspm.initialization.js`)
    },
    webcomponentPolyfill: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./javascript/polymerPolyfill.js`)
    },
    entrypointScript: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./template/entrypointScript.html`)
    },
    babelTranspiler: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./javascript/babelTranspiler.js`)
    },
    metadata: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./metadata/metadata.html`)
    },
    webScoket: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./javascript/websocket.js`)
    },
    googleAnalytics: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./javascript/googleAnalytics.js`)
    },
    serviceWorker: ({ node, traverser }) => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./javascript/serviceWorker/serviceWorker.js`)
    },
  })

// currify the functions
middlewareFunctionReferenceList = middlewareFunctionReferenceList |> (func => curryNamed(['targetProjectConfig', 'configuredGraph', 'middlewareContext'], func))
conditionFunctionReferenceList = conditionFunctionReferenceList |> (func => curryNamed(['targetProjectConfig', 'configuredGraph', 'middlewareContext'], func))
fileReferenceList = fileReferenceList |> (func => curryNamed(['targetProjectConfig', 'configuredGraph', 'middlewareContext'], func))
pipeFunctionReferenceList = pipeFunctionReferenceList |> (func => curryNamed(['targetProjectConfig', 'configuredGraph', 'middlewareContext'], func))

export { middlewareFunctionReferenceList, conditionFunctionReferenceList, fileReferenceList }
