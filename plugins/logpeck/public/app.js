import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template1 from './templates/index.html';
import template2 from './templates/addTask.html';
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
  .when('/updateTask', {
    template : template4,
    controller : 'logpeckInit',
  });

var task_ip_exist=false;
var update_ip_exit=false;
var task_ip=[];
var update_ip=[];
var status=[];
var app=uiModules.get('app/logpeck', [])
app.controller('logpeckInit',function ($scope ,$rootScope,$route, $http, $interval) {
  $scope.mycolor1={"color":"#e4e4e4"};
  $scope.mycolor2={"color":"#e4e4e4"};
  $scope.mycolor3={"color":"#e4e4e4"};
  $scope.mycolor4={"color":"#e4e4e4"};
  $scope.mycolor5={"color":"#e4e4e4"};
  $scope.mycolor6={"color":"#e4e4e4"};

  $scope.set_color = function (payment) {
      return { color: status[payment] }
  }

  //refresh
  var timer = $interval(function(){
    //list host
    var t=[];
    var version=[];
    $http({
      method: 'POST',
      url: '../api/logpeck/init',
    }).then(function successCallback(response1) {
      for (var id = 0 ; id<response1['data']['hits']['total'] ; id++) {
        var host=response1['data']['hits']['hits'][id]['_id'];
        //list status
        $http({
          method: 'POST',
          url: '../api/logpeck/refresh',
          data: {ip: response1['data']['hits']['hits'][id]['_id'],status:response1['data']['hits']['hits'][id]['_source']['exist']},
        }).then(function successCallback(response2) {
          console.log(response2['data']);
          version[response2['data']['ip']]=response2['data']['version'];
          if(response2['data']['code']==502){
            t[response2['data']['ip']]="red";
          } else{
            t[response2['data']['ip']]="#2f99c1";
          }
        }, function errorCallback(err) {
          console.log('err2');
        });
      }
      status=t;
    }, function errorCallback(err) {
      console.log('err1');
    });
  },10000);
  $scope.$on('$destroy',function(){
    $interval.cancel(timer);
  });

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

    $scope.contents=[];

    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
      //new_arr.push(response['data']['hits']['hits'][id]['_id']);
      $scope.T_IpList.push(response['data']['hits']['hits'][id]['_id']);
      if(response['data']['hits']['hits'][id]['_source']['exist']=="true"){
        status[response['data']['hits']['hits'][id]['_id']]="#2f99c1";
      }else{
        status[response['data']['hits']['hits'][id]['_id']]="red";
      }
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
    $scope.testArea=false;

  }, function errorCallback() {
    console.log('err');
  });


  $http({
    method: 'POST',
    url: '../api/logpeck/list_template',
  }).then(function successCallback(response) {
    $scope.TemplateList=[];
    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
      //new_arr.push(response['data']['hits']['hits'][id]['_id']);
      $scope.TemplateList.push(response['data']['hits']['hits'][id]['_id']);
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
    //$scope.llength+=26;
    //var t=$scope.llength+'px';
    //$scope.divlength={"height":t}
    //console.log($scope.fields_array);
  }

  $scope.minusfields=function () {
    $scope.fields_array.pop();
    //$scope.llength-=26;
    //var t=$scope.llength+'px';
    //$scope.divlength={"height":t}
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
      console.log(response);
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
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog =response['data'][0]['result'];
        $scope.T_array = [];
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
    if(!confirm("Remove a task")){
      return;
    }
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
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $scope.addTaskResult = "IP is not complete";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else if($scope.Name==""||$scope.LogPath==""||$scope.Hosts==""||$scope.Index==""||$scope.Type==""){
      $scope.addTaskResult = "filed is not complete";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
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
        console.log(response);
        if(response['data'][0]['result']==undefined) {
          var new_arr = [];
          if (response['data'][0]['result'] != "null") {
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
          $scope.testArea=true;
          $scope.testResults = $scope.addTaskResult;
          $scope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
        console.log('error')
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
          $scope.T_IpList.push($scope.IP);
          $scope.T_array=[];
          $scope.logstat1=false;
          $scope.logstat2=true;
          $scope.indexLog="Add success";

        }
        else{
          $scope.logstat1=true;
          $scope.logstat2=false;
          $scope.indexLog=response['data'][0]['result'];
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };

  $scope.removeHost = function ($event) {
    if(!confirm("Remove a host")){
      return;
    }
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
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $scope.addTaskResult = "IP is not complete";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else if($scope.Name==""||$scope.LogPath==""||$scope.Hosts==""||$scope.Index==""||$scope.Type==""){
      $scope.addTaskResult = "filed is not complete";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
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
          $scope.testArea=true;
          $scope.testResults = $scope.addTaskResult;
          $scope.error={"color":"#ff0000"};
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
          $scope.testArea=true;
          $scope.testResults = $scope.addTaskResult;
          $scope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
      });
  };

  $scope.addDefault=function () {
    $scope.Delimiters='":{} ,[]';
  };

  $scope.addTemplate = function () {
    $scope.addTaskResult="";
    $scope.testArea=false;
    if ($scope.template_name == ""||$scope.template_name ==undefined) {
      $scope.addTaskResult = "template is null";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else{
      var exist= false;
      for(var i=0;i<$scope.TemplateList.length;i++)
      {
        if($scope.template_name ==$scope.TemplateList[i]){
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
        url: '../api/logpeck/addTemplate',
        data: {
          template_name: $scope.template_name,
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
          $scope.TemplateList.push($scope.template_name);
          console.log($scope.TemplateList);
          $scope.addTaskResult = response['data'][0]['result'];
          $scope.template_name ="";
        }
        else{
          $scope.addTaskResult = response['data'][0]['result'];
          $scope.testArea=true;
          $scope.testResults = $scope.addTaskResult;
          $scope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };
  $scope.removeTemplate = function ($event) {
    $scope.addTaskResult="";
    $scope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/removeTemplate',
      data:{template_name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      console.log("app")
      $scope.addTaskResult ='';
      if(response['data'][0]['result'] != "err"){
        var new_arr = [];
        for (var id=0 ; id<$scope.TemplateList.length ; id++) {
          if(response['data'][0]['result']!=$scope.TemplateList[id]) {
            new_arr.push($scope.TemplateList[id]);
          }
        }
        $scope.TemplateList=new_arr;
      }
      else{
        $scope.addTaskResult=response['data'][0]['result'];
        $scope.testArea=true;
        $scope.testResults = $scope.addTaskResult;
        $scope.error={"color":"#ff0000"};
      }
    }, function errorCallback() {
    });
  };

  $scope.applyTemplate = function ($event){
    $scope.addTaskResult="";
    $scope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/applyTemplate',
      data:{template_name: event.target.getAttribute('name')},
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

  $scope.keyUp = function (){
      $http({
        method: 'POST',
        url: '../api/logpeck/key_up',
        data: {path: $scope.LogPath,
          ip: $rootScope.T_ip,
        },
      }).then(function successCallback(response) {
        $scope.path_array=[];
        if(response['data']=="null"||response['data']=='open '+$scope.LogPath+'/: no such file or directory'){
          $scope.path_array=[];
        }
        else {
          for (var id=0;id<response['data'].length;id++){
            $scope.path_array.push(response['data'][id]);
          }
        }
      }, function errorCallback() {
      });
  };

  $scope.optionChange = function(){
    $scope.keyUp();
  };

  $scope.testTask = function () {
    $scope.addTaskResult="";
    $scope.testArea=true;
    $scope.TestNum=10;
    $scope.Time=2;
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
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $scope.addTaskResult = "IP is not complete";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else if($scope.Name==""||$scope.LogPath==""||$scope.Hosts==""||$scope.Index==""||$scope.Type==""){
      $scope.addTaskResult = "filed is not complete";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else {
      $http({
        method: 'POST',
        url: '../api/logpeck/testTask',
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
          TestNum: $scope.TestNum,
          Timeout:    $scope.Time,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data'][0]['result']==undefined) {
          var obj = angular.fromJson(response['data'])
          $scope.testResults=JSON.stringify(obj,null,4);
          $scope.error={"color":"#2d2d2d"};
        }
        else {
          $scope.addTaskResult =response['data'][0]['result'];
          $scope.testArea=true;
          $scope.testResults = $scope.addTaskResult;
          $scope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };
});







