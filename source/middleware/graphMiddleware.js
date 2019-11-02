import { initializeGraph } from '../../../utility/graphInitialization.js'
import * as graphData from '../resource/graphData.json'

export async function graphMiddleware({ targetProjectConfig, entrypointKey }) {
  let { createGraphMiddleware } = await initializeGraph({ targetProjectConfig, graphDataArray: [graphData] })
  return createGraphMiddleware({ entrypointKey })
}
