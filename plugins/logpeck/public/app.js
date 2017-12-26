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
  $scope.mycolor7={"color":"#e4e4e4"};
  $scope.mycolor8={"color":"#e4e4e4"};
  $scope.mycolor9={"color":"#e4e4e4"};

  $scope.set_color = function (payment) {
      return { color: status[payment] }

  }

  //refresh
  var timer = $interval(function(){
    var t = [];

    $http({
      method: 'POST',
      url: '../api/logpeck/refresh',
    }).then(function successCallback(response2) {

    }, function errorCallback(err) {
      console.log('err2');
    });

    $http({
      method: 'POST',
      url: '../api/logpeck/init',
    }).then(function successCallback(response) {
      console.log("*******",response['data']['hits']['hits'])
      for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
        if(response['data']['hits']['hits'][id]['_source']['exist']=="true"){
          t[response['data']['hits']['hits'][id]['_id']]="#2f99c1";
        }else{
          t[response['data']['hits']['hits'][id]['_id']]="red";
        }
      }
    }, function errorCallback(err) {
      console.log('err1');
    });


    status = t;
  },1,1);
  $scope.$on('$destroy',function(){
    $interval.cancel(timer);
  });

  //初始化
  $http({
    method: 'POST',
    url: '../api/logpeck/init',
  }).then(function successCallback(response) {
    $scope.select_all=[];

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
      $scope.ConfigName=update_ip['data']['SenderConfig']['SenderName'];
      if($scope.ConfigName=="ElasticSearchConfig")
      {
        $scope.elasticsearch=true;
        $scope.influxdb=false;

        $scope.influxHosts = "127.0.0.1:8086";
        $scope.influxInterval = 30;
        $scope.influxFieldsKey = "FieldsKey";
        $scope.influxDBName = "DBname";
        $scope.influxdb_array=[];

        $scope.esHosts=update_ip['data']['SenderConfig']['Config']['Hosts'].toString();
        $scope.esIndex=update_ip['data']['SenderConfig']['Config']['Index'];
        $scope.esType=update_ip['data']['SenderConfig']['Config']['Type'];
        $scope.esMapping=JSON.stringify(update_ip['data']['SenderConfig']['Config']['Mapping'],null,4);
        if($scope.esMapping=='null'){
          $scope.esMapping="";
        }
      }else if($scope.ConfigName=="InfluxDbConfig") {
        $scope.elasticsearch=false;
        $scope.influxdb=true;

        $scope.esHosts = "127.0.0.1:9200";
        $scope.esIndex = "my_index-%{+2006.01.02}";
        $scope.esType = "MyType";
        $scope.esMapping = JSON.stringify(JSON.parse('{"MyType":{"properties": {"MyField": {"type": "long"}}}}'), null, 4);

        $scope.influxHosts = update_ip['data']['SenderConfig']['Config']['Hosts'].toString();
        $scope.influxInterval = update_ip['data']['SenderConfig']['Config']['Interval'];
        $scope.influxFieldsKey = update_ip['data']['SenderConfig']['Config']['FieldsKey'];
        $scope.influxDBName = update_ip['data']['SenderConfig']['Config']['DBName'];
        $scope.influxdb_array=[];
        var tmp=update_ip['data']['SenderConfig']['Config']['Aggregators'];
        for (var key in tmp) {
          var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false};
          for(var key2 in tmp[key]["Aggregations"]){
            Aggregations[tmp[key]["Aggregations"][key2]]=true;
          }
          console.log(Aggregations);
          $scope.influxdb_array.push({measurment:key,value:{"PreFields":tmp[key]["PreFields"],"Target":tmp[key]["Target"],"Aggregations":Aggregations,"Tags":tmp[key]["Tags"],"Timestamp":tmp[key]["Timestamp"]}});
        }
        console.log($scope.influxdb_array);
      }
      $scope.fields_array=update_ip['data']['Fields'];
      $scope.Delimiters=update_ip['data']['Delimiters'];
      $scope.Keywords=update_ip['data']['Keywords'];
      $scope.LogFormat=update_ip['data']['LogFormat'];
      if($scope.LogFormat=="text"){
        $scope.type=true;
      }else if($scope.LogFormat=="json"){
        $scope.type=false;
      }
      update_ip_exit=false;
      if($scope.fields_array==null){
        $scope.fields_array=[];
      }
    }
    else {
      $scope.Name = "TestLog";
      $scope.LogPath = "test.log";
      $scope.ConfigName = "ElasticSearchConfig";

      $scope.esHosts = "127.0.0.1:9200";
      $scope.esIndex = "my_index-%{+2006.01.02}";
      $scope.esType = "MyType";
      $scope.esMapping = JSON.stringify(JSON.parse('{"MyType":{"properties": {"MyField": {"type": "long"}}}}'), null, 4);

      $scope.influxHosts = "127.0.0.1:8086";
      $scope.influxInterval = 30;
      $scope.influxFieldsKey = "FieldsKey";
      $scope.influxDBName = "DBname";
      $scope.influxdb_array=[];

      $scope.fields_array=[];
      $scope.Delimiters = "";
      $scope.Keywords = "";
      $scope.LogFormat = "text";
      $scope.elasticsearch=true;
      $scope.influxdb=false;
      $scope.type=true;
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

  $scope.selectOne=function(string,key){
    console.log(string);
    console.log(key);
    if($scope.influxdb_array[key]['value']['Aggregations'][string]==false){
      $scope.influxdb_array[key]['value']['Aggregations'][string]=true;
    }else{
      $scope.influxdb_array[key]['value']['Aggregations'][string]=false;
    }
  }

  $scope.selectAll=function(key){
    if($scope.select_all.hasOwnProperty(key)==false||$scope.select_all[key]==false){
        $scope.select_all[key]=true;
        $scope.influxdb_array[key]['value']['Aggregations']={"cnt":true,"sum":true,"avg":true,"p99":true,"p90":true,"p50":true};
      }else{
        $scope.select_all[key]=false;
        $scope.influxdb_array[key]['value']['Aggregations']={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false};
      }
  }

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

  $scope.plusTags=function (key) {
    $scope.influxdb_array[key]['value']['Tags'].push("");
    console.log($scope.influxdb_array[key]['value']['Tags']);
  }
  $scope.minusTags=function (key) {
    $scope.influxdb_array[key].value.Tags.pop();
  }

  $scope.plusinfluxdb=function () {
    $scope.influxdb_array.push({measurment:"",value:{"PreFields":"","Target":"","Aggregations":{"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false},"Tags":[],"Timestamp":""}});
  }
  $scope.minusinfluxdb=function () {
    $scope.influxdb_array.pop();
  }

  $scope.plusfields=function () {
    $scope.fields_array.push({Name:"",Value:""});

  }
  $scope.minusfields=function (idx) {
    $scope.fields_array.splice(idx,1);
  }


  $scope.optionChange = function(){
    $scope.keyUp();
  };

  $scope.configChange = function(configName){
    console.log(configName);
    if(configName=="ElasticSearchConfig"){
      $scope.elasticsearch=true;
      $scope.influxdb=false;
    }
    if(configName=="InfluxDbConfig"){
      $scope.elasticsearch=false;
      $scope.influxdb=true;
    }
  }
  $scope.typeChange= function(type) {
    if(type=="text"){
      $scope.type=true;
    }else if(type=="json"){
      $scope.type=false;
    }
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
      data: {Name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
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
      data: {Name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
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
      data: {Name: event.target.getAttribute('name'),ip: $rootScope.T_ip},
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
    console.log($scope.ConfigName);
    var T=false;
    var influxaggregations={};
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
    if($scope.influxdb_array==null){
      ;
    }
    else {
      for (var i=0;i<$scope.influxdb_array.length;i++) {
        if ($scope.influxdb_array[i].measurment == ''||$scope.influxdb_array[i].value.Target==''||$scope.influxdb_array[i].value.Aggregations==''||$scope.influxdb_array[i].value.Timestamp=='') {
          T = true;
          break;
        }

        var tmp=[];
        for(var key2 in $scope.influxdb_array[i].value.Aggregations){
          console.log(key2);
          console.log($scope.influxdb_array[i].value.Aggregations[key2]);
          if($scope.influxdb_array[i].value.Aggregations[key2]==true){
            tmp.push(key2);
          }
        }
        console.log(tmp);
        $scope.influxdb_array[i].value.Aggregations=tmp;
        influxaggregations[$scope.influxdb_array[i].measurment]=$scope.influxdb_array[i].value;
        console.log(influxaggregations);
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
    else if($scope.Name==""||$scope.LogPath==""||$scope.esHosts==""||$scope.esIndex==""||$scope.esType==""){
      $scope.addTaskResult = "filed is not complete";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else {
      if($scope.ConfigName=="ElasticSearchConfig"){
        $scope.Sender={Hosts: $scope.esHosts, Index: $scope.esIndex, Type: $scope.esType, Mapping: $scope.esMapping,}
      }else if($scope.ConfigName=="InfluxDbConfig"){
        $scope.Sender={Hosts: $scope.influxHosts, Interval: $scope.influxInterval, FieldsKey: $scope.influxFieldsKey, DBName: $scope.influxDBName,Aggregators:influxaggregations}
        console.log($scope.Sender);
      }
      $http({
        method: 'POST',
        url: '../api/logpeck/addTask',
        data: {
          Name: $scope.Name,
          Logpath: $scope.LogPath,
          ConfigName:$scope.ConfigName,
          Sender:$scope.Sender,
          Fields: $scope.fields_array,
          Delimiters: $scope.Delimiters,
          Keywords: $scope.Keywords,
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

          $http({
            method: 'POST',
            url: '../api/logpeck/version',
            data: {ip: $scope.IP},
          }).then(function successCallback(response) {
            if(response['data']=="true"){
              status[$scope.IP]="#2f99c1";
            }
            else{
              status[$scope.IP]="red";
            }
          }, function errorCallback() {
            console.log('err');
          });

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
      data: {ip: $rootScope.T_ip,Name: name},
    }).then(function successCallback(response) {
      if(response['data']['LogFormat']==""){
        response['data']['LogFormat']=="json";
      }
      console.log("updateList------",response)
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
    var influxaggregations={}
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
    if($scope.influxdb_array==null){
      ;
    }
    else {
      for (var i=0;i<$scope.influxdb_array.length;i++) {
        if ($scope.influxdb_array[i].measurment == ''||$scope.influxdb_array[i].value.Target==''||$scope.influxdb_array[i].value.Aggregations==''||$scope.influxdb_array[i].value.Timestamp=='') {
          T = true;
          break;
        }
        var tmp=[];
        for(var key2 in $scope.influxdb_array[i].value.Aggregations){
          if($scope.influxdb_array[i].value.Aggregations[key2]==true){
            tmp.push(key2);
          }
        }
        $scope.influxdb_array[i].value.Aggregations=tmp;
        influxaggregations[$scope.influxdb_array[i].measurment]=$scope.influxdb_array[i].value;
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
    else if($scope.Name==""||$scope.LogPath==""||$scope.esHosts==""||$scope.esIndex==""||$scope.esType==""){
      $scope.addTaskResult = "filed is not complete";
      $scope.testArea=true;
      $scope.testResults = $scope.addTaskResult;
      $scope.error={"color":"#ff0000"};
    }
    else {
      if($scope.ConfigName=="ElasticSearchConfig"){
        $scope.Sender={Hosts: $scope.esHosts, Index: $scope.esIndex, Type: $scope.esType, Mapping: $scope.esMapping,}
      }else if($scope.ConfigName=="InfluxDbConfig"){
        $scope.Sender={Hosts: $scope.influxHosts, Interval: $scope.influxInterval, FieldsKey: $scope.influxFieldsKey, DBName: $scope.influxDBName,Aggregators:influxaggregations}
        console.log($scope.Sender);
      }
      $http({
        method: 'POST',
        url: '../api/logpeck/updateTask',
        data: {
          Name: $scope.Name,
          Logpath: $scope.LogPath,
          ConfigName:$scope.ConfigName,
          Sender: $scope.Sender,
          Fields: $scope.fields_array,
          Delimiters: $scope.Delimiters,
          Keywords: $scope.Keywords,
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
      if($scope.ConfigName=="ElasticSearchConfig"){
        $scope.Sender={Hosts: $scope.esHosts, Index: $scope.esIndex, Type: $scope.esType, Mapping: $scope.esMapping,}
      }else if($scope.ConfigName=="InfluxDbConfig"){
        $scope.Sender={Hosts: $scope.influxHosts, Interval: $scope.influxInterval, FieldsKey: $scope.influxFieldsKey, DBName: $scope.influxDBName,Aggregators:$scope.influxdb_array}
      }
      $http({
        method: 'POST',
        url: '../api/logpeck/addTemplate',
        data: {
          template_name: $scope.template_name,
          Name: $scope.Name,
          Logpath: $scope.LogPath,
          ConfigName:$scope.ConfigName,
          Sender: $scope.Sender,
          Fields: $scope.fields_array,
          Delimiters: $scope.Delimiters,
          Keywords: $scope.Keywords,
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
      $scope.ConfigName=response['data']['_source']['SenderConfig']['SenderName']

      console.log();
      if($scope.ConfigName=="ElasticSearchConfig")
      {
        $scope.elasticsearch=true;
        $scope.influxdb=false;

        $scope.influxHosts = "127.0.0.1:8086";
        $scope.influxInterval = 30;
        $scope.influxFieldsKey = "FieldsKey";
        $scope.influxDBName = "DBname";
        $scope.influxdb_array=[];

        $scope.esHosts=response['data']['_source']['SenderConfig']['Config']['Hosts'].toString();
        $scope.esIndex=response['data']['_source']['SenderConfig']['Config']['Index'];
        $scope.esType=response['data']['_source']['SenderConfig']['Config']['Type'];
        $scope.esMapping=JSON.stringify(response['data']['_source']['SenderConfig']['Config']['Mapping'],null,4);
        if($scope.esMapping=='null'){
          $scope.esMapping="";
        }
      }else if($scope.ConfigName=="InfluxDbConfig") {
        $scope.elasticsearch=false;
        $scope.influxdb=true;

        $scope.esHosts = "127.0.0.1:9200";
        $scope.esIndex = "my_index-%{+2006.01.02}";
        $scope.esType = "MyType";
        $scope.esMapping = JSON.stringify(JSON.parse('{"MyType":{"properties": {"MyField": {"type": "long"}}}}'), null, 4);


        $scope.influxHosts = response['data']['_source']['SenderConfig']['Config']['Hosts'].toString();
        $scope.influxInterval = response['data']['_source']['SenderConfig']['Config']['Interval'];
        $scope.influxFieldsKey = response['data']['_source']['SenderConfig']['Config']['FieldsKey'];
        $scope.influxDBName = response['data']['_source']['SenderConfig']['Config']['DBName'];
        $scope.influxdb_array=response['data']['_source']['SenderConfig']['Config']['Aggregators'];
      }
      $scope.fields_array=response['data']['_source']['Fields'];
      $scope.Delimiters=response['data']['_source']['Delimiters'];
      $scope.Keywords=response['data']['_source']['Keywords'];
      $scope.LogFormat=response['data']['_source']['LogFormat'];
      if($scope.LogFormat=="text"){
        $scope.type=true;
      }else if($scope.LogFormat=="json"){
        $scope.type=false;
      }
    }, function errorCallback() {
    });
  };

  $scope.keyUp = function (){
      $http({
        method: 'POST',
        url: '../api/logpeck/key_up',
        data: {LogPath: $scope.LogPath,
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
    else if($scope.Name==""||$scope.LogPath==""){
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
          Name: $scope.Name,
          Logpath: $scope.LogPath,
          ConfigName:$scope.ConfigName,
          Fields: $scope.fields_array,
          Delimiters: $scope.Delimiters,
          Keywords: $scope.Keywords,
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







