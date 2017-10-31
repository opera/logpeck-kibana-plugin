import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template1 from './templates/index.html';
import template2 from './templates/addTask.html';
import template3 from './templates/addHost.html';

uiRoutes.enable();
uiRoutes
  .when('/', {
    template : template1,
    controller : 'logpeckInit',
  })
  .when('/addTask', {
    template : template2,
    controller : 'logpeckInit',
  })
  .when('/addHost', {
    template : template3,
    controller : 'logpeckInit',
  });
var G_ip='';
uiModules
.get('app/logpeck', [])
.controller('logpeckInit',function ($scope ,$rootScope, $http,) {
  //初始化
  $http({
    method: 'POST',
    url: '../api/logpeck/init',
    //data: {ip:G_ip},
  }).then(function successCallback(response) {
    //console.log(response['data']['hits']['hits'][0]['_source']['ip']);
    //console.log(response['data']['hits']['total']);
    var new_arr = [];
    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
      new_arr.push(response['data']['hits']['hits'][id]['_source']['ip']);
    }
    $scope.T_Name=[];
    $rootScope.T_IpList=new_arr;
    $scope.T_ip=G_ip;
    $scope.IP='';
    $scope.visible=false;
    //console.log($rootScope.G_ip);
  }, function errorCallback() {
  });


  //list task
  $scope.listTask = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      $scope.T_ip=response.config.data.ip;
      G_ip=response.config.data.ip;
      $scope.visible=true;
      var new_arr = [];
      console.log(response);
      if(response['data'][0]['null']!="true"){
        for(var id = 0 ; id < response['data'].length; id++) {
          new_arr.push(response['data'][id]['Name']);
        }
      }
      $scope.T_Name = new_arr;
      console.log($scope.T_Name);
    }, function errorCallback(err) {
      console.log('err');
    });
  };

  //startTask
  $scope.startTask = function ($event) {
    //console.log(event.target.getAttribute('name'));
    $http({
      method: 'POST',
      url: '../api/logpeck/start',
      data: {name: event.target.getAttribute('name'),ip: $scope.T_ip},
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
      data: {name: event.target.getAttribute('name'),ip: $scope.T_ip},
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
      data: {name: event.target.getAttribute('name'),ip: $scope.T_ip},
    }).then(function successCallback(response) {
      $scope.visible=true;
      var new_arr = [];
      if(response['data'][0]['null']!="true") {
        for (var id = 0; id < response['data'].length; id++) {
          new_arr.push(response['data'][id]['Name']);
        }
      }
      $scope.T_Name=new_arr;
    }, function errorCallback() {
      $scope.T_Name=[];
    });
  };

  $scope.addTask = function () {
    if ($scope.T_ip == '') {
      $scope.addTaskResult = "IP未选定";
    }
    else {
      $http({
        method: 'POST',
        url: '../api/logpeck/addTask',
        data: {
          name: $scope.Name,
          logpath: $scope.LogPath,
          hosts: $scope.Hosts,
          index: $scope.Index,
          type: $scope.Type,
          ip: $scope.T_ip
        },
      }).then(function successCallback(response) {
        console.log(response);
        if(response['data'][0]['result'] == "success"){
          $scope.addTaskResult = "ADD SUCCESS";
        }
        if(response['data'][0]['result'] == "null"){
          $scope.addTaskResult = "字段不能为空";
        }
      }, function errorCallback() {
      });
    }
  };

  $scope.addHost = function () {
    /*if ($scope.IP){

    }*/
    $http({
      method: 'POST',
      url: '../api/logpeck/addHost',
      data: {ip: $scope.IP},
    }).then(function successCallback(response) {
      //console.log(response);
      if(response['data'][0]['result'] == "success"){
        var new_arr = [];
        for (var id=0 ; id<$rootScope.T_IpList.length ; id++) {
            new_arr.push($rootScope.T_IpList[id]);
        }
        new_arr.push($scope.IP);
        $rootScope.T_IpList=new_arr;
        console.log($rootScope.T_IpList);
        $scope.visible=false;
        $scope.addHostResult = "ADD SUCCESS";
      }
      if(response['data'][0]['result'] == "exist") {
        $scope.addHostResult = "already exist";
      }
      if(response['data'][0]['result'] == "err") {
        $scope.addHostResult = "add err";
      }
    }, function errorCallback() {
    });
  };

  $scope.removeHost = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/removeHost',
      data:{ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      console.log(response);
      var new_arr = [];
      if(response['data'][0]['result'] != "err"){
        for (var id=0 ; id<$rootScope.T_IpList.length ; id++) {
          if(response['data'][0]['result']!=$rootScope.T_IpList[id]) {
            new_arr.push($rootScope.T_IpList[id]);
          }
        }
        $scope.T_Name=[];
        $rootScope.T_IpList=new_arr;
        $scope.visible=false;
      }
    }, function errorCallback() {
    });
  };

});






