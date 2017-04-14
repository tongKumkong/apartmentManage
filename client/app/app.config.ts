'use strict';

export function routeConfig($urlRouterProvider, $locationProvider,$mdThemingProvider) {
  'ngInject';

  $urlRouterProvider
    .otherwise('/');
  $mdThemingProvider
    .theme('default');
  $locationProvider.html5Mode(true);
}
