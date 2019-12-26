/** extract shorten path keyword following @ signature.
 * Usage: `@webcomponent/webcomponentsjs/webcomponents-lite.js`
 */
export function extractAtSignKeyword(string) {
  if (string.lastIndexOf('@') == -1) return false
  // Get the keyword after @ sign i.e. `/@<key name>/x/y/z`
  let signKeyword = string.substring(string.indexOf('@') + 1, string.length) // keyword after at sign
  return signKeyword
}
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
export const expandAtSignPath = () =>
  async function expandAtSignPath(context, next) {
    let pathArray = context.path.split('/').filter(item => item) // split path and remove empty values
    let signKeyword = extractAtSignKeyword(pathArray[0])
    if (signKeyword) {
      // check if @ sign exists in beggining of url path.
      let resolvedAtSignSection = namedImportMap.find(item => item.key == signKeyword)?.path
      // change path if @ path was found and mapped
      if (resolvedAtSignSection) {
        pathArray[0] = resolvedAtSignSection
        context.path = `/${pathArray.join('/')}`
      }
    }
    await next()
  }
