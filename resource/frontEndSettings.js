// This data is rendered in server-side and used in the frontend application
async function loadFrontendData({ targetConfig }) {
  let defaultLanguage = 'English'
  targetConfig.frontendStatic = {
    // Configurations passed to frontend
    config: targetConfig,
    setting: {
      location: {
        routeBasePath: `${targetConfig.PROTOCOL}${targetConfig.HOST}`,
        cdnBasePath: instnace['StaticContent'].url,
      },
      mode: {
        // version / mode of app
        language: defaultLanguage, // default language
      },
    },
    route: 'route',
    // documentFrontendData
    document: [
      {
        key: 'registration-single',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'registration-single',
          file: 'registration-single.html',
          // file: 'registration-single/entrypoint.js$renderJSImportWebcomponent'
        },
      },
      {
        key: 'registration-agency',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'registration-agency',
          file: 'registration-agency.html',
        },
      },
      {
        key: 'view-state404',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'viewState404',
          file: 'view-state404/view-state404.html$',
        },
      },
      {
        key: 'universityPage',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'universityPage',
          file: 'view-underconstruction.html',
        },
      },
      {
        key: 'studyfieldPage',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'studyfieldPage',
          file: 'view-underconstruction.html',
        },
      },
      {
        key: 'countryPage',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'countryPage',
          file: 'view-list-item.html',
        },
      },
      {
        key: 'bucharest',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'studyfieldSingleArticle',
          file: 'view-article.html',
        },
      },
      {
        key: 'medicine',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'studyfieldSingleArticle',
          file: 'view-article.html',
        },
      },
      {
        key: 'frontpage',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'frontPage',
          file: 'view-frontpage.html',
        },
      },
      {
        key: 'about',
        layout: 'webapp-layout-toolbar',
        page: {
          selectorName: 'about',
          file: 'view-about.html',
        },
      },
    ],
    uiContent: await queryPatternImplementation({ languageDocumentKey: defaultLanguage }),
  }
}
