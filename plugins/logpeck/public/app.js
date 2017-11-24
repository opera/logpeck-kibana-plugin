import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template1 from './templates/index.html';
import template2 from './templates/addTask.html';
import template3 from './templates/addHost.html';
import template4 from './templates/updateTask.html';


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
  })
  .when('/updateTask', {
    template : template4,
    controller : 'logpeckInit',
  });

var host_ip="";
var task_ip_exist=false;
var update_ip_exit=false;
var task_ip=[];
var update_ip=[];
uiModules
.get('app/logpeck', [])
.controller('logpeckInit',function ($scope ,$rootScope,$route, $http) {
  $scope.mycolor1={"color":"#e4e4e4"};
  $scope.mycolor2={"color":"#e4e4e4"};
  $scope.mycolor3={"color":"#e4e4e4"};
  $scope.mycolor4={"color":"#e4e4e4"};
  $scope.mycolor5={"color":"#e4e4e4"};
  $scope.mycolor6={"color":"#e4e4e4"};

  //初始化
  $http({
    method: 'POST',
    url: '../api/logpeck/init',
  }).then(function successCallback(response) {
    $scope.llength=640;
    var new_arr = [];
    $scope.T_IpList=[];
    var t=$scope.llength+'px';
    $scope.divlength={"height":t};
    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
      //new_arr.push(response['data']['hits']['hits'][id]['_id']);
      $scope.T_IpList.push(response['data']['hits']['hits'][id]['_id']);
    }
    if(host_ip!=""){
      //new_arr.push(host_ip);
      $scope.T_IpList.push(host_ip);
      host_ip="";
    }
    if(task_ip_exist!=false){
      $scope.T_array=task_ip;
      $scope.visible=true;
      task_ip_exist=false;
      task_ip=[];
    }
    else {
      $scope.T_array = [];            //index:   tasklist
      $scope.visible = false;
    }
    if(update_ip_exit!=false){
      $scope.Name=update_ip['data']['Name'];
      $scope.LogPath=update_ip['data']['LogPath'];
      $scope.Hosts=update_ip['data']['ESConfig']['Hosts'].toString();
      $scope.Index=update_ip['data']['ESConfig']['Index'];
      $scope.Type=update_ip['data']['ESConfig']['Type'];
      $scope.Mapping=JSON.stringify(update_ip['data']['ESConfig']['Mapping'],null,4);
      if($scope.Mapping=='null'){
        $scope.Mapping="";
      }
      $scope.fields_array=update_ip['data']['Fields'];
      $scope.Delimiters=update_ip['data']['Delimiters'];
      $scope.FilterExpr=update_ip['data']['FilterExpr'];
      $scope.LogFormat=update_ip['data']['LogFormat'];
      update_ip_exit=false;
      if($scope.fields_array==null){
        $scope.fields_array=[];
      }
    }
    else {
      $scope.Name = "TestLog";
      $scope.LogPath = "test.log";
      $scope.Hosts = "127.0.0.1:9200";
      $scope.Index = "my_index-%{+2006.01.02}";
      $scope.Type = "MyType";
      $scope.Mapping = JSON.stringify(JSON.parse('{"MyType":{"properties": {"MyField": {"type": "long"}}}}'), null, 4);
      $scope.fields_array=[];
      $scope.Delimiters = "";
      $scope.FilterExpr = "";
      $scope.LogFormat = "json";
    }

    $scope.IP="127.0.0.1:7117";                //addhost:   input IP
    $scope.logstat1=true;
    $scope.logstat2=false;

  }, function errorCallback() {
    console.log('err');
  });


  $http({
    method: 'POST',
    url: '../api/logpeck/list_model',
  }).then(function successCallback(response) {
    $scope.ModelList=[];
    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
      //new_arr.push(response['data']['hits']['hits'][id]['_id']);
      $scope.ModelList.push(response['data']['hits']['hits'][id]['_id']);
    }
  }, function errorCallback(err) {
    console.log('err');
  });


  $scope.focus = function (string,target,mycolor) {
    if ($scope[target]) {
      $scope[mycolor]={"color":"#2d2d2d"};
    }
    else{
      $scope[mycolor]={"color":"#2d2d2d"};
    }
  }
  $scope.blur = function (string,target,mycolor) {
    if (!$scope[target] ) {
      $scope[target] = string;
      $scope[mycolor]={"color":"#e4e4e4"};
    }
    else{
      $scope[mycolor]={"color":"#2d2d2d"};
    }
  }
  $scope.focus3 = function (target,mycolor) {
    if ($scope[target]) {
      $scope[mycolor]={"color":"#2d2d2d"};
    }
    else{
      $scope[mycolor]={"color":"#2d2d2d"};
    }
  }
  $scope.blur3 = function (target,mycolor) {
    if (!$scope[target] ) {
      $scope[target] = "";
      $scope[mycolor]={"color":"#e4e4e4"};
    }
    else{
      $scope[mycolor]={"color":"#2d2d2d"};
    }
  }


  $scope.plusfields=function () {
    $scope.fields_array.push({Name:"",Value:""});
    $scope.llength+=26;
    var t=$scope.llength+'px';
    $scope.divlength={"height":t}
    //console.log($scope.fields_array);
  }

  $scope.minusfields=function () {
    $scope.fields_array.pop();
    $scope.llength-=26;
    var t=$scope.llength+'px';
    $scope.divlength={"height":t}
    //console.log($scope.fields_array);
  }


  //list task
  $scope.listTask = function ($event) {
    $rootScope.T_ip=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result']==undefined) {
        $scope.visible = true;
        var new_arr = [];
        if (response['data'][0]['null'] != "true") {
          var name;
          var stat;
          var start;
          var logpath;
          for (var id = 0; id < response['data'].length; id++) {
            name=response['data'][id]['Name'];
            logpath=response['data'][id]['LogPath'];
            stat=response['data'][id]['Stop'];
            start=!stat;
            new_arr.push({name:name,logpath:logpath,stop:stat,start:start});
          }
        }
        $scope.T_array = new_arr;
      }
      else{
        $scope.indexLog =response['data'][0]['result'];
      }
    }, function errorCallback(err) {
      console.log('err');
    });
  };

  //startTask
  $scope.startTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/start',
      data: {name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result']!="Start Success"){
        $scope.indexLog =response['data'][0]['result'];
        $scope.logstat1=true;
        $scope.logstat2=false;
       // $scope.T_array[]
      }
      else{
        $scope.logstat1=false;
        $scope.logstat2=true;
        $scope.indexLog="Start Success";
        $scope.T_array[key]['stop']=false;
        $scope.T_array[key]['start']=true;
      }
    }, function errorCallback() {
    });
  };


  //stopTask
  $scope.stopTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/stop',
      data: {name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result']!="Stop Success"){
        $scope.indexLog =response['data'][0]['result'];
        $scope.logstat1=true;
        $scope.logstat2=false;
      }
      else{
        $scope.logstat1=false;
        $scope.logstat2=true;
        $scope.indexLog="Stop Success";
        $scope.T_array[key]['stop']=true;
        $scope.T_array[key]['start']=false;
      }
    }, function errorCallback() {
    });
  };


  //removeTask
  $scope.removeTask = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/remove',
      data: {name: event.target.getAttribute('name'),ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      $scope.visible=true;
      if(response['data'][0]['result']==undefined) {
        var new_arr = [];
        if (response['data'][0]['null'] != "true") {
          var name;
          var stat;
          var start;
          var logpath;
          for (var id = 0; id < response['data'].length; id++) {
            name=response['data'][id]['Name'];
            logpath=response['data'][id]['LogPath'];
            stat=response['data'][id]['Stop'];
            start=!stat;
            new_arr.push({name:name,logpath:logpath,stop:stat,start:start});
          }
        }
        $scope.T_array = new_arr;
      }
      else{
        $scope.indexLog =response['data'][0]['result'];
      }
    }, function errorCallback() {
    });
  };

  $scope.addTask = function () {
    var T=false;
    if($scope.fields_array==null){
      ;
    }
    else {
      for (var id = 0; id < $scope.fields_array.length; id++) {
        if ($scope.fields_array[id].Name == '' || $scope.fields_array[id].Value == '') {
          T = true;
          break;
        }
      }
    }
    if(T){
      $scope.addTaskResult = "fields is not complete";
    }
    else if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $scope.addTaskResult = "IP is not complete";
    }
    else if($scope.Name==""||$scope.LogPath==""||$scope.Hosts==""||$scope.Index==""||$scope.Type==""){
      $scope.addTaskResult = "filed is not complete";
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
          Mapping: $scope.Mapping,
          Fields: $scope.fields_array,
          Delimiters: $scope.Delimiters,
          FilterExpr: $scope.FilterExpr,
          LogFormat: $scope.LogFormat,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data'][0]['result']==undefined) {
          var new_arr = [];
          if (response['data'][0]['null'] != "true") {
            var name;
            var stat;
            var start;
            var logpath;
            for (var id = 0; id < response['data'].length; id++) {
              name=response['data'][id]['Name'];
              logpath=response['data'][id]['LogPath'];
              stat=response['data'][id]['Stop'];
              start=!stat;
              new_arr.push({name:name,logpath:logpath,stop:stat,start:start});
            }
          }
          $scope.T_array = new_arr;
          task_ip = new_arr;
          task_ip_exist = true;
          window.location.href = "#/";
        }
        else {
          $scope.addTaskResult =response['data'][0]['result'];
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };

  $scope.addHost = function () {
    if ($scope.IP == ""||$scope.IP==undefined) {
      $scope.addHostResult = "host not exist";
    }
    else{
      $http({
        method: 'POST',
        url: '../api/logpeck/addHost',
        data: {ip: $scope.IP},
      }).then(function successCallback(response) {
        if (response['data'][0]['result'] == "Add success") {
          host_ip=$scope.IP;
          $scope.addHostResult = response['data'][0]['result'];
          window.location.href="#/";
        }
        else{
          $scope.addHostResult = response['data'][0]['result'];
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };

  $scope.removeHost = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/removeHost',
      data:{ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result'] != "err"&&response['data'][0]['result']!="Ip not exist"){
        var new_arr = [];
        for (var id=0 ; id<$scope.T_IpList.length ; id++) {
          if(response['data'][0]['result']!=$scope.T_IpList[id]) {
            new_arr.push($scope.T_IpList[id]);
          }
        }
        $scope.T_IpList=new_arr;
        $scope.T_array=[];
      }
      else{
        $scope.indexLog=response['data'][0]['result'];
      }
    }, function errorCallback() {
    });
  };

  //list
  $scope.updateList= function ($event) {
    var name=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/updateList',
      data: {ip: $rootScope.T_ip,name: name},
    }).then(function successCallback(response) {
      if(response['data']['LogFormat']==""){
        response['data']['LogFormat']=="json";
      }
      update_ip=response;
      update_ip_exit=true;
      window.location.href = "#/updateTask";
    }, function errorCallback(err) {
      console.log('err');
    });
  };

  //update
  $scope.updateTask = function () {
    var T=false;
    if($scope.fields_array==null){

    }
    else {
      for (var id = 0; id < $scope.fields_array.length; id++) {
        if ($scope.fields_array[id].Name == '' || $scope.fields_array[id].Value == '') {
          T = true;
          break;
        }
      }
    }
    if(T){
      $scope.addTaskResult = "fields is not complete";
    }
    if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $scope.addTaskResult = "IP is not complete";
    }
    else if($scope.Name==""||$scope.LogPath==""||$scope.Hosts==""||$scope.Index==""||$scope.Type==""){
      $scope.addTaskResult = "filed is not complete";
    }
    else {
      $http({
        method: 'POST',
        url: '../api/logpeck/updateTask',
        data: {
          name: $scope.Name,
          logpath: $scope.LogPath,
          hosts: $scope.Hosts,
          index: $scope.Index,
          type: $scope.Type,
          Mapping: $scope.Mapping,
          Fields: $scope.fields_array,
          Delimiters: $scope.Delimiters,
          FilterExpr: $scope.FilterExpr,
          LogFormat: $scope.LogFormat,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data'][0]['result']==undefined) {
          var new_arr = [];
          if (response['data'][0]['null'] != "true") {
            var name;
            var stat;
            var start;
            var logpath;
            for (var id = 0; id < response['data'].length; id++) {
              name=response['data'][id]['Name'];
              logpath=response['data'][id]['LogPath'];
              stat=response['data'][id]['Stop'];
              start=!stat;
              new_arr.push({name:name,logpath:logpath,stop:stat,start:start});
            }
          }
          //$scope.T_array = new_arr;
          task_ip = new_arr;
          task_ip_exist = true;
          window.location.href = "#/";
        }
        else {
          $scope.addTaskResult =response['data'][0]['result'];
        }
      }, function errorCallback() {
      });
    }
  };


  $scope.jump = function () {
      $http({
        method: 'POST',
        url: '../api/logpeck/jump',
        data: {
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data'][0]['result']==undefined) {
          var new_arr = [];
          if (response['data'][0]['null'] != "true") {
            var name;
            var stat;
            var start;
            var logpath;
            for (var id = 0; id < response['data'].length; id++) {
              name=response['data'][id]['Name'];
              logpath=response['data'][id]['LogPath'];
              stat=response['data'][id]['Stop'];
              start=!stat;
              new_arr.push({name:name,logpath:logpath,stop:stat,start:start});
            }
          }
          //$scope.T_array = new_arr;
          task_ip = new_arr;
          task_ip_exist = true;
          window.location.href = "#/";
        }
        else {
          $scope.addTaskResult =response['data'][0]['result'];
        }
      }, function errorCallback() {
      });
  };

  $scope.addDefault=function () {
    $scope.Delimiters='":{} ,[]';
  };

  $scope.addModel = function () {
    if ($scope.model_name == ""||$scope.model_name ==undefined) {
      $scope.addTaskResult = "model is null";
    }
    else{
      var exist= false;
      for(var i=0;i<$scope.ModelList.length;i++)
      {
        if($scope.model_name ==$scope.ModelList[i]){
          exist=true;
        }
      }
      if(exist==true)
      {
        if(!confirm("Confirm coverage")){
          return;
        }
      }
      $http({
        method: 'POST',
        url: '../api/logpeck/addModel',
        data: {
          model_name: $scope.model_name,
          name: $scope.Name,
          logpath: $scope.LogPath,
          hosts: $scope.Hosts,
          index: $scope.Index,
          type: $scope.Type,
          Mapping: $scope.Mapping,
          Fields: $scope.fields_array,
          Delimiters: $scope.Delimiters,
          FilterExpr: $scope.FilterExpr,
          LogFormat: $scope.LogFormat,
        },
      }).then(function successCallback(response) {
        if (response['data'][0]['result'] == "Add success") {
          $scope.ModelList.push($scope.model_name);
          console.log($scope.ModelList);
          $scope.addTaskResult = response['data'][0]['result'];
          $scope.model_name ="";
        }
        else{
          $scope.addTaskResult = response['data'][0]['result'];
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };
  $scope.removeModel = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/removeModel',
      data:{model: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      console.log("app")
      $scope.addTaskResult ='';
      if(response['data'][0]['result'] != "err"){
        var new_arr = [];
        for (var id=0 ; id<$scope.ModelList.length ; id++) {
          if(response['data'][0]['result']!=$scope.ModelList[id]) {
            new_arr.push($scope.ModelList[id]);
          }
        }
        $scope.ModelList=new_arr;
      }
      else{
        $scope.addTaskResult=response['data'][0]['result'];
      }
    }, function errorCallback() {
    });
  };

  $scope.applyModel = function ($event){
    $http({
      method: 'POST',
      url: '../api/logpeck/apply_model',
      data:{model: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      console.log(response['data']['_source'])
      $scope.Name=response['data']['_source']['Name'];
      $scope.LogPath=response['data']['_source']['LogPath'];
      $scope.Hosts=response['data']['_source']['ESConfig']['Hosts'].toString();
      $scope.Index=response['data']['_source']['ESConfig']['Index'];
      $scope.Type=response['data']['_source']['ESConfig']['Type'];
      $scope.Mapping=JSON.stringify(response['data']['_source']['ESConfig']['Mapping'],null,4);
      if($scope.Mapping=='null'){
        $scope.Mapping="";
      }
      $scope.fields_array=response['data']['_source']['Fields'];
      $scope.Delimiters=response['data']['_source']['Delimiters'];
      $scope.FilterExpr=response['data']['_source']['FilterExpr'];
      $scope.LogFormat=response['data']['_source']['LogFormat'];
    }, function errorCallback() {
    });
  };

})






