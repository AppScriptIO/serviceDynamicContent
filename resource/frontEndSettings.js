"use strict";
async function loadFrontendData({ targetConfig }) {
  let defaultLanguage = 'English';
  targetConfig.frontendStatic = {

    config: targetConfig,
    setting: {
      location: {
        routeBasePath: `${targetConfig.PROTOCOL}${targetConfig.HOST}`,
        cdnBasePath: instnace['StaticContent'].url },

      mode: {

        language: defaultLanguage } },


    route: 'route',

    document: [
    {
      key: 'registration-single',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'registration-single',
        file: 'registration-single.html' } },



    {
      key: 'registration-agency',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'registration-agency',
        file: 'registration-agency.html' } },


    {
      key: 'view-state404',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'viewState404',
        file: 'view-state404/view-state404.html$' } },


    {
      key: 'universityPage',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'universityPage',
        file: 'view-underconstruction.html' } },


    {
      key: 'studyfieldPage',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'studyfieldPage',
        file: 'view-underconstruction.html' } },


    {
      key: 'countryPage',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'countryPage',
        file: 'view-list-item.html' } },


    {
      key: 'bucharest',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'studyfieldSingleArticle',
        file: 'view-article.html' } },


    {
      key: 'medicine',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'studyfieldSingleArticle',
        file: 'view-article.html' } },


    {
      key: 'frontpage',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'frontPage',
        file: 'view-frontpage.html' } },


    {
      key: 'about',
      layout: 'webapp-layout-toolbar',
      page: {
        selectorName: 'about',
        file: 'view-about.html' } }],



    uiContent: await queryPatternImplementation({ languageDocumentKey: defaultLanguage }) };

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3Jlc291cmNlL2Zyb250RW5kU2V0dGluZ3MuanMiXSwibmFtZXMiOlsibG9hZEZyb250ZW5kRGF0YSIsInRhcmdldENvbmZpZyIsImRlZmF1bHRMYW5ndWFnZSIsImZyb250ZW5kU3RhdGljIiwiY29uZmlnIiwic2V0dGluZyIsImxvY2F0aW9uIiwicm91dGVCYXNlUGF0aCIsIlBST1RPQ09MIiwiSE9TVCIsImNkbkJhc2VQYXRoIiwiaW5zdG5hY2UiLCJ1cmwiLCJtb2RlIiwibGFuZ3VhZ2UiLCJyb3V0ZSIsImRvY3VtZW50Iiwia2V5IiwibGF5b3V0IiwicGFnZSIsInNlbGVjdG9yTmFtZSIsImZpbGUiLCJ1aUNvbnRlbnQiLCJxdWVyeVBhdHRlcm5JbXBsZW1lbnRhdGlvbiIsImxhbmd1YWdlRG9jdW1lbnRLZXkiXSwibWFwcGluZ3MiOiI7QUFDQSxlQUFlQSxnQkFBZixDQUFnQyxFQUFFQyxZQUFGLEVBQWhDLEVBQWtEO0FBQ2hELE1BQUlDLGVBQWUsR0FBRyxTQUF0QjtBQUNBRCxFQUFBQSxZQUFZLENBQUNFLGNBQWIsR0FBOEI7O0FBRTVCQyxJQUFBQSxNQUFNLEVBQUVILFlBRm9CO0FBRzVCSSxJQUFBQSxPQUFPLEVBQUU7QUFDUEMsTUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFFBQUFBLGFBQWEsRUFBRyxHQUFFTixZQUFZLENBQUNPLFFBQVMsR0FBRVAsWUFBWSxDQUFDUSxJQUFLLEVBRHBEO0FBRVJDLFFBQUFBLFdBQVcsRUFBRUMsUUFBUSxDQUFDLGVBQUQsQ0FBUixDQUEwQkMsR0FGL0IsRUFESDs7QUFLUEMsTUFBQUEsSUFBSSxFQUFFOztBQUVKQyxRQUFBQSxRQUFRLEVBQUVaLGVBRk4sRUFMQyxFQUhtQjs7O0FBYTVCYSxJQUFBQSxLQUFLLEVBQUUsT0FicUI7O0FBZTVCQyxJQUFBQSxRQUFRLEVBQUU7QUFDUjtBQUNFQyxNQUFBQSxHQUFHLEVBQUUscUJBRFA7QUFFRUMsTUFBQUEsTUFBTSxFQUFFLHVCQUZWO0FBR0VDLE1BQUFBLElBQUksRUFBRTtBQUNKQyxRQUFBQSxZQUFZLEVBQUUscUJBRFY7QUFFSkMsUUFBQUEsSUFBSSxFQUFFLDBCQUZGLEVBSFIsRUFEUTs7OztBQVVSO0FBQ0VKLE1BQUFBLEdBQUcsRUFBRSxxQkFEUDtBQUVFQyxNQUFBQSxNQUFNLEVBQUUsdUJBRlY7QUFHRUMsTUFBQUEsSUFBSSxFQUFFO0FBQ0pDLFFBQUFBLFlBQVksRUFBRSxxQkFEVjtBQUVKQyxRQUFBQSxJQUFJLEVBQUUsMEJBRkYsRUFIUixFQVZROzs7QUFrQlI7QUFDRUosTUFBQUEsR0FBRyxFQUFFLGVBRFA7QUFFRUMsTUFBQUEsTUFBTSxFQUFFLHVCQUZWO0FBR0VDLE1BQUFBLElBQUksRUFBRTtBQUNKQyxRQUFBQSxZQUFZLEVBQUUsY0FEVjtBQUVKQyxRQUFBQSxJQUFJLEVBQUUsbUNBRkYsRUFIUixFQWxCUTs7O0FBMEJSO0FBQ0VKLE1BQUFBLEdBQUcsRUFBRSxnQkFEUDtBQUVFQyxNQUFBQSxNQUFNLEVBQUUsdUJBRlY7QUFHRUMsTUFBQUEsSUFBSSxFQUFFO0FBQ0pDLFFBQUFBLFlBQVksRUFBRSxnQkFEVjtBQUVKQyxRQUFBQSxJQUFJLEVBQUUsNkJBRkYsRUFIUixFQTFCUTs7O0FBa0NSO0FBQ0VKLE1BQUFBLEdBQUcsRUFBRSxnQkFEUDtBQUVFQyxNQUFBQSxNQUFNLEVBQUUsdUJBRlY7QUFHRUMsTUFBQUEsSUFBSSxFQUFFO0FBQ0pDLFFBQUFBLFlBQVksRUFBRSxnQkFEVjtBQUVKQyxRQUFBQSxJQUFJLEVBQUUsNkJBRkYsRUFIUixFQWxDUTs7O0FBMENSO0FBQ0VKLE1BQUFBLEdBQUcsRUFBRSxhQURQO0FBRUVDLE1BQUFBLE1BQU0sRUFBRSx1QkFGVjtBQUdFQyxNQUFBQSxJQUFJLEVBQUU7QUFDSkMsUUFBQUEsWUFBWSxFQUFFLGFBRFY7QUFFSkMsUUFBQUEsSUFBSSxFQUFFLHFCQUZGLEVBSFIsRUExQ1E7OztBQWtEUjtBQUNFSixNQUFBQSxHQUFHLEVBQUUsV0FEUDtBQUVFQyxNQUFBQSxNQUFNLEVBQUUsdUJBRlY7QUFHRUMsTUFBQUEsSUFBSSxFQUFFO0FBQ0pDLFFBQUFBLFlBQVksRUFBRSx5QkFEVjtBQUVKQyxRQUFBQSxJQUFJLEVBQUUsbUJBRkYsRUFIUixFQWxEUTs7O0FBMERSO0FBQ0VKLE1BQUFBLEdBQUcsRUFBRSxVQURQO0FBRUVDLE1BQUFBLE1BQU0sRUFBRSx1QkFGVjtBQUdFQyxNQUFBQSxJQUFJLEVBQUU7QUFDSkMsUUFBQUEsWUFBWSxFQUFFLHlCQURWO0FBRUpDLFFBQUFBLElBQUksRUFBRSxtQkFGRixFQUhSLEVBMURROzs7QUFrRVI7QUFDRUosTUFBQUEsR0FBRyxFQUFFLFdBRFA7QUFFRUMsTUFBQUEsTUFBTSxFQUFFLHVCQUZWO0FBR0VDLE1BQUFBLElBQUksRUFBRTtBQUNKQyxRQUFBQSxZQUFZLEVBQUUsV0FEVjtBQUVKQyxRQUFBQSxJQUFJLEVBQUUscUJBRkYsRUFIUixFQWxFUTs7O0FBMEVSO0FBQ0VKLE1BQUFBLEdBQUcsRUFBRSxPQURQO0FBRUVDLE1BQUFBLE1BQU0sRUFBRSx1QkFGVjtBQUdFQyxNQUFBQSxJQUFJLEVBQUU7QUFDSkMsUUFBQUEsWUFBWSxFQUFFLE9BRFY7QUFFSkMsUUFBQUEsSUFBSSxFQUFFLGlCQUZGLEVBSFIsRUExRVEsQ0Fma0I7Ozs7QUFrRzVCQyxJQUFBQSxTQUFTLEVBQUUsTUFBTUMsMEJBQTBCLENBQUMsRUFBRUMsbUJBQW1CLEVBQUV0QixlQUF2QixFQUFELENBbEdmLEVBQTlCOztBQW9HRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgZGF0YSBpcyByZW5kZXJlZCBpbiBzZXJ2ZXItc2lkZSBhbmQgdXNlZCBpbiB0aGUgZnJvbnRlbmQgYXBwbGljYXRpb25cbmFzeW5jIGZ1bmN0aW9uIGxvYWRGcm9udGVuZERhdGEoeyB0YXJnZXRDb25maWcgfSkge1xuICBsZXQgZGVmYXVsdExhbmd1YWdlID0gJ0VuZ2xpc2gnXG4gIHRhcmdldENvbmZpZy5mcm9udGVuZFN0YXRpYyA9IHtcbiAgICAvLyBDb25maWd1cmF0aW9ucyBwYXNzZWQgdG8gZnJvbnRlbmRcbiAgICBjb25maWc6IHRhcmdldENvbmZpZyxcbiAgICBzZXR0aW5nOiB7XG4gICAgICBsb2NhdGlvbjoge1xuICAgICAgICByb3V0ZUJhc2VQYXRoOiBgJHt0YXJnZXRDb25maWcuUFJPVE9DT0x9JHt0YXJnZXRDb25maWcuSE9TVH1gLFxuICAgICAgICBjZG5CYXNlUGF0aDogaW5zdG5hY2VbJ1N0YXRpY0NvbnRlbnQnXS51cmwsXG4gICAgICB9LFxuICAgICAgbW9kZToge1xuICAgICAgICAvLyB2ZXJzaW9uIC8gbW9kZSBvZiBhcHBcbiAgICAgICAgbGFuZ3VhZ2U6IGRlZmF1bHRMYW5ndWFnZSwgLy8gZGVmYXVsdCBsYW5ndWFnZVxuICAgICAgfSxcbiAgICB9LFxuICAgIHJvdXRlOiAncm91dGUnLFxuICAgIC8vIGRvY3VtZW50RnJvbnRlbmREYXRhXG4gICAgZG9jdW1lbnQ6IFtcbiAgICAgIHtcbiAgICAgICAga2V5OiAncmVnaXN0cmF0aW9uLXNpbmdsZScsXG4gICAgICAgIGxheW91dDogJ3dlYmFwcC1sYXlvdXQtdG9vbGJhcicsXG4gICAgICAgIHBhZ2U6IHtcbiAgICAgICAgICBzZWxlY3Rvck5hbWU6ICdyZWdpc3RyYXRpb24tc2luZ2xlJyxcbiAgICAgICAgICBmaWxlOiAncmVnaXN0cmF0aW9uLXNpbmdsZS5odG1sJyxcbiAgICAgICAgICAvLyBmaWxlOiAncmVnaXN0cmF0aW9uLXNpbmdsZS9lbnRyeXBvaW50LmpzJHJlbmRlckpTSW1wb3J0V2ViY29tcG9uZW50J1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAncmVnaXN0cmF0aW9uLWFnZW5jeScsXG4gICAgICAgIGxheW91dDogJ3dlYmFwcC1sYXlvdXQtdG9vbGJhcicsXG4gICAgICAgIHBhZ2U6IHtcbiAgICAgICAgICBzZWxlY3Rvck5hbWU6ICdyZWdpc3RyYXRpb24tYWdlbmN5JyxcbiAgICAgICAgICBmaWxlOiAncmVnaXN0cmF0aW9uLWFnZW5jeS5odG1sJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ3ZpZXctc3RhdGU0MDQnLFxuICAgICAgICBsYXlvdXQ6ICd3ZWJhcHAtbGF5b3V0LXRvb2xiYXInLFxuICAgICAgICBwYWdlOiB7XG4gICAgICAgICAgc2VsZWN0b3JOYW1lOiAndmlld1N0YXRlNDA0JyxcbiAgICAgICAgICBmaWxlOiAndmlldy1zdGF0ZTQwNC92aWV3LXN0YXRlNDA0Lmh0bWwkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ3VuaXZlcnNpdHlQYWdlJyxcbiAgICAgICAgbGF5b3V0OiAnd2ViYXBwLWxheW91dC10b29sYmFyJyxcbiAgICAgICAgcGFnZToge1xuICAgICAgICAgIHNlbGVjdG9yTmFtZTogJ3VuaXZlcnNpdHlQYWdlJyxcbiAgICAgICAgICBmaWxlOiAndmlldy11bmRlcmNvbnN0cnVjdGlvbi5odG1sJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ3N0dWR5ZmllbGRQYWdlJyxcbiAgICAgICAgbGF5b3V0OiAnd2ViYXBwLWxheW91dC10b29sYmFyJyxcbiAgICAgICAgcGFnZToge1xuICAgICAgICAgIHNlbGVjdG9yTmFtZTogJ3N0dWR5ZmllbGRQYWdlJyxcbiAgICAgICAgICBmaWxlOiAndmlldy11bmRlcmNvbnN0cnVjdGlvbi5odG1sJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ2NvdW50cnlQYWdlJyxcbiAgICAgICAgbGF5b3V0OiAnd2ViYXBwLWxheW91dC10b29sYmFyJyxcbiAgICAgICAgcGFnZToge1xuICAgICAgICAgIHNlbGVjdG9yTmFtZTogJ2NvdW50cnlQYWdlJyxcbiAgICAgICAgICBmaWxlOiAndmlldy1saXN0LWl0ZW0uaHRtbCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdidWNoYXJlc3QnLFxuICAgICAgICBsYXlvdXQ6ICd3ZWJhcHAtbGF5b3V0LXRvb2xiYXInLFxuICAgICAgICBwYWdlOiB7XG4gICAgICAgICAgc2VsZWN0b3JOYW1lOiAnc3R1ZHlmaWVsZFNpbmdsZUFydGljbGUnLFxuICAgICAgICAgIGZpbGU6ICd2aWV3LWFydGljbGUuaHRtbCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdtZWRpY2luZScsXG4gICAgICAgIGxheW91dDogJ3dlYmFwcC1sYXlvdXQtdG9vbGJhcicsXG4gICAgICAgIHBhZ2U6IHtcbiAgICAgICAgICBzZWxlY3Rvck5hbWU6ICdzdHVkeWZpZWxkU2luZ2xlQXJ0aWNsZScsXG4gICAgICAgICAgZmlsZTogJ3ZpZXctYXJ0aWNsZS5odG1sJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ2Zyb250cGFnZScsXG4gICAgICAgIGxheW91dDogJ3dlYmFwcC1sYXlvdXQtdG9vbGJhcicsXG4gICAgICAgIHBhZ2U6IHtcbiAgICAgICAgICBzZWxlY3Rvck5hbWU6ICdmcm9udFBhZ2UnLFxuICAgICAgICAgIGZpbGU6ICd2aWV3LWZyb250cGFnZS5odG1sJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ2Fib3V0JyxcbiAgICAgICAgbGF5b3V0OiAnd2ViYXBwLWxheW91dC10b29sYmFyJyxcbiAgICAgICAgcGFnZToge1xuICAgICAgICAgIHNlbGVjdG9yTmFtZTogJ2Fib3V0JyxcbiAgICAgICAgICBmaWxlOiAndmlldy1hYm91dC5odG1sJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICB1aUNvbnRlbnQ6IGF3YWl0IHF1ZXJ5UGF0dGVybkltcGxlbWVudGF0aW9uKHsgbGFuZ3VhZ2VEb2N1bWVudEtleTogZGVmYXVsdExhbmd1YWdlIH0pLFxuICB9XG59XG4iXX0=