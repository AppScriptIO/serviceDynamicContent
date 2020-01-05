import { curryNamed } from '@dependency/namedCurry'
import { curry } from 'ramda'
import * as symbol from './symbol.reference.js'

import { getRequestMethod, getUrlPathLevel, isExistUrlPathLevel, getUrlPathAsArray, ifLevel1IncludesAt, ifLastUrlPathtIncludesFunction } from './graphEvaluationFunction.js'
import { transformJavascriptMiddleware } from './middleware/babelTranspiler.js'
import { serveStaticFile, serveServerSideRenderedFile } from './middleware/serveFile.js'
import { pickClientSideProjectConfig } from './middleware/useragentDetection.js'
import { commonFunctionality } from './middleware/commonFunctionality.js'
import { notFound } from './middleware/notFound.js'
import { expandAtSignPath } from './middleware/map@PathToAbsolutePath.js'
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
    nodeDebug: traverserState => (async next => console.log(`• executed middleware in node: ${JSON.stringify(traverserState.node.properties)}`)) |> debugMiddlewareProxy, // debug
    bodyParser: traverserState => (bodyParserMiddleware() |> curry)(middlewareContext),
    serveStaticFile: traverserState =>
      curry(serveStaticFile({ targetProjectConfig, filePath: traverserState.node.properties.filePath, basePath: traverserState.node.properties.basePath }))(middlewareContext),
    serveServerSideRenderedFile: traverserState =>
      (
        serveServerSideRenderedFile({
          filePath: traverserState.node.properties.filePath,
          basePath: traverserState.node.properties.basePath,
          renderType: traverserState.node.properties.renderType,
          mimeType: traverserState.node.properties.mimeType,
        }) |> curry
      )(middlewareContext),
    setResponseHeaders: traverserState => (setResponseHeaders() |> curry)(middlewareContext),
    setFrontendSetting: traverserState => (setFrontendSetting() |> curry)(middlewareContext),
    pickClientSideProjectConfig: traverserState => (pickClientSideProjectConfig({ targetProjectConfig }) |> curry)(middlewareContext),
    commonFunctionality: traverserState => (commonFunctionality({ middlewareContext }) |> curry)(middlewareContext),
    notFound: traverserState => (notFound() |> curry)(middlewareContext),
    cacheControl: traverserState => (cacheControl() |> curry)(middlewareContext),
    transformJavascriptMiddleware: traverserState => (transformJavascriptMiddleware() |> curry)(middlewareContext),
    expandAtSignPath: traverserState => (expandAtSignPath() |> curry)(middlewareContext),
    templateRenderingMiddleware: () => (templateRenderingMiddleware() |> curry)(middlewareContext),
    graphDocumentRenderingMiddlewareAdapter: traverserState => {
      let curriedFileReferenceList = fileReferenceList({ targetProjectConfig, configuredGraph }),
        curriedPipeFunctionReferenceList = pipeFunctionReferenceList({ targetProjectConfig, configuredGraph })
      return (
        graphDocumentRenderingMiddlewareAdapter({
          middlewareNode: traverserState.node,
          graphInstance: traverserState.graph,
          configuredGraph /*Graph Class*/,
          referenceList: middlewareContext => ({
            functionReferenceContext: curriedPipeFunctionReferenceList({ middlewareContext }),
            fileContext: curriedFileReferenceList({ middlewareContext }),
          }),
        }) |> curry
      )(middlewareContext)
    },
  })

let conditionFunctionReferenceList = ({ targetProjectConfig, configuredGraph, middlewareContext }) =>
  /**  conditions
   * @return {any} value for condition comparison. Could return boolean, string, array.
   */
  ({
    getUrlPathLevel: traverserState => getUrlPathLevel({ middlewareContext, level: traverserState.node.properties.level }),
    isExistUrlPathLevel: traverserState => isExistUrlPathLevel({ middlewareContext, level: traverserState.node.properties.level }),
    ifLevel1IncludesAt: async traverserState => await ifLevel1IncludesAt(middlewareContext),
    ifLastUrlPathtIncludesFunction: traverserState => ifLastUrlPathtIncludesFunction(middlewareContext),
    getRequestMethod: traverserState => getRequestMethod(middlewareContext),
    getUrlPathAsArray: traverserState => getUrlPathAsArray(middlewareContext),
  })

let pipeFunctionReferenceList = ({ targetProjectConfig, configuredGraph, middlewareContext }) =>
  /** Pipes - for further processing results of template renderning
   * @return {Function (input)=>output } functions that return a pipe function - receiving an input and returning a processed output.
   */
  ({
    wrapWithJsTag: traverserState => wrapWithJsTag(),
  })

// list of files used in the context of graph traversal.
let fileReferenceList = ({ targetProjectConfig, configuredGraph, middlewareContext }) =>
  /** Template files */
  ({
    entrypointHTML: traverserState => {
      assert(middlewareContext[symbol.context.clientSideProjectConfig], `• clientSideProjectConfig must be set by a previous middleware.`)
      let clientSidePath = middlewareContext[symbol.context.clientSideProjectConfig].path
      return path.join(clientSidePath, `./template/entrypoint.html`)
    },
  })

// currify the functions
middlewareFunctionReferenceList = middlewareFunctionReferenceList |> (func => curryNamed(['targetProjectConfig', 'configuredGraph', 'middlewareContext'], func))
conditionFunctionReferenceList = conditionFunctionReferenceList |> (func => curryNamed(['targetProjectConfig', 'configuredGraph', 'middlewareContext'], func))
fileReferenceList = fileReferenceList |> (func => curryNamed(['targetProjectConfig', 'configuredGraph', 'middlewareContext'], func))
pipeFunctionReferenceList = pipeFunctionReferenceList |> (func => curryNamed(['targetProjectConfig', 'configuredGraph', 'middlewareContext'], func))

export { middlewareFunctionReferenceList, conditionFunctionReferenceList, fileReferenceList }
