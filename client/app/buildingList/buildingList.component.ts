'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './buildingList.routes';

export class BuildingListComponent {
  $http;
  scope;
  socket;
  buildings = [];
  message;
  userData: Function;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth, User) {
    this.$http = $http;
    this.socket = socket;
    this.message = 'Hello';
    this.userData = Auth.getCurrentUser;

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('building');
    });
  }

  $onInit() {
    this.$http.get('api/buildings/mine').then(response => {
      this.buildings = response.data;
      this.socket.syncUpdates('buildings', this.buildings);
    });
  }
}

export default angular.module('apartmentManageApp.buildingList', [uiRouter])
  .config(routes)
  .component('buildingList', {
    template: require('./buildingList.pug'),
    controller: BuildingListComponent,
    controllerAs: 'buildingListCtrl'
  })
  .name;
