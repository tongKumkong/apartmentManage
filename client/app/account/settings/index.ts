'use strict';
const angular = require('angular');
import SettingsController from './settings.controller';

export default angular.module('apartmentManageApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
