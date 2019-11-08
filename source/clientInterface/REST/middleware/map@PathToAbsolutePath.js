// map for resolving/expanding @ paths.
const namedImportMap = [
  {
    key: 'webcomponent', // @webcomponent
    path: 'asset/webcomponent',
  },
  {
    key: 'javascript', // @javascript
    path: 'asset/javascript',
  },
]

/** Middleware that overrides the path, resolving `@<keyword>` section in the begging of the url path.
 * NOTE: @ = At sign.
Example: `/@javascript/x/y/z` --> `/asset/javascript/x/y/z`
*/
export const mapAtSignPathToAbsolutePathMiddleware = () => async (context, next) => {
  let pathArray = context.path.split('/').filter(item => item) // split path and remove empty values
  // check if @ sign exists in beggining of url path.
  if (pathArray[0].indexOf('@') >= 0) {
    // Get the keyword after @ sign i.e. `/@<key name>/x/y/z`
    let keywordAfterAtSign = pathArray[0].substring(pathArray[0].indexOf('@') + 1, pathArray[0].length)
    let resolvedAtSignSection = namedImportMap.find(item => item.key == keywordAfterAtSign)?.path
    // change path if @ path was found and mapped
    if (resolvedAtSignSection) {
      pathArray[0] = resolvedAtSignSection
      context.path = `/${pathArray.join('/')}`
    }
  }
  await next()
}
