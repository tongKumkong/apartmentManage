'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('rooms', {
      url: '/rooms',
      params: {
          obj:null
        },
      template: '<rooms></rooms>'
    });
}
