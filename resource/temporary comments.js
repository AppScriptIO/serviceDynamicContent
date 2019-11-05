/**
GET request:
/@<...> 
    babelTranspiler.js TODO: add condition if(targetProjectConfig.runtimeVariable.DEPLOYMENT == 'development' && !targetProjectConfig.runtimeVariable.DISTRIBUTION)
    serveFile.js 
    map@PathToAbsolutePath.js
    setResponseHeaders.js
    languageContent.js
    useragentDetection.js
    bodyParser.js
    serverCommonFunctionality.js
    notFound.js
    cacheControl.js

if(/asset)
    setResponseHeaders.js
    languageContent.js
    useragentDetection.js
    bodyParser.js
    serverCommonFunctionality.js
    notFound.js
    cacheControl.js
    serveFile.js

    if(<...>$function)
      setResponseHeaders.js
      languageContent.js
      useragentDetection.js
      bodyParser.js
      serverCommonFunctionality.js
      notFound.js
      cacheControl.js
      serveServerSideRenderedFile:serveFile.js

    if(javascript/jspm.config.js) 
      serve jspm file (/asset/javascript/jspm.config.js).

if(/upload)
    setResponseHeaders.js
    languageContent.js
    useragentDetection.js
    bodyParser.js
    serverCommonFunctionality.js
    notFound.js
    cacheControl.js
    serveFile

*/

/**
GET request --> document root template
if(/google276dc830e9fade0c.html) /template/root/google276dc830e9fade0c.html
if(/serviceWorker.js)
  useragentDetection.js
  bodyParser.js
  serverCommonFunctionality.js
  notFound.js
  /asset/javascript/serviceWorker/serviceWorker.js 
else(/<*>) Root folder & template:
  languageContent.js
  useragentDetection.js
  bodyParser.js
  serverCommonFunctionality.js
  notFound.js
  serve /template/ files
  "renderTemplateDocument - main root template" --> execute underscoreRendering template/root/entrypoint.html
    -header
      underscoreRendering template/root/systemjsSetting.js.html
      underscoreRendering template/root/webcomponentPolyfill.js.html
      underscoreRendering template/root/entrypoint.js.html
      underscoreRendering asset/metadata/metadata.html
      underscoreRendering wrapJsTag template/root/babelTranspiler.js
    -bodyOpen
    -bodyClose
      underscoreRendering execute wrapJsTag template/root/serviceWorker.js
      underscoreRendering wrapJsTag template/root/webScoket.js
      underscoreRendering wrapJsTag template/root/googleAnalytics.js

*/
