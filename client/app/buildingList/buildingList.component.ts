'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './buildingList.routes';

export class BuildingListComponent {
  $http;
  scope;
  socket;
  buildings = [];
  $mdDialog;
  $state

  /*@ngInject*/
  constructor($http, $scope, socket, $mdDialog, $state) {
    this.$state = $state;
    this.$http = $http;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    this.$http.get('api/buildings/mine').then(response => {
      this.buildings = response.data;
    });
  }

  addBuildingDialog(ev) {
    this.$mdDialog.show({
      controller: addBuildingDialogController,
      controllerAs: 'addBuildingDialogCtrl',
      template: require('./addBuildingDialog.pug'),
      parent: angular.element(document.querySelector('ui-view')),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false
    })

    this.$http.get('api/buildings/mine').then(response => {
      this.buildings = response.data;
      this.socket.syncUpdates('building', this.buildings);
    });
  }

  deleteBuildingDialog(building) {
    console.log('delete');
    console.log(building);
  }

  goToBuilding(building) {
    this.$state.go('rooms', { obj: building });
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

class addBuildingDialogController {
  $mdDialog;
  $http;
  newBuilding;
  submitted;
  constructor($mdDialog, $http) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  add(from) {
    this.submitted = true;
    if (from.$valid) {
      this.$http.post('api/buildings/one', {
        name: this.newBuilding
      }).then(() => {
        this.$mdDialog.cancel();
      })
    }
  }
}

angular.module('apartmentManageApp.addBuildingDialog', [])
  .component('addBuildingDialog', {
    template: require('./addBuildingDialog.pug'),
    controller: addBuildingDialogController,
    controllerAs: 'addBuildingDialogCtrl'
  });