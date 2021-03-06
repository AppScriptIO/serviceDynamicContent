import * as symbol from '../symbol.reference.js'

/** extract function name from keyword following $ signature.
 * Usage: `import html from './.html$convertTextToJSModule'`
 */
function extractDollarSignKeyword(string) {
  if (string.lastIndexOf('$') == -1) return false
  let keyword = string.substr(string.lastIndexOf('$') + 1, string.length) // $function extracted from url after '$' signature
  string = string.substr(0, string.lastIndexOf('$')) // remove function name
  return { signKeyword: keyword, stringWithRemovedSign: string }
}

// Parses the path without changing it.
export const parseDollarSignPath = () =>
  async function parseDollarSignPath(context, next) {
    let signString = extractDollarSignKeyword(context[symbol.context.parsed.path]).signKeyword
    let keywordArray =  signString.split('.')
    if(keywordArray.length == 2) context[symbol.context.parsed.dollarSign] =  { referenceContextName: keywordArray[0], functionName: keywordArray[1] } 
    else context[symbol.context.parsed.dollarSign] = signString
    await next()
  }

export const removeDollarSignPath = () =>
  async function removeDollarSignPath(context, next) {
    // manipulate path
    context[symbol.context.parsed.path] = extractDollarSignKeyword(context[symbol.context.parsed.path]).stringWithRemovedSign // if sign exist the actual file path woule be what comes before `./.html$convertTextToJSModule`
    await next()
  }
