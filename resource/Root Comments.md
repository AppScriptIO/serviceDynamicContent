GET request

  / --> document root template
  
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
