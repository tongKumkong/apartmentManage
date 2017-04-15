'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('buildingList', {
      url: '/buildingList',
      template: '<building-list></building-list>'
    });
}
