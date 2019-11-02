import { initializeGraph } from '../utility/graphInitialization.js'
import * as graphData from '../../resource/graphData.json'
// TODO: use equivalent functionality
// import { createTemplateRenderingMiddleware } from './templateRendering.js'
// import implementConditionActionOnModuleUsingJson from '../../utility/middleware/implementConditionActionOnModuleUsingJson.js'

export async function graphMiddleware({ targetProjectConfig, entrypointKey }) {
  let { createGraphMiddleware } = await initializeGraph({ targetProjectConfig, graphDataArray: [graphData] })
  return createGraphMiddleware({ entrypointKey })
}
