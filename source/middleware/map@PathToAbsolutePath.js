const namedImportMap = [
  {
    namedImport: 'webcomponent', // @webcomponent
    path: 'asset/webcomponent',
  },
  {
    namedImport: 'javascript', // @javascript
    path: 'asset/javascript',
  },
]

// NOTE: @ = At sign.
export const mapAtSignPathToAbsolutePathMiddleware = () => async (context, next) => {
  let path = context.path
  // path = path.replace(/^\/|\/$/g, '') // remove first and last slash
  let pathArray = path.split('/').filter(item => item) // split path and remove empty values
  let firstURLPart = pathArray[0]
  // let lastIndexPosition = (path.indexOf("/") == -1) ? path.length : path.indexOf("/");
  let relativeAtPathName = firstURLPart.substring(firstURLPart.indexOf('@') + 1, firstURLPart.length)

  let namedImportObject = namedImportMap.filter(item => item.namedImport == relativeAtPathName)[0] // example '/@webcomponent/package/x/x.js'
  let mappedPath = namedImportObject.path

  context.relativeAtPathName = relativeAtPathName
  // change path if @ path is mapped
  // if(mappedPath) context.path = context.path.replace(`@${relativeAtPathName}`, mappedPath)
  if (mappedPath) {
    // replace part to be mapped
    pathArray[0] = mappedPath
    context.path = pathArray.join('/')
  }
  await next()
}
