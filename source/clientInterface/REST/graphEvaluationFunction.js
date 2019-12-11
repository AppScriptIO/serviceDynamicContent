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

export const getUrlPathLevel1 = async middlewareContext => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  return pathArray[0]
}

export const getUrlPathLevel2 = async middlewareContext => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  if (pathArray[1] == null) {
    return false
  } else {
    return pathArray[1]
  }
}

export const getUrlPathLevel3 = async middlewareContext => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  return pathArray[3]
}

export const ifLastUrlPathtIncludesFunction = async middlewareContext => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  let lastPath = pathArray.pop() // get url path

  // remove parameters
  if (lastPath.includes('?')) lastPath = lastPath.substr(0, lastPath.lastIndexOf('?'))

  // check if function sign exists
  return lastPath.includes('$') ? true : false
}

export const ifLevel1IncludesAt = async middlewareContext => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  let firstPath = pathArray.shift() // get url path

  // check if function sign exists
  return firstPath.includes('@') ? true : false
}

export const isExistUrlPathLevel1 = async middlewareContext => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  return pathArray[0] == null ? false : true
}

export const isExistUrlPathLevel2 = async middlewareContext => {
  let pathArray = await getUrlPathAsArray(middlewareContext)
  return pathArray[1] == null ? false : true
}
