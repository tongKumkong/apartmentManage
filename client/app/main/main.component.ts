const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  newThing = '';
  isAdmin: Function;
  isLoggedIn: Function;
  $state;
  /*@ngInject*/
  constructor($http, $scope, socket, Auth, $state) {
    this.$http = $http;
    this.socket = socket;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;

    this.$state = $state;
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    if ((!this.isAdmin()) && this.isLoggedIn()) {
      this.$state.go('buildingList');
    }

    this.$http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      this.socket.syncUpdates('thing', this.awesomeThings);
    });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

export default angular.module('apartmentManageApp.main', [
  uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
