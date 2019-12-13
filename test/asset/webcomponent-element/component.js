{
  // TODO: Consider switching `document-element` to https://www.polymer-project.org/2.0/docs/api/elements/Polymer.DomBind
  // window.addEventListener('WebComponentsReady', function() {
  const App = window.App || {}
  // Extend Polymer.Element base class
  // class Element extends App.mixin.app.setting(Polymer.Element) {
  class Element extends Polymer.mixinBehaviors([App.behavior], Polymer.Element) {
    static get is() {
      return 'document-element'
    }
    static get properties() {
      return {
        /* properties metadata */

        layout: {
          type: String,
          notify: true,
          reflectToAttribute: true,
        },
        page: {
          type: Object,
          notify: true,
          reflectToAttribute: true,
        },
        subroute: {
          type: Object,
          notify: true,
          reflectToAttribute: true,
        },
      }
    }
    static get observers() {
      return [
        /* observer descriptors */
        '_routePageChanged(routeData.pathTopLevel, subroute.path)',
        '_routeChanged(route)',
      ]
    }
    constructor() {
      super()
      // Values are altered when server renderint to front-end (slashes are added).
      this.app.setting.location.routeBasePath = `${this.app.config.PROTOCOL}${this.app.config.HOST}`
      this.app.documentElement = this // register document element to be used as entrypoint to Polymer's binding system.
    }
    connectedCallback() {
      super.connectedCallback()
    }

    _routeChanged(route) {
      // console.log(route)
    }

    _routePageChanged(pathTopLevel, pathLevel2) {
      // Choose page/view using URL path.
      if (typeof pathTopLevel == 'undefined') return // skip initial `pathTopLevel` value of undefined.
      let documentKey = this.checkConditionTree(pathTopLevel, pathLevel2.replace(/\//g, ''))

      // Document & Template Tree procesing.
      let document = this.app.document.filter(unit => {
        if (unit.key == documentKey) return true
        return false
      })[0]

      // document.page.filename = document.page.file.substr(0, document.page.file.indexOf('.'));
      this.layout = document.layout
      this.page = document.page
    }

    checkConditionTree(pathTopLevel, pathLevel2) {
      let documentKey = ''

      switch (
        pathTopLevel // Choose appropriate view/page to view
      ) {
        case '': // empty path
          documentKey = 'frontpage'
          break
        case 'step': // empty path
          documentKey = 'step'
          break
        case 'university':
          documentKey = 'universityPage'
          break
        case 'contact':
          documentKey = 'about'
          break
        case 'studyfield':
          switch (pathLevel2) {
            case 'medicine':
              documentKey = 'medicine'
              break
            default:
              documentKey = 'studyfieldPage'
              break
          }
          break
        case 'country':
          switch (pathLevel2) {
            case 'bucharest':
              documentKey = 'bucharest'
              break
            default:
              documentKey = 'countryPage'
              break
          }
          break
        case 'registration':
          switch (pathLevel2) {
            case 'single':
              documentKey = 'registration-single'
              break
            case 'agency':
              documentKey = 'registration-agency'
              break
            default:
              documentKey = 'registration-agency'
              break
          }
          break
        case 'view1':
          documentKey = 'homePage-view1'
          break
        case 'view2':
          documentKey = 'homePage-view2'
          break
        case 'view3':
          documentKey = 'homePage-view3'
          break
        default:
        case 'view404':
          documentKey = 'view-state404'
          break
        // case undefined: // skop initial `pathTopLevel` value of undefined.
        //   break;
      }
      return documentKey
    }
  }
  // Register custom element definition using standard platform API
  window.customElements.define(Element.is, Element)
  // })
}
