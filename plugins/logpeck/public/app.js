import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

uiRoutes.enable();
uiRoutes
  .when('/', {
    template : template,
    controller : 'logpeckHelloWorld',
  });

uiModules
.get('app/logpeck', [])
.controller('logpeckHelloWorld',function ($scope , $http) {
  //初始化
  $http({
    method: 'GET',
    url: '../api/logpeck/init'
  }).then(function successCallback() {

  }, function errorCallback() {

  });


  //list task
  $scope.listTask = function () {
    $http({
      method: 'POST',
      url: '../api/logpeck/list'
    }).then(function successCallback(response) {
      console.log(response['data'][0]['Name']);
      var new_arr = [];
      for (var id=0 ; id<response['data'].length ; id++) {
        new_arr.push(response['data'][id]['Name']);
      }
      $scope.T_Name=new_arr;
    }, function errorCallback() {
    });
  };


  //startTask
  $scope.startTask = function ($event) {
    //console.log(event.target.getAttribute('name'));
    $http({
      method: 'POST',
      url: '../api/logpeck/start',
      data: {name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      //console.log(response['data'][0]['Name']);
    }, function errorCallback() {
    });
  };


  //stopTask
  $scope.stopTask = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/stop',
      data: {name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      //console.log(response['data'][0]['Name']);
    }, function errorCallback() {
    });
  };


  //removeTask
  $scope.removeTask = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/remove',
      data: {name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      //console.log(response['data'][0]['Name']);
    }, function errorCallback() {
    });
  };


});




