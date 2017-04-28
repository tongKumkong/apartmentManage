'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './generatedBill.routes';

export class GeneratedBillComponent {
  /*@ngInject*/
  bills;
  info;
  $http;
  $state;
  constructor($stateParams, $http, $state) {
    this.info = $stateParams.info;
    this.$http = $http;
    this.bills = [];
    this.$state = $state;
  }

  $onInit() {
    if (this.info == null) {
      this.$state.go('generateBill');
    }
    else {
      this.$http.get('/api/buildings/mine/').then(res => {
        res.data.forEach(building => {
          this.bills[building._id] = {
            buildingName: building.name,
            rooms: []
          }
          this.$http.get('/api/rooms/building/' + building._id).then(res => {
            res.data.forEach(room => {
              var billroom = {
                name: room.name,
                water: {
                  start: 0,
                  end: 0
                },
                electric: {
                  start: 0,
                  end: 0
                }
              }
              this.$http.get('api/history-waters/room/' + room._id + '/date/' + this.info.startDate).then(res => {
                console.log(res.data)
                billroom.water.start = res.data
                this.$http.get('api/history-waters/room/' + room._id + '/date/' + this.info.endDate).then(res => {
                  billroom.water.end = res.data
                  this.$http.get('api/history-electrics/room/' + room._id + '/date/' + this.info.startDate).then(res => {
                    billroom.electric.start = res.data
                    this.$http.get('api/history-electrics/room/' + room._id + '/date/' + this.info.endDate).then(res => {
                      billroom.electric.end = res.data
                      this.bills[room.building].rooms.push(billroom);
                      console.log(this.bills);
                    });
                  });
                });
              });
            });
          });
        });
      })
    }
  }
}

export default angular.module('apartmentManageApp.generatedBill', [uiRouter])
  .config(routes)
  .component('generatedBill', {
    template: require('./generatedBill.pug'),
    controller: GeneratedBillComponent,
    controllerAs: 'generatedBillCtrl'
  })
  .name;
