'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('generateBill', {
      url: '/generateBill',
      template: '<generate-bill></generate-bill>'
    });
}
