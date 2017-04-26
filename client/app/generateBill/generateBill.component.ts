'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './generateBill.routes';

export class GenerateBillComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
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
