import * as symbol from '../symbol.reference.js'
const pathPosition = 0 // path position in interes
// map for resolving/expanding @ paths.
const namedImportMap = [
  {
    key: 'webcomponent', // @webcomponent
    path: 'webcomponent', // folder inside clientSide module
  },
  {
    key: 'javascript', // @javascript
    path: 'javascript', // folder inside clientSide module
  },
]

/** extract shorten path keyword following @ signature.
 * Usage: `@webcomponent/webcomponentsjs/webcomponents-lite.js`
 */
export function extractAtSignKeyword(string) {
  if (string.lastIndexOf('@') == -1) return false
  // Get the keyword after @ sign i.e. `/@<key name>/x/y/z`
  let signKeyword = string.substring(string.indexOf('@') + 1, string.length) // keyword after at sign
  return signKeyword
}

// Parses the path without changing it.
export const parseAtSignPath = () =>
  async function parseAtSignPath(context, next) {
    let pathArray = context[symbol.context.parsed.path].split('/').filter(item => item) // split path and remove empty values
    context[symbol.context.parsed.atSign] = extractAtSignKeyword(pathArray[pathPosition])
    await next()
  }

/** Changes the path according to the previously parsed value. map @ Path To Absolute Path
Middleware that overrides the path, resolving `@<keyword>` section in the begging of the url path.
 * NOTE: @ = At sign.
Example: `/@javascript/x/y/z` --> `/asset/javascript/x/y/z`
*/
export const expandAtSignPath = () =>
  async function expandAtSignPath(context, next) {
    if (context[symbol.context.parsed.atSign]) {
      // check if @ sign exists in beggining of url path.
      let resolvedAtSignSection = namedImportMap.find(item => item.key == context[symbol.context.parsed.atSign])?.path
      // change path if @ path was found and mapped
      if (resolvedAtSignSection) {
        let pathArray = context[symbol.context.parsed.path].split('/').filter(item => item) // split path and remove empty values
        pathArray[pathPosition] = resolvedAtSignSection // change path related to @ sign
        context[symbol.context.parsed.path] = `/${pathArray.join('/')}`
      }
    }
    await next()
  }
