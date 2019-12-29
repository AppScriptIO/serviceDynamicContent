    serveStaticFile google276dc830e9fade0c.html
  
    serverStaticFile serviceWorker.js 
  
    serveUnderscoreRendered /template/*

    <!-- Template graph root -->

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