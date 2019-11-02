import { initializeGraph } from '../../../utility/graphInitialization.js'

// TODO: use equivalent functionality
import { createTemplateRenderingMiddleware } from './middleware/templateRendering.js'
import implementConditionActionOnModuleUsingJson from '../../utility/middleware/implementConditionActionOnModuleUsingJson.js'

export async function graphMiddleware({ targetProjectConfig, entrypointKey }) {
  let { createGraphMiddleware } = await initializeGraph({ targetProjectConfig })
  return createGraphMiddleware({ entrypointKey })
}
