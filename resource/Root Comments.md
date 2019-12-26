GET request

  if(/google276dc830e9fade0c.html) 
    serveStaticFile google276dc830e9fade0c.html
  
  if(/serviceWorker.js)
    <!-- X --> 
    serverStaticFile serviceWorker.js 

  /<*>
    languageContent.js
    <!-- X --> 
    serveUnderscoreRendered /template/*

  /
    <!-- Template graph root -->

X = {
    useragentDetection.js
    bodyParser.js
    serverCommonFunctionality.js
    notFound.js
}


Template Graph Root = {
    entrypoint.html underscoreRendering
      -header
        systemjsSetting.js underscoreRendering wrapJsTag
        webcomponentPolyfill.js underscoreRendering wrapJsTag
        entrypointScript.html underscoreRendering
        metadata.html underscoreRendering
        babelTranspiler.js underscoreRendering wrapJsTag
      -bodyOpen
      -bodyClose
        serviceWorker.js underscoreRendering wrapJsTag
        webScoket.js underscoreRendering wrapJsTag
        googleAnalytics.js underscoreRendering wrapJsTag
}