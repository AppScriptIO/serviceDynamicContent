{
  const AppFrontEnd = JSON.parse('{%= JSON.stringify(argument.someConfig1) %}')

  AppFrontEnd.instance = JSON.parse('{%= JSON.stringify(argument.someConfig2) %}')

  function AppClass() {}

  // Global Object that handles the app and other stuff.
  window.App = AppFrontEnd || new AppClass()

  const App = window.App

  App.module = App.module || {} // polymer behaviors that include functions and properties.

  const behavior = {
    // Setting behavior for the app.
    properties: {
      app: {
        type: Object,
        value: function() {
          return App
        },
        notify: true,
        reflectToAttribute: true,
      },
    },
  }

  App.behavior = App.behavior || {} // polymer behaviors that include functions and properties.

  App.behavior = behavior
}
