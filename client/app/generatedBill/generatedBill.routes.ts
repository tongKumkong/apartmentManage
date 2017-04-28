'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('generatedBill', {
      url: '/generatedBill',
      template: '<generated-bill></generated-bill>',
      params: {
          info:null
        },
    });
}
