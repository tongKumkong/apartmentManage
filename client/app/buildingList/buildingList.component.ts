'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './buildingList.routes';

export class BuildingListComponent {
  $http;
  scope;
  socket;
  buildings;
  message;
  userData : Function;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth, User) {
    this.$http = $http;
    this.socket = socket;
    this.message = 'Hello';
    this.userData = Auth.getCurrentUser;

      this.$http.get('api/buildings/mine').then(list => {
        this.buildings = list.data;
      })

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('building');
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
