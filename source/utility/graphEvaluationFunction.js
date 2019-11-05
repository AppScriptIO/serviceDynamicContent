export function getMethod({ node, context }) {
  let requestContext = context.middlewareParameter.context
  return requestContext.request.method
}

export const getUrlPathAsArray = async ({ node, context }) => {
  let requestContext = context.middlewareParameter.context
  let path = requestContext.request.url // get path

  // Remove parameters starting with "?" after last slash
  let lastSlash = path.lastIndexOf('/')
  let lastQuestionMark = path.lastIndexOf('?')
  if (lastQuestionMark > lastSlash) path = path.substring(0, lastQuestionMark)

  let pathArray = await path.split('/') // split path sections to an array.
  pathArray = await pathArray.filter(String) // remove empty string.
  pathArray = pathArray.filter(string => !string.startsWith('?')) // remove parameters from individual path in the array. i.e. don't count params as path.
  return pathArray
}

export const getUrlPathLevel1 = async ({ node, context }) => {
  let pathArray = await getUrlPathAsArray(...arguments)
  return pathArray[0]
}

export const getUrlPathLevel2 = async ({ node, context }) => {
  let pathArray = await getUrlPathAsArray(...arguments)
  if (pathArray[1] == null) {
    return false
  } else {
    return pathArray[1]
  }
}
export const getUrlPathLevel3 = async ({ node, context }) => {
  let pathArray = await getUrlPathAsArray(...arguments)
  return pathArray[3]
}

export const ifLastUrlPathtIncludesFunction = async ({ node, context }) => {
  let requestContext = context.middlewareParameter.context
  let pathArray = await getUrlPathAsArray(...arguments)
  let lastPath = pathArray.pop() // get url path

  // remove parameters
  if (lastPath.includes('?')) lastPath = lastPath.substr(0, lastPath.lastIndexOf('?'))

  // check if function sign exists
  return lastPath.includes('$') ? true : false
}

// previous name: `ifLevel1Includes@.js`
export const ifLevel1IncludesAt = async ({ node, context }) => {
  let requestContext = context.middlewareParameter.context
  let pathArray = await getUrlPathAsArray(...arguments)
  let firstPath = pathArray.shift() // get url path

  // check if function sign exists
  return firstPath.includes('@') ? true : false
}

export const isExistUrlPathLevel1 = async ({ node, context }) => {
  let requestContext = context.middlewareParameter.context
  let pathArray = await getUrlPathAsArray(...arguments)
  return pathArray[0] == null ? false : true
}

export const isExistUrlPathLevel2 = async ({ node, context }) => {
  let requestContext = context.middlewareParameter.context
  let pathArray = await getUrlPathAsArray(...arguments)
  return pathArray[1] == null ? false : true
}
