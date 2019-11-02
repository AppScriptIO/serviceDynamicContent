- Add package 'busboy' to parse html form data.
- Idea: Using appscript can be looked at creating abstractions for complex modules, hence instead of saying "Visual programming", it is "Abstraction visual programming" i.e. programming the relationship between abstractions, whether it is a code or complete module programs or instructions.
- Default condition tree entrypoint for cdn port and webappui port, make the default available in static self class for each port and with ability to override it with a parameter that will be passed during initialization. And by that a common module could be created for different ports (and using nested unit tree entrypoint key as parameter passed to the module).
- Share webcompoennts & javascript modules between different projects using appscript.
- Render and serve template files using a documentKey-File map or document key in url parameter, to render a specific file with a speciific template tree on demand.
- Think of State management strategy - Having a single observable that represents the action. With no race condition (promise race) and allowing undo actions. https://www.youtube.com/watch?v=H4EyuvGe_dg
- Implement a graph based koa like server, where the graph traversal executes the middlewares immediately and decides when to continue and when to halt further middleware execution for each request.


___
# server side 
-  TODO: change base url and access-control-allow-origin header according to DEPLOYMENT environment

-  TODO: Custom Dataset Schema/structure/blueprint, data document, csustom dataset type, custom fields, custom content type.
-  TODO: Condition Tree:
-  • Ability to decide insertion position of unit in subtree. e.g. before, after, first, last.
-  • Check non immediate children for each insertion point to insert them in their correct destination.
- • Define unique key for each child, to allow insertion into other inserted children. i.e. extending existing trees with other trees and children.
-  TODO: Merge ReusableNestedUnit implementations and organize them according to the requirements like returned value and algorithm executed on the nested tree.

___
# FRONT-END
- The build step that creates polyfilled versions of js files using polymer modulizer should be fixed. Fix build step - polyfill examples and gulp process in - https://github.com/Polymer/polymer-modulizer
- Use and follow envolvement of "lithtml" - https://github.com/kenchris/lit-element & https://github.com/PolymerLabs/lit-element
- Implement lit-html - not production ready yet: PolymerLabs/lit-element (doesn't support many core features).
- Polymer service worker:
	○ Codelabs PWA - https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-codelabs/content/ & https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/
	○ Workbox (offline support for JS web apps) - https://developers.google.com/web/tools/workbox/guides/get-started & https://github.com/GoogleChromeLabs/sw-toolbox & 
	○ https://developers.google.com/web/ & https://codelabs.developers.google.com/?cat=Web
- Polymer 3 - 
	○ https://www.polymer-project.org/blog/2018-03-23-polymer-3-latest-preview
	○ https://github.com/Polymer/polymer/blob/__auto_generated_3.0_preview/polymer-element.js
	○ https://github.com/PolymerLabs/start-polymer3/blob/master/src/start-polymer3.js
	○ https://github.com/PolymerElements/paper-checkbox/blob/__auto_generated_3.0_preview/index.html
- Load webcomponent without package folder name. -- maybe better to keep the package name folder which will allow differentiating between package and project's own modules.
- Create a folder structure that allows sharing javascript utility modules mainly between server and client side apps.
- Build step for template & condition configs for each element.
-  Deal with data binding for dynamicaly added webcomponent tags in selector element like iron-pages.
- Appscript - create function to load files into webcomponents in server side rendering using a relative path to the component/file being rendered - i.e. {%= loadFile('./component.css', <pattern>) %}
- Manage to load specific template configs & condition tree configs for each component from the database, by having a single config variable holding both routing config and template config. + Front end route condition check accepting route configuration object.
- Minify tagged literal strings using babel transpiler.



