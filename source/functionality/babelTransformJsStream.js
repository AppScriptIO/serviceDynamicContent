"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.transformJavascript = transformJavascript;

var _stream = _interopRequireDefault(require("stream"));
var _handleJSNativeDataStructure = require("@dependency/handleJSNativeDataStructure");

let babel, getBabelConfig;
try {
  babel = require('@babel/core');
  getBabelConfig = require('@deployment/javascriptTranspilation').getBabelConfig;
} catch (error) {


}

async function transformJavascript({
  scriptCode,
  filePath,
  transformBabelPreset = getBabelConfig('nativeClientSideRuntime.BabelConfig.js').presets,
  transformBabelPlugin = getBabelConfig('nativeClientSideRuntime.BabelConfig.js').plugins })


{
  if (transformBabelPlugin.length) {

    if (scriptCode instanceof _stream.default.Stream) scriptCode = await (0, _handleJSNativeDataStructure.streamToString)(scriptCode);

    let transformedObject = babel.transformSync(scriptCode, {
      filename: filePath,
      presets: transformBabelPreset,
      plugins: transformBabelPlugin });

    return transformedObject.code;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9mdW5jdGlvbmFsaXR5L2JhYmVsVHJhbnNmb3JtSnNTdHJlYW0uanMiXSwibmFtZXMiOlsiYmFiZWwiLCJnZXRCYWJlbENvbmZpZyIsInJlcXVpcmUiLCJlcnJvciIsInRyYW5zZm9ybUphdmFzY3JpcHQiLCJzY3JpcHRDb2RlIiwiZmlsZVBhdGgiLCJ0cmFuc2Zvcm1CYWJlbFByZXNldCIsInByZXNldHMiLCJ0cmFuc2Zvcm1CYWJlbFBsdWdpbiIsInBsdWdpbnMiLCJsZW5ndGgiLCJzdHJlYW0iLCJTdHJlYW0iLCJ0cmFuc2Zvcm1lZE9iamVjdCIsInRyYW5zZm9ybVN5bmMiLCJmaWxlbmFtZSIsImNvZGUiXSwibWFwcGluZ3MiOiI7O0FBRUE7QUFDQTs7QUFFQSxJQUFJQSxLQUFKLEVBQVdDLGNBQVg7QUFDQSxJQUFJO0FBQ0ZELEVBQUFBLEtBQUssR0FBR0UsT0FBTyxDQUFDLGFBQUQsQ0FBZjtBQUNBRCxFQUFBQSxjQUFjLEdBQUdDLE9BQU8sQ0FBQyxxQ0FBRCxDQUFQLENBQStDRCxjQUFoRTtBQUNELENBSEQsQ0FHRSxPQUFPRSxLQUFQLEVBQWM7OztBQUdmOztBQUVNLGVBQWVDLG1CQUFmLENBQW1DO0FBQ3hDQyxFQUFBQSxVQUR3QztBQUV4Q0MsRUFBQUEsUUFGd0M7QUFHeENDLEVBQUFBLG9CQUFvQixHQUFHTixjQUFjLENBQUMsd0NBQUQsQ0FBZCxDQUF5RE8sT0FIeEM7QUFJeENDLEVBQUFBLG9CQUFvQixHQUFHUixjQUFjLENBQUMsd0NBQUQsQ0FBZCxDQUF5RFMsT0FKeEMsRUFBbkM7OztBQU9KO0FBQ0QsTUFBSUQsb0JBQW9CLENBQUNFLE1BQXpCLEVBQWlDOztBQUUvQixRQUFJTixVQUFVLFlBQVlPLGdCQUFPQyxNQUFqQyxFQUF5Q1IsVUFBVSxHQUFHLE1BQU0saURBQWVBLFVBQWYsQ0FBbkI7O0FBRXpDLFFBQUlTLGlCQUFpQixHQUFHZCxLQUFLLENBQUNlLGFBQU4sQ0FBb0JWLFVBQXBCLEVBQWdDO0FBQ3REVyxNQUFBQSxRQUFRLEVBQUVWLFFBRDRDO0FBRXRERSxNQUFBQSxPQUFPLEVBQUVELG9CQUY2QztBQUd0REcsTUFBQUEsT0FBTyxFQUFFRCxvQkFINkMsRUFBaEMsQ0FBeEI7O0FBS0EsV0FBT0ssaUJBQWlCLENBQUNHLElBQXpCO0FBQ0Q7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZmlsZXN5c3RlbSBmcm9tICdmcydcbmltcG9ydCBzdHJlYW0gZnJvbSAnc3RyZWFtJ1xuaW1wb3J0IHsgc3RyZWFtVG9TdHJpbmcgfSBmcm9tICdAZGVwZW5kZW5jeS9oYW5kbGVKU05hdGl2ZURhdGFTdHJ1Y3R1cmUnXG5cbmxldCBiYWJlbCwgZ2V0QmFiZWxDb25maWcgLy8gYXMgaW4gcHJvZHVjdGlvbiBhcHBEZXBsb3ltZW50TGlmZWN5Y2xlIGRlcGVuZGVuY3kgZG9lc24ndCBleGlzdC5cbnRyeSB7XG4gIGJhYmVsID0gcmVxdWlyZSgnQGJhYmVsL2NvcmUnKVxuICBnZXRCYWJlbENvbmZpZyA9IHJlcXVpcmUoJ0BkZXBsb3ltZW50L2phdmFzY3JpcHRUcmFuc3BpbGF0aW9uJykuZ2V0QmFiZWxDb25maWdcbn0gY2F0Y2ggKGVycm9yKSB7XG4gIC8vIFRPRE86IHBhc3MgZW52aXJvbm1lbnRWYXJpYWJsZXMgZnJvbSBjb25maWcuXG4gIC8vIGlmIChERVZFTE9QTUVOVCkgdGhyb3cgZXJyb3Jcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zZm9ybUphdmFzY3JpcHQoe1xuICBzY3JpcHRDb2RlLFxuICBmaWxlUGF0aCxcbiAgdHJhbnNmb3JtQmFiZWxQcmVzZXQgPSBnZXRCYWJlbENvbmZpZygnbmF0aXZlQ2xpZW50U2lkZVJ1bnRpbWUuQmFiZWxDb25maWcuanMnKS5wcmVzZXRzLFxuICB0cmFuc2Zvcm1CYWJlbFBsdWdpbiA9IGdldEJhYmVsQ29uZmlnKCduYXRpdmVDbGllbnRTaWRlUnVudGltZS5CYWJlbENvbmZpZy5qcycpLnBsdWdpbnMsXG59OiB7XG4gIHNjcmlwdENvZGU6IHN0cmVhbSxcbn0pIHtcbiAgaWYgKHRyYW5zZm9ybUJhYmVsUGx1Z2luLmxlbmd0aCkge1xuICAgIC8vIGNvbnZlcnQgc3RyZWFtIGludG8gc3RyaW5nXG4gICAgaWYgKHNjcmlwdENvZGUgaW5zdGFuY2VvZiBzdHJlYW0uU3RyZWFtKSBzY3JpcHRDb2RlID0gYXdhaXQgc3RyZWFtVG9TdHJpbmcoc2NyaXB0Q29kZSlcbiAgICAvLyB0cmFuc2Zvcm0gY29kZSB1c2luZyBhcnJheSBvZiBwbHVnaW5zLlxuICAgIGxldCB0cmFuc2Zvcm1lZE9iamVjdCA9IGJhYmVsLnRyYW5zZm9ybVN5bmMoc2NyaXB0Q29kZSwge1xuICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLCAvLyBodHRwczovL2JhYmVsanMuaW8vZG9jcy9lbi9vcHRpb25zI2ZpbGVuYW1lXG4gICAgICBwcmVzZXRzOiB0cmFuc2Zvcm1CYWJlbFByZXNldCxcbiAgICAgIHBsdWdpbnM6IHRyYW5zZm9ybUJhYmVsUGx1Z2luLFxuICAgIH0pXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVkT2JqZWN0LmNvZGUgLy8gb2JqZWN0IGNvbnRhaW5pbmcgJ2NvZGUnIHByb3BlcnR5XG4gIH1cbn1cbiJdfQ==