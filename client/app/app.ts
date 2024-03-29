'use strict';
const angular = require('angular');

const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');
import 'angular-socket-io';

const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');

const ngMaterial = require('angular-material');
const ngAnimate = require('angular-animate');
const ngMdIcons = require('angular-material-icons');

import { routeConfig } from './app.config';
import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import BuildingListComponent from './buildingList/buildingList.component';
import RoomsComponent from './rooms/rooms.component';
import GenerateBillComponent from './generateBill/generateBill.component';
import GeneratedBillComponent from './generatedBill/generatedBill.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import './app.styl';

require('imports?this=>window,exports=>false,define=>false!ui-cropper');
require('angular-material-data-table');
require('ng-material-datetimepicker');

angular.module('apartmentManageApp', [
  ngCookies,
  ngResource,
  ngSanitize,
  ngMaterial,
  ngMdIcons,
  'ngMaterialDatePicker',
  'uiCropper',
  'md.data.table',
  'btford.socket-io',

  uiRouter,
  uiBootstrap,
  _Auth,
  ,
  account,
  admin, navbar,
  footer,
  main,
  BuildingListComponent,
  RoomsComponent,
  GenerateBillComponent,
  GeneratedBillComponent,
  constants,
  socket,
  util
])
  .config(routeConfig)
  .run(function ($rootScope, $location, $mdDialog, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedIn(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
      $mdDialog.cancel();
    });
  });

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['apartmentManageApp'], {
      strictDi: true
    });
  });
