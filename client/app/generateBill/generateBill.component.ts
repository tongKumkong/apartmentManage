'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './generateBill.routes';

export class GenerateBillComponent {
  /*@ngInject*/
  $state;
  startDate;
  endDate;
  roomPrice;
  waterPrice;
  electricPrice;
  constructor($state) {
    this.$state = $state;
  }

  goToGeneratedBills(form) {
    if (form.$valid) {
      this.$state.go('generatedBill', {
        info: {
          startDate: this.startDate,
          endDate: this.endDate,
          roomPrice: this.roomPrice,
          waterPrice: this.waterPrice,
          electricPrice: this.electricPrice
        }
      });
    }
  }
}

export default angular.module('apartmentManageApp.generateBill', [uiRouter])
  .config(routes)
  .component('generateBill', {
    template: require('./generateBill.pug'),
    controller: GenerateBillComponent,
    controllerAs: 'generateBillCtrl'
  })
  .name;