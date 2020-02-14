import stream from 'stream'
import filesystem from 'fs'
import { wrapStringStream } from '@dependency/handleJSNativeDataStructure'

/** Functions involving changing the content type (MIME type) of the file */

/** Wrap css style in a tag (created using javascript) - to support shared styles in Polymer 3 javascript imports
 * Polyfill from https://github.com/Polymer/polymer-modulizer/blob/f1ef5dea3978a9601248d73f4d23dc033382286c/fixtures/packages/polymer/expected/test/unit/styling-import-shared-styles.js
 */
export async function convertSharedStylesToJS({ content, filePath}) {
  if(!content){ 
    if(!filePath) throw new Error('• One of either parameters must be passed: stream or filePath params')
    
    content = filesystem.createReadStream(filePath)
  } else if(!(content instanceof stream.Readable)) content = stream.Readable.from([content]) // yield one event for the entire string, rather than without the array emitting event for each character.

  
  return await wrapStringStream({
    stream: content,
    beforeString: "const $_documentContainer = document.createElement('div'); $_documentContainer.setAttribute('style', 'display: none;'); $_documentContainer.innerHTML = `",
    afterString: '`;document.head.appendChild($_documentContainer);',
  })
}

/** Wrap text file with export default - converting it to js module */
export async function covertTextFileToJSModule({ content, filePath}) {
  if(!content){ 
    if(!filePath) throw new Error('• One of either parameters must be passed: stream or filePath params')
    
    content = filesystem.createReadStream(filePath)
  } else if(!(content instanceof stream.Readable)) content = stream.Readable.from([content]) // yield one event for the entire string, rather than without the array emitting event for each character.

  return await wrapStringStream({ stream: content, beforeString: 'export default `', afterString: '`' })
}

export const wrapWithJsTag = () => string => `<script>${string}</script>`
