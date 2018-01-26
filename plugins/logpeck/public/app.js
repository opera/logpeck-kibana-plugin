import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import '../bower_components/ace-builds/src-min-noconflict/ace.js';
import '../bower_components/ace-builds/src-min-noconflict/mode-lua.js';
import '../bower_components/ace-builds/src-min-noconflict/theme-chrome.js';
import '../bower_components/angular-ui-ace/ui-ace.js';
import './less/main.less';
import index from './templates/index.html';
import addTask from './templates/addTask.html';
import updateTask from './templates/updateTask.html';

uiRoutes.enable();
uiRoutes
  .when('/', {
    template : index,
    controller : 'logpeckInit',
  })
  .when('/addTask', {
    template : addTask,
    controller : 'logpeckAdd',
  })
  .when('/updateTask', {
    template : updateTask,
    controller : 'logpeckUpdate',
  });

var task_ip_exist=false;
var task_ip=[];
var status=[];
var app=uiModules.get("app",['ui.ace']);


//**************************controller "logpeckInit"****************************
app.controller('logpeckInit',function ($scope ,$rootScope,$route, $http, $interval) {
  $rootScope.mycolor1={"color":"#e4e4e4"};
  $rootScope.mycolor2={"color":"#e4e4e4"};
  $rootScope.mycolor3={"color":"#e4e4e4"};
  $rootScope.mycolor4={"color":"#e4e4e4"};
  $rootScope.mycolor5={"color":"#e4e4e4"};
  $rootScope.mycolor6={"color":"#e4e4e4"};
  $rootScope.mycolor7={"color":"#e4e4e4"};
  $rootScope.mycolor8={"color":"#e4e4e4"};
  $rootScope.mycolor9={"color":"#e4e4e4"};

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
  $scope.set_color = function (payment) {
    return { color: status[payment] }
  }

  //Init
  $http({
    method: 'POST',
    url: '../api/logpeck/init',
  }).then(function successCallback(response) {
    $scope.T_IpList=[];
    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
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
    $scope.IP="127.0.0.1:7117";                //addhost:   input IP
    $scope.logstat1=true;
    $scope.logstat2=false;

  }, function errorCallback() {
    console.log('err');
  });

  //Input click event
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
  $scope.focus2 = function (target,mycolor) {
    if ($scope[target]) {
      $scope[mycolor]={"color":"#2d2d2d"};
    }
    else{
      $scope[mycolor]={"color":"#2d2d2d"};
    }
  }
  $scope.blur2 = function (target,mycolor) {
    if (!$scope[target] ) {
      $scope[target] = "";
      $scope[mycolor]={"color":"#e4e4e4"};
    }
    else{
      $scope[mycolor]={"color":"#2d2d2d"};
    }
  }

  //A host task list
  $scope.listTask = function ($event,list) {
    $rootScope.T_ip=event.target.getAttribute('name');
    localStorage.setItem("T_ip",event.target.getAttribute('name'));
    $scope.indexLog ='';
    $rootScope.list(callback_listTask);
  }
  function callback_listTask(response) {
    if(response["err"]==null){
      $scope.visible = true;
      $scope.T_array=response["result"];
    }else {
      $scope.logstat1=true;
      $scope.logstat2=false;
      $scope.indexLog =response["err"];
      $scope.T_array = [];
    }
  }


  //Start Task
  $scope.startTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/start',
      data: {Name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data']['result']!="Start Success"){
        $scope.indexLog =response['data']['result'];
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


  //Stop Task
  $scope.stopTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/stop',
      data: {Name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data']['result']!="Stop Success"){
        $scope.indexLog =response['data']['result'];
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


  //Remove Task
  $scope.removeTask = function ($event,list) {
    if(!confirm("Remove a task")){
      return;
    }
    $http({
      method: 'POST',
      url: '../api/logpeck/remove',
      data: {Name: event.target.getAttribute('name'),ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      if(response['data']['result']=="Remove Success") {
        $scope.list(callback_listTask);
      }else {
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response['data']['result'];
      }
    }, function errorCallback() {
    });
  };

  //Add Host
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
        if (response['data']['result'] == "Add success") {
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
          $scope.indexLog=response['data']['result'];
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };

  //remove host
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
      if(response['data']['result'] != "err"&&response['data']['result']!="Ip not exist"){
        var new_arr = [];
        for (var id=0 ; id<$scope.T_IpList.length ; id++) {
          if(response['data']['result']!=$scope.T_IpList[id]) {
            new_arr.push($scope.T_IpList[id]);
          }
        }
        $scope.T_IpList=new_arr;
        $scope.T_array=[];
      }
      else{
        $scope.indexLog=response['data']['result'];
      }
    }, function errorCallback() {
    });
  };

  //click task link
  $scope.updateList= function ($event) {
    var name=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      if(response['data']["result"]==undefined) {
        localStorage.setItem("update_ip", angular.toJson(response['data']["configs"][name]));
        window.location.href = "#/updateTask";
      }
      else{
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog =response['data']['result'];
      }
    }, function errorCallback(err) {
      console.log('err');
      $scope.logstat1=true;
      $scope.logstat2=false;
      $scope.indexLog =err;
    });
  };

});


//************************controller "logpeckAdd"******************************
app.controller('logpeckAdd',function ($scope ,$rootScope,$route, $http, $interval) {
  //init
  $rootScope.T_ip=localStorage.getItem("T_ip");
  $rootScope.init_task();

  $http({
    method: 'POST',
    url: '../api/logpeck/list_template',
  }).then(function successCallback(response) {
    $rootScope.TemplateList=[];
    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
      $rootScope.TemplateList.push(response['data']['hits']['hits'][id]['_id']);
    }
  }, function errorCallback(err) {
    console.log('err');
  });

  //Add task
  $scope.addTask = function () {
    if($rootScope.init_add_or_update()==true){
      var config=$rootScope.get_configs()
      $http({
        method: 'POST',
        url: '../api/logpeck/addTask',
        data: {
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          ExtractorConfig: config.ExtractorConfig,
          SenderConfig: config.SenderConfig,
          AggregatorConfig: config.AggregatorConfig,
          Keywords: $rootScope.Keywords,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data']['result']=="Add Success") {
          $rootScope.list(Callback);
        }
        else {
          $rootScope.testArea=true;
          $rootScope.testResults = response['data']['result'];
          $rootScope.error={"color":"#ff0000"};
        }
      }, function errorCallback(err) {
        $rootScope.testArea=true;
        $rootScope.testResults = err;
        $rootScope.error={"color":"#ff0000"};
      });
    }
  };

  function Callback(response) {
    if(response["err"]==null){
      $scope.visible = true;
      task_ip = response["result"];
      task_ip_exist = true;
      window.location.href = "#/";
    }else {
      $rootScope.testArea=true;
      $rootScope.testResults = response["err"];
      $rootScope.error={"color":"#ff0000"};
    }
  }

});

//********************controller "logpeckUpdate"***************************
app.controller('logpeckUpdate',function ($scope ,$rootScope,$route, $http) {
  //init
  var update_ip=angular.fromJson(localStorage.getItem("update_ip"));
  $rootScope.T_ip=localStorage.getItem("T_ip");

  $rootScope.init_task();

  $rootScope.show_task(update_ip);

  $http({
    method: 'POST',
    url: '../api/logpeck/list_template',
  }).then(function successCallback(response) {
    $rootScope.TemplateList=[];
    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
      $rootScope.TemplateList.push(response['data']['hits']['hits'][id]['_id']);
    }
  }, function errorCallback(err) {
    console.log('err');
  });

  //update
  $scope.updateTask = function () {
    if($rootScope.init_add_or_update()==true){
      var config=$rootScope.get_configs()
      $http({
        method: 'POST',
        url: '../api/logpeck/updateTask',
        data: {
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          ExtractorConfig: config.ExtractorConfig,
          SenderConfig: config.SenderConfig,
          AggregatorConfig: config.AggregatorConfig,
          Keywords: $rootScope.Keywords,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data']['result']=="Update Success") {
          $rootScope.list(Callback);
        }
        else {
          $rootScope.testArea=true;
          $rootScope.testResults = response['data']['result'];
          $rootScope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
      });
    }
  };
  function Callback(response) {
    if(response["err"]==null){
      $scope.visible = true;
      task_ip = response["result"];
      task_ip_exist = true;
      window.location.href = "#/";
    }else {
      $rootScope.testArea=true;
      $rootScope.testResults = response["err"];
      $rootScope.error={"color":"#ff0000"};
    }
  }

});


//*************the share function of 'Add' and 'Update'******************

app.run(function($rootScope,$route, $http) {
  //Change configName (Elasticsearch InfluxDb Kafka)
  $rootScope.configChange = function(configName){
    if(configName=="ElasticsearchConfig"){
      $rootScope.elasticsearch=true;
      $rootScope.influxdb=false;
      $rootScope.kafka=false;
    }
    if(configName=="InfluxDbConfig"){
      $rootScope.elasticsearch=false;
      $rootScope.influxdb=true;
      $rootScope.kafka=false;
    }
    if(configName=="KafkaConfig"){
      $rootScope.elasticsearch=false;
      $rootScope.influxdb=false;
      $rootScope.kafka=true;
    }
  };

  //Change type (text json)
  $rootScope.typeChange= function(type) {
    if(type=="text"){
      $rootScope.type=true;
      $rootScope.type_lua=false;
    }else if(type=="json"){
      $rootScope.type=false;
      $rootScope.type_lua=false;
    }else if(type=="lua"){
      $rootScope.type=false;
      $rootScope.type_lua=true;
    }
  };

  //checkbox
  $rootScope.selectOne=function(string,key){
    if($rootScope.influxdb_array[key]['Aggregations'][string]==false){
      $rootScope.influxdb_array[key]['Aggregations'][string]=true;
    }else{
      $rootScope.influxdb_array[key]['Aggregations'][string]=false;
    }
  };
  $rootScope.selectAll=function(key){
    if($rootScope.select_all.hasOwnProperty(key)==false||$rootScope.select_all[key]==false){
      $rootScope.select_all[key]=true;
      $rootScope.influxdb_array[key]['Aggregations']={"cnt":true,"sum":true,"avg":true,"p99":true,"p90":true,"p50":true,"max":true,"min":true};
    }else{
      $rootScope.select_all[key]=false;
      $rootScope.influxdb_array[key]['Aggregations']={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
    }
  };

  //plus influxdb config
  $rootScope.plusinfluxdb=function () {
    $rootScope.influxdb_array.push({"PreMeasurment":"","Measurment":"_default","Target":"","Aggregations":{"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false},"Tags":[],"Timestamp":"default"});
  }
  //minus influxdb config
  $rootScope.minusinfluxdb=function (idx) {
    $rootScope.influxdb_array.splice(idx,1);
  };

  //plus influxdb tags
  $rootScope.plusTags=function (key) {
    $rootScope.influxdb_array[key]['Tags'].push("");
  };
  //minus influxdb tags
  $rootScope.minusTags=function (key) {
    $rootScope.influxdb_array[key]['Tags'].pop();
  };

  //plus fields
  $rootScope.plusfields=function () {
    $rootScope.fields_array.push({Name:"",Value:""});
  };
  //minus fields
  $rootScope.minusfields=function (idx) {
    $rootScope.fields_array.splice(idx,1);
  };

  //Input Logpath
  $rootScope.optionChange = function(){
    $rootScope.keyUp();
  };
  $rootScope.keyUp = function (){
    $http({
      method: 'POST',
      url: '../api/logpeck/key_up',
      data: {LogPath: $rootScope.LogPath,
        ip: $rootScope.T_ip,
      },
    }).then(function successCallback(response) {
      $rootScope.path_array=[];
      if(response['data']=="null"||response['data']=='open '+$rootScope.LogPath+'/: no such file or directory'){
        $rootScope.path_array=[];
      }
      else {
        for (var id=0;id<response['data'].length;id++){
          $rootScope.path_array.push(response['data'][id]);
        }
      }
    }, function errorCallback() {
    });
  };

  //Test task and return some logs
  $rootScope.testTask = function () {
    console.log($rootScope.LuaString);
    $rootScope.testArea=true;
    $rootScope.TestNum=10;
    $rootScope.Time=2;
    var T=false;
    if($rootScope.fields_array==null){
      ;
    }
    else {
      for (var id = 0; id < $rootScope.fields_array.length; id++) {
        if ($rootScope.fields_array[id].Name == '' ) {
          T = true;
          break;
        }
        if($rootScope.LogFormat=="text" && $rootScope.fields_array[id].Value == ''){
          T = true;
          break;
        }
      }
    }

    if(T){
      $rootScope.testArea=true;
      $rootScope.testResults = "fields is not complete";
      $rootScope.error={"color":"#ff0000"};
    }
    else if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $rootScope.testArea=true;
      $rootScope.testResults = "IP is not complete";
      $rootScope.error={"color":"#ff0000"};
    }
    else if($rootScope.Name==""||$rootScope.LogPath==""){
      $rootScope.testArea=true;
      $rootScope.testResults = "filed is not complete";
      $rootScope.error={"color":"#ff0000"};
    }
    else {
      var SenderConfig={SenderName:"ElasticsearchConfig",Config:{Hosts:["127.0.0.1:7117"],Name:"Test"}};
      var ExtractorConfig={};
      var AggregatorConfig={};
      if($rootScope.LogFormat=="text"){
        ExtractorConfig={Name:$rootScope.LogFormat,Config:{Delimiters: $rootScope.Delimiters,Fields:$rootScope.fields_array}};
      }else if(($rootScope.LogFormat=="json")){
        ExtractorConfig={Name:$rootScope.LogFormat,Config:{Fields:$rootScope.fields_array}};
      }else if(($rootScope.LogFormat=="lua")){
        ExtractorConfig ={Name:$rootScope.LogFormat,Config:{LuaString: $rootScope.LuaString,Fields:$rootScope.fields_array}};
      }
      var Test={TestNum:$rootScope.TestNum,Timeout:$rootScope.Time};
      $http({
        method: 'POST',
        url: '../api/logpeck/testTask',
        data: {
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          ExtractorConfig: ExtractorConfig,
          SenderConfig: SenderConfig,
          AggregatorConfig: AggregatorConfig,
          Keywords: $rootScope.Keywords,
          Test: Test,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data']['result']==undefined) {
          var obj = angular.fromJson(response['data']);
          $rootScope.testResults=JSON.stringify(response['data'],null,4);
          $rootScope.error={"color":"#2d2d2d"};
        }
        else {
          $rootScope.testArea=true;
          $rootScope.testResults = response['data']['result'];
          $rootScope.error={"color":"#ff0000"};
        }
      }, function errorCallback(err) {
        console.log('err');
      });
    }
  };

  //Add some template
  $rootScope.addTemplate = function () {
    $rootScope.testArea=false;
    if ($rootScope.template_name == ""||$rootScope.template_name ==undefined) {
      $rootScope.testArea=true;
      $rootScope.testResults = "template is null";
      $rootScope.error={"color":"#ff0000"};
    }
    else{
      var exist= false;
      for(var i=0;i<$rootScope.TemplateList.length;i++)
      {
        if($rootScope.template_name ==$rootScope.TemplateList[i]){
          exist=true;
        }
      }
      if(exist==true)
      {
        if(!confirm("Confirm coverage")){
          return;
        }
      }

      var config=$rootScope.get_configs();

      $http({
        method: 'POST',
        url: '../api/logpeck/addTemplate',
        data: {
          template_name: $rootScope.template_name,
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          ExtractorConfig: config.ExtractorConfig,
          SenderConfig: config.SenderConfig,
          AggregatorConfig: config.AggregatorConfig,
          Keywords: $rootScope.Keywords,
        },
      }).then(function successCallback(response) {
        if (response['data']['result'] == "Add success") {
          $rootScope.TemplateList.push($rootScope.template_name);
          $rootScope.testResults = response['data']['result'];
          $rootScope.template_name ="";
        }
        else{
          $rootScope.testArea=true;
          $rootScope.testResults = response['data']['result'];
          $rootScope.error={"color":"#ff0000"};
        }
        for(var key in $rootScope.influxdb_array)
        {
          var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
          for(var key2 in $rootScope.influxdb_array[key]["Aggregations"]){
            Aggregations[$rootScope.influxdb_array[key]["Aggregations"][key2]]=true;
          }
          $rootScope.influxdb_array[key]["Aggregations"]=Aggregations;
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };
  $rootScope.removeTemplate = function ($event) {
    $rootScope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/removeTemplate',
      data:{template_name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      if(response['data']['result'] != "err"){
        var new_arr = [];
        for (var id=0 ; id<$rootScope.TemplateList.length ; id++) {
          if(response['data']['result']!=$rootScope.TemplateList[id]) {
            new_arr.push($rootScope.TemplateList[id]);
          }
        }
        $rootScope.TemplateList=new_arr;
      }
      else{
        $rootScope.testArea=true;
        $rootScope.testResults = response['data']['result'];
        $rootScope.error={"color":"#ff0000"};
      }
    }, function errorCallback() {
    });
  };

  $rootScope.aceLoaded = function(_editor){
    var _session = _editor.getSession();
    _session.setValue($rootScope.LuaString);
    _session.on("change", function(){ $rootScope.LuaString=_session.getValue()});

    $rootScope.updateLua=function(){
      _session.setValue($rootScope.LuaString);
    }
  };

  //Apply a template
  $rootScope.applyTemplate = function ($event){
    $rootScope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/applyTemplate',
      data:{template_name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      if(response['data']['result']==undefined) {
        $rootScope.init_task();
        var task=response['data']['_source'];
        $rootScope.show_task(task);
        $rootScope.updateLua();

      }else{
        $rootScope.testArea=true;
        $rootScope.testResults = response['data']['result'];
        $rootScope.error={"color":"#ff0000"};
      }

    }, function errorCallback() {
    });
  };

  //Return a page having an exact ip
  $rootScope.jump = function () {
    $rootScope.list(Callback);
  }
  function Callback(response) {
    if(response["err"]==null){
      task_ip = response["result"];
      task_ip_exist = true;
      window.location.href = "#/";
    }else {
      $rootScope.testArea=true;
      $rootScope.testResults = response["err"];
      $rootScope.error={"color":"#ff0000"};
    }
  }

  //Add Delimiters
  $rootScope.addDefault=function () {
    $rootScope.Delimiters='":{} ,[]';
  };

  //init pages variable
  $rootScope.init_task=function () {
    $rootScope.influxdb_array=[];
    $rootScope.select_all=[];
    $rootScope.fields_array=[];

    $rootScope.Name = "TestLog";
    $rootScope.LogPath = "test.log";
    $rootScope.ConfigName = "ElasticsearchConfig";
    $rootScope.LuaString="--example:client=105.160.71.175 method=GET status=404\n"+
      "function extract(s)\n" +
      "    ret = {}\n" +
      "    --*********此线下可修改*********\n" +
      "    i,j=string.find(s,'client=.- ')\n" +
      "    ret['client']=string.sub(request,i+7,j-1)\n" +
      "    i,j=string.find(s,'method=.- ')\n" +
      "    ret['method']=string.sub(s,i+7,j-1)\n" +
      "    --*********此线上可修改*********\n" +
      "    return ret\n" +
      "end";

    $rootScope.esHosts = "127.0.0.1:9200";
    $rootScope.esIndex = "my_index-%{+2006.01.02}";
    $rootScope.esType = "MyType";
    $rootScope.esMapping = JSON.stringify(JSON.parse('{"MyType":{"properties": {"MyField": {"type": "long"}}}}'), null, 4);

    $rootScope.influxHosts = "127.0.0.1:8086";
    $rootScope.influxInterval = 30;
    $rootScope.influxDBName = "DBname";
    $rootScope.influxdb_array.push({"PreMeasurment":"","Measurment":"_default","Target":"","Aggregations":{"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false},"Tags":[],"Timestamp":"_default"});

    $rootScope.kafkaBrokers = "127.0.0.1:9092";
    $rootScope.kafkaTopic = "";
    $rootScope.kafkaMaxMessageBytes = 1000000;
    $rootScope.kafkaRequiredAcks = "1";
    $rootScope.kafkaTimeout= 10;
    $rootScope.kafkaCompression = "0";
    $rootScope.kafkaPartitioner = "RandomPartitioner";
    $rootScope.kafkaReturnErrors = true;
    $rootScope.kafkaFlush={FlushBytes : 0,FlushMessages : 0,FlushFrequency : 0,FlushMaxMessages:0};
    $rootScope.kafkaRetry = {RetryMax : 3,RetryBackoff : 100};

    $rootScope.Delimiters = "";
    $rootScope.Keywords = "";
    $rootScope.LogFormat = "text";
    $rootScope.typeChange($rootScope.LogFormat);
    $rootScope.elasticsearch = true;
    $rootScope.influxdb = false;
    $rootScope.kafka = false;
    $rootScope.type=true;

    $rootScope.testArea=false;
  }

  //verify before add or update
  $rootScope.init_add_or_update=function(){
    var T=false;
    var measurementTargetNull=false;
    if($rootScope.fields_array!=null) {
      for (var id = 0; id < $rootScope.fields_array.length; id++) {
        if ($rootScope.fields_array[id].Name == '' ) {
          T = true;
          break;
        }
        if($rootScope.LogFormat=="text" && $rootScope.fields_array[id].Value == ''){
          T = true;
          break;
        }
      }
    }
    if ($rootScope.ConfigName=="InfluxDbConfig")
    {
      for (var id = 0; id < $rootScope.influxdb_array.length; id++) {
        if ($rootScope.influxdb_array[id].Target == '' ) {
          measurementTargetNull = true;
          break;
        }
      }
    }

    if(T){
      $rootScope.testArea=true;
      $rootScope.testResults = "Fields is not complete";
      $rootScope.error={"color":"#ff0000"};
      return false;
    } else if(measurementTargetNull){
      $rootScope.testArea=true;
      $rootScope.testResults = "Measurment is not complete";
      $rootScope.error={"color":"#ff0000"};
      return false;
    } else if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $rootScope.testArea=true;
      $rootScope.testResults = "IP is not complete";
      $rootScope.error={"color":"#ff0000"};
      return false;
    } else if($rootScope.Name==""||$rootScope.LogPath==""){
      $rootScope.testArea=true;
      $rootScope.testResults = "Name or LogPath is not complete";
      $rootScope.error={"color":"#ff0000"};
      return false;
    } else if ($rootScope.ConfigName=="ElasticsearchConfig"&&($rootScope.esHosts==""||$rootScope.esIndex==""||$rootScope.esType=="")){
      $rootScope.testArea=true;
      $rootScope.testResults = "ElasticsearchConfig is not complete";
      $rootScope.error={"color":"#ff0000"};
      return false;
    } else if($rootScope.ConfigName=="InfluxDbConfig"&&($rootScope.influxHosts==''||$rootScope.influxDBName==''||$rootScope.influxInterval=='')){
      $rootScope.testArea=true;
      $rootScope.testResults = "ElasticsearchConfig is not complete";
      $rootScope.error={"color":"#ff0000"};
      return false;
    } else {
      return true;
    }
  }

  // Get the config
  $rootScope.get_configs=function(){
    var SenderConfig;
    var ExtractorConfig;
    var AggregatorConfig;
    if($rootScope.LogFormat=="text"){
      ExtractorConfig={Name:$rootScope.LogFormat,Config:{Delimiters: $rootScope.Delimiters,Fields:$rootScope.fields_array}};
    }else if(($rootScope.LogFormat=="json")){
      ExtractorConfig={Name:$rootScope.LogFormat,Config:{Fields:$rootScope.fields_array}};
    }else if(($rootScope.LogFormat=="lua")){
      ExtractorConfig ={Name:$rootScope.LogFormat,Config:{LuaString: $rootScope.LuaString}};
    }

    if($rootScope.ConfigName=="ElasticsearchConfig"){
      var hostsarray = $rootScope.esHosts.split(',');
      var hosts = [];
      for (var id = 0; id < hostsarray.length; id++) {
        hosts.push(hostsarray[id]);
      }
      SenderConfig={SenderName:$rootScope.ConfigName,Config:{Hosts: hosts, Index: $rootScope.esIndex, Type: $rootScope.esType, Mapping: JSON.parse($rootScope.esMapping)}};
      AggregatorConfig={Enable:false};
    }else if($rootScope.ConfigName=="InfluxDbConfig"){
      for(var key in $rootScope.influxdb_array){
        var tmp=[];
        for(var key2 in $rootScope.influxdb_array[key].Aggregations){
          if($rootScope.influxdb_array[key].Aggregations[key2]==true){
            tmp.push(key2);
          }
        }
        if(tmp.length==0){
          tmp.push("cnt");
        }
        $rootScope.influxdb_array[key].Aggregations=tmp;
      }

      SenderConfig={SenderName:$rootScope.ConfigName,Config:{Hosts: $rootScope.influxHosts,  DBName: $rootScope.influxDBName}};
      AggregatorConfig={Enable:true,Interval: $rootScope.influxInterval,AggregatorOptions:$rootScope.influxdb_array};
    }else if ($rootScope.ConfigName="KafkaConfig"){
      var brokersarray = $rootScope.kafkaBrokers.split(',');
      var brokers = [];
      for (var id = 0; id < brokersarray.length; id++) {
        brokers.push(brokersarray[id]);
      }
      SenderConfig={SenderName:$rootScope.ConfigName,Config:{
          Brokers: brokers,Topic :$rootScope.kafkaTopic,MaxMessageBytes:$rootScope.kafkaMaxMessageBytes,RequiredAcks:Number($rootScope.kafkaRequiredAcks),
          Timeout:$rootScope.kafkaTimeout,Compression:Number($rootScope.kafkaCompression),Partitioner:$rootScope.kafkaPartitioner,ReturnErrors:$rootScope.kafkaReturnErrors,
          Flush:$rootScope.kafkaFlush,Retry:$rootScope.kafkaRetry
        }};
      AggregatorConfig={Enable:false};
    }
    return{SenderConfig:SenderConfig,ExtractorConfig:ExtractorConfig,AggregatorConfig:AggregatorConfig};
  }


  $rootScope.show_task=function (task) {
    $rootScope.Name=task['Name'];
    $rootScope.LogPath=task['LogPath'];

    $rootScope.LogFormat=task['ExtractorConfig']['Name'];
    $rootScope.typeChange($rootScope.LogFormat);
    if($rootScope.LogFormat=="text"){
      $rootScope.fields_array=task['ExtractorConfig']['Config']['Fields'];
      $rootScope.Delimiters=task['ExtractorConfig']['Config']['Delimiters'];
    }else if($rootScope.LogFormat=="json"){
      $rootScope.fields_array=task['ExtractorConfig']['Config']['Fields'];
    }else if($rootScope.LogFormat=="lua"){
      $rootScope.LuaString=task['ExtractorConfig']['Config']['LuaString'];
    }
    if($rootScope.fields_array==null){
      $rootScope.fields_array=[];
    }

    if(task['AggregatorConfig']['Enable']==true){
      $rootScope.influxInterval = task['AggregatorConfig']['Interval'];
      $rootScope.influxdb_array=task['AggregatorConfig']['AggregatorOptions'];
      for(var key in $rootScope.influxdb_array)
      {
        var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
        for(var key2 in $rootScope.influxdb_array[key]["Aggregations"]){
          Aggregations[$rootScope.influxdb_array[key]["Aggregations"][key2]]=true;
        }
        $rootScope.influxdb_array[key]["Aggregations"]=Aggregations;
      }
    }
    $rootScope.ConfigName=task['SenderConfig']['SenderName'];
    if($rootScope.ConfigName=="ElasticsearchConfig")
    {
      $rootScope.elasticsearch=true;
      $rootScope.influxdb=false;
      $rootScope.kafka=false;

      $rootScope.esHosts=task['SenderConfig']['Config']['Hosts'].toString();
      $rootScope.esIndex=task['SenderConfig']['Config']['Index'];
      $rootScope.esType=task['SenderConfig']['Config']['Type'];
      $rootScope.esMapping=JSON.stringify(task['SenderConfig']['Config']['Mapping'],null,4);
      if($rootScope.esMapping=='null'){
        console.log("Mapping is null")
        $rootScope.esMapping="";
      }
    }else if($rootScope.ConfigName=="InfluxDbConfig") {
      $rootScope.elasticsearch=false;
      $rootScope.influxdb=true;
      $rootScope.kafka=false;

      $rootScope.influxHosts = task['SenderConfig']['Config']['Hosts'].toString();
      $rootScope.influxDBName = task['SenderConfig']['Config']['DBName'];
    }else if($rootScope.ConfigName=="KafkaConfig") {
      $rootScope.elasticsearch=false;
      $rootScope.influxdb=false;
      $rootScope.kafka=true;

      $rootScope.kafkaBrokers = task['SenderConfig']['Config']['Brokers'].toString();
      $rootScope.kafkaTopic = task['SenderConfig']['Config']['Topic'];
      $rootScope.kafkaMaxMessageBytes = task['SenderConfig']['Config']['MaxMessageBytes'];
      $rootScope.kafkaRequiredAcks = task['SenderConfig']['Config']['RequiredAcks'].toString();
      $rootScope.kafkaTimeout= task['SenderConfig']['Config']['Timeout'];
      $rootScope.kafkaCompression = task['SenderConfig']['Config']['Compression'].toString();
      $rootScope.kafkaPartitioner = task['SenderConfig']['Config']['Partitioner'];
      $rootScope.kafkaReturnErrors = task['SenderConfig']['Config']['ReturnErrors'];
      $rootScope.kafkaFlush=task['SenderConfig']['Config']['Flush'];
      $rootScope.kafkaRetry = task['SenderConfig']['Config']['Retry'];
    }
    $rootScope.Keywords=task['Keywords'];
  }

  $rootScope.list=function (Callback) {
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      if(response['data']["result"]==undefined) {
        //$scope.visible = true;
        var name;
        var stat;
        var start;
        var logpath;
        var array=[];
        for (var Name in response['data']['configs']) {
          name=Name;
          logpath=response['data']['configs'][Name]['LogPath'];
          stat=response['data']['stats'][Name]['Stop'];
          start=!stat;
          array.push({name:name,logpath:logpath,stop:stat,start:start});
        }
        Callback({result:array,err:null});
      }
      else{
        Callback({result:null,err:response['data']['result']});
      }
    }, function errorCallback(err) {
      console.log('err');
      Callback({result:null,err:err});
    });
  };

});

