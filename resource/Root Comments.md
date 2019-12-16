GET request

  / --> document root template
  
  if(/google276dc830e9fade0c.html) 
    serveStaticFile google276dc830e9fade0c.html
  
  if(/serviceWorker.js)
    <!-- X --> 
    serverStaticFile serviceWorker.js 
  
  else(/<*>) Root folder & template:
    languageContent.js
    <!-- X --> 
    serve /template/ files
    "renderTemplateDocument - main root template" --> execute underscoreRendering template/root/entrypoint.html
      -header
        underscoreRendering wrapJsTag systemjsSetting.js
        underscoreRendering wrapJsTag webcomponentPolyfill.js
        underscoreRendering entrypointScript.html
        underscoreRendering metadata.html
        underscoreRendering wrapJsTag template/root/babelTranspiler.js
      -bodyOpen
      -bodyClose
        underscoreRendering wrapJsTag template/root/serviceWorker.js
        underscoreRendering wrapJsTag template/root/webScoket.js
        underscoreRendering wrapJsTag template/root/googleAnalytics.js



X = {
    useragentDetection.js
    bodyParser.js
    serverCommonFunctionality.js
    notFound.js
}