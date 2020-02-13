import path from 'path'
import * as symbol from './symbol.reference.js'

/**
 * @param {Koa Context {request, response}} middlewareContext
 */
export function getRequestMethod(middlewareContext) {
  return middlewareContext.request.method
}

export const getUrlPathAsArray = async middlewareContext => {
  let path = middlewareContext.request.url // get path

  // Remove parameters starting with "?" after last slash
  let lastSlash = path.lastIndexOf('/')
  let lastQuestionMark = path.lastIndexOf('?')
  if (lastQuestionMark > lastSlash) path = path.substring(0, lastQuestionMark)

  let pathArray = path
    .split('/') // split path sections to an array.
    .filter(String) // remove empty string.
    .filter(string => !string.startsWith('?')) // remove parameters from individual path in the array. i.e. don't count params as path.

  return pathArray
}

export const isExistUrlPathLevel = async ({ middlewareContext, level = 0 }) => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  return pathArray[level] == null ? false : true
}

export const getUrlPathLevel = async ({ middlewareContext, level = 0 }) => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  return pathArray[level]
}

export const ifDollarFunction = async ({ middlewareContext, shouldParsePath = true }) => {
  if (shouldParsePath) {
    let pathArray = await getUrlPathAsArray(middlewareContext)
    let lastPath = pathArray.pop() // get url path
    if (!lastPath) return
    if (lastPath.includes('?')) lastPath = lastPath.substr(0, lastPath.lastIndexOf('?')) // remove parameters
    return lastPath.includes('$') ? true : false // check if function sign exists
  } else {
    return Boolean(middlewareContext[symbol.context.parsed.dollarSign])
  }
}

export const ifLevel1IncludesAt = async middlewareContext => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  let firstPath = pathArray.shift() // get url path
  return firstPath && firstPath.includes('@') ? true : false // check if function sign exists
}

// check type of requested resource - javascript, stylesheet, html, other. or folder dirent
const ecmascriptType = ['.js', '.mjs']
export const getFileType = async middlewareContext => {
  let extension = path.extname(middlewareContext[symbol.context.parsed.path])
  return ecmascriptType.includes(extension) ? 'javascript' : extension
}
