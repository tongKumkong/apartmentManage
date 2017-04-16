'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './rooms.routes';

export class RoomsComponent {
  building;
  $state;
  $http;
  rooms;
  $mdDialog;

  /*@ngInject*/
  constructor($stateParams, $state, $http, $mdDialog) {
    this.$state = $state;
    this.$http = $http
    this.building = $stateParams.obj;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    if (this.building == null) {
      this.$state.go('buildingList');
    } else {
      this.$http.get('api/rooms/building/' + this.building._id).then(response => {
        this.rooms = response.data;
      });
    }
  }

  addRoomDialog(ev) {
    this.$mdDialog.show({
      controller: addRoomDialogController,
      controllerAs: 'addRoomDialogCtrl',
      template: require('./addRoomDialog.pug'),
      locals: {
        building: this.building
      },
      parent: angular.element(document.querySelector('ui-view')),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false
    })

    this.$http.get('api/rooms/building/' + this.building._id).then(response => {
      this.rooms = response.data;
    });
  }

  goToRoom(roomSelect, ev) {
    this.$mdDialog.show({
      controller: roomDetailsDialogController,
      controllerAs: 'roomDetailsDialogCtrl',
      template: require('./roomDetailsDialog.pug'),
      locals: {
        room: roomSelect
      },
      parent: angular.element(document.querySelector('ui-view')),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: true
    })
  }


}

export default angular.module('apartmentManageApp.rooms', [uiRouter])
  .config(routes)
  .component('rooms', {
    template: require('./rooms.pug'),
    controller: RoomsComponent,
    controllerAs: 'roomsCtrl'
  })
  .name;

class roomDetailsDialogController {
  room;
  $mdDialog;
  $http;
  constructor($mdDialog, $http, room) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.room = room;
  }

  cancel() {
    this.$mdDialog.cancel();
  }
  
}

angular.module('apartmentManageApp.roomDetailsDialogController', [])
  .component('roomDetailsDialogController', {
    template: require('./roomDetailsDialog.pug'),
    controller: roomDetailsDialogController,
    controllerAs: 'roomDetailsCtrl'
  });

class addRoomDialogController {
  $mdDialog;
  $http;
  newRoom;
  submitted;
  building;
  constructor($mdDialog, $http, building) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.building = building;
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  add(from) {
    this.submitted = true;
    if (from.$valid) {
      this.$http.post('api/rooms/', {
        building: this.building._id,
        name: this.newRoom
      }).then(() => {
        this.$mdDialog.cancel();
      })
    }
  }
}

angular.module('apartmentManageApp.addRoomDialogController', [])
  .component('addRoomDialogController', {
    template: require('./addRoomDialog.pug'),
    controller: addRoomDialogController,
    controllerAs: 'addRoomDialogCtrl'
  });