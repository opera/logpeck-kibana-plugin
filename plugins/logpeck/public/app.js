import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
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
var app=uiModules.get("app", []);

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
  $scope.listTask = function ($event) {
    $rootScope.T_ip=event.target.getAttribute('name');
    localStorage.setItem("T_ip",event.target.getAttribute('name'));
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result']==undefined) {
        $scope.visible = true;
        if (response['data'][0]['null'] != "true") {
          var name;
          var stat;
          var start;
          var logpath;
          $scope.T_array=[];
          for (var id = 0; id < response['data'].length; id++) {
            name=response['data'][id]['Name'];
            logpath=response['data'][id]['LogPath'];
            stat=response['data'][id]['Stop'];
            start=!stat;
            $scope.T_array.push({name:name,logpath:logpath,stop:stat,start:start});
          }
        }
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

  //Start Task
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


  //Stop Task
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


  //Remove Task
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

  //click task link
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
      //update_ip=response;
      localStorage.setItem("update_ip", angular.toJson(response));
      window.location.href = "#/updateTask";
    }, function errorCallback(err) {
      console.log('err');
    });
  };

});


//************************controller "logpeckAdd"******************************
app.controller('logpeckAdd',function ($scope ,$rootScope,$route, $http, $interval) {
  //init
  $rootScope.testArea=false;
  $rootScope.T_ip=localStorage.getItem("T_ip");

  $rootScope.influxdb_array=[];
  $rootScope.select_all=[];
  $rootScope.fields_array=[];

  $rootScope.Name = "TestLog";
  $rootScope.LogPath = "test.log";
  $rootScope.ConfigName = "ElasticSearchConfig";

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
  $rootScope.elasticsearch = true;
  $rootScope.influxdb = false;
  $rootScope.kafka = false;
  $rootScope.type=true;

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
    console.log($rootScope.ConfigName);
    var T=false;
    var measurementTargetNull = false;
    if($rootScope.fields_array==null){
      ;
    }
    else {
      console.log($rootScope.fields_array.length);
      for (var id = 0; id < $rootScope.fields_array.length; id++) {
        console.log($rootScope.fields_array[id].Name);
        console.log($rootScope.fields_array[id].Value);
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
      $rootScope.addTaskResult = "fields is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else if (measurementTargetNull) {
      $rootScope.testArea=true;
      $rootScope.testResults = "Target is not complete";
      $rootScope.error={"color":"#ff0000"};
    }
    else if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $rootScope.addTaskResult = "IP is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else if($rootScope.Name==""||$rootScope.LogPath==""){
      $rootScope.addTaskResult = "Name or LogPath is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }else if ($rootScope.ConfigName=="ElasticSearchConfig"&&($rootScope.esHosts==""||$rootScope.esIndex==""||$rootScope.esType=="")){
      $rootScope.addTaskResult = "ElasticSearchConfig is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }else if($rootScope.ConfigName=="InfluxDbConfig"&&($rootScope.influxHosts==''||$rootScope.influxDBName==''||$rootScope.influxInterval=='')){
      $rootScope.addTaskResult = "InfluxDbConfig is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else {
      if($rootScope.ConfigName=="ElasticSearchConfig"){
        $rootScope.Sender={Hosts: $rootScope.esHosts, Index: $rootScope.esIndex, Type: $rootScope.esType, Mapping: $rootScope.esMapping,}
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
          console.log("tmp");
          console.log(tmp);
          $rootScope.influxdb_array[key].Aggregations=tmp;
        }

        $rootScope.Sender={Hosts: $rootScope.influxHosts, Interval: $rootScope.influxInterval, DBName: $rootScope.influxDBName,AggregatorConfigs:$rootScope.influxdb_array}
        console.log($rootScope.Sender);
      }else if ($rootScope.ConfigName="KafkaConfig"){
        $rootScope.Sender={
          Brokers: $rootScope.kafkaBrokers,Topic :$rootScope.kafkaTopic,MaxMessageBytes:$rootScope.kafkaMaxMessageBytes,RequiredAcks:$rootScope.kafkaRequiredAcks,
          Timeout:$rootScope.kafkaTimeout,Compression:$rootScope.kafkaCompression,Partitioner:$rootScope.kafkaPartitioner,ReturnErrors:$rootScope.kafkaReturnErrors,
          Flush:$rootScope.kafkaFlush,Retry:$rootScope.kafkaRetry
        };
      }
      $http({
        method: 'POST',
        url: '../api/logpeck/addTask',
        data: {
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          ConfigName:$rootScope.ConfigName,
          Sender:$rootScope.Sender,
          Fields: $rootScope.fields_array,
          Delimiters: $rootScope.Delimiters,
          Keywords: $rootScope.Keywords,
          LogFormat: $rootScope.LogFormat,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
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
          $rootScope.T_array = new_arr;
          task_ip = new_arr;
          task_ip_exist = true;
          window.location.href = "#/";
        }
        else {
          $rootScope.addTaskResult =response['data'][0]['result'];
          $rootScope.testArea=true;
          $rootScope.testResults = $rootScope.addTaskResult;
          $rootScope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
        console.log('error')
      });
    }
  };

});

//********************controller "logpeckUpdate"***************************
app.controller('logpeckUpdate',function ($scope ,$rootScope,$route, $http) {
  //init
  $rootScope.testArea=false;
  $rootScope.influxdb_array=[];
  $rootScope.select_all=[];
  var update_ip=angular.fromJson(localStorage.getItem("update_ip"));
  $rootScope.T_ip=localStorage.getItem("T_ip");

  $rootScope.Name=update_ip['data']['Name'];
  $rootScope.LogPath=update_ip['data']['LogPath'];
  $rootScope.ConfigName=update_ip['data']['SenderConfig']['SenderName'];

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

  if($rootScope.ConfigName=="ElasticSearchConfig")
  {
    $rootScope.elasticsearch=true;
    $rootScope.influxdb=false;
    $rootScope.kafka=false;

    $rootScope.esHosts=update_ip['data']['SenderConfig']['Config']['Hosts'].toString();
    $rootScope.esIndex=update_ip['data']['SenderConfig']['Config']['Index'];
    $rootScope.esType=update_ip['data']['SenderConfig']['Config']['Type'];
    $rootScope.esMapping=JSON.stringify(update_ip['data']['SenderConfig']['Config']['Mapping'],null,4);
    if($rootScope.esMapping=='null'){
      $rootScope.esMapping="";
    }
  }else if($rootScope.ConfigName=="InfluxDbConfig") {
    $rootScope.elasticsearch=false;
    $rootScope.influxdb=true;
    $rootScope.kafka=false;

    $rootScope.influxHosts = update_ip['data']['SenderConfig']['Config']['Hosts'].toString();
    $rootScope.influxInterval = update_ip['data']['SenderConfig']['Config']['Interval'];
    $rootScope.influxDBName = update_ip['data']['SenderConfig']['Config']['DBName'];
    $rootScope.influxdb_array=update_ip['data']['SenderConfig']['Config']['AggregatorConfigs'];
    for(var key in $rootScope.influxdb_array)
    {
      var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
      for(var key2 in $rootScope.influxdb_array[key]["Aggregations"]){
        Aggregations[$rootScope.influxdb_array[key]["Aggregations"][key2]]=true;
      }
      $rootScope.influxdb_array[key]["Aggregations"]=Aggregations;
    }
  }else if($rootScope.ConfigName=="KafkaConfig") {
    $rootScope.elasticsearch=false;
    $rootScope.influxdb=false;
    $rootScope.kafka=true;

    $rootScope.kafkaBrokers = update_ip['data']['SenderConfig']['Config']['Brokers'].toString();
    $rootScope.kafkaTopic = update_ip['data']['SenderConfig']['Config']['Topic'];
    $rootScope.kafkaMaxMessageBytes = update_ip['data']['SenderConfig']['Config']['MaxMessageBytes'];
    $rootScope.kafkaRequiredAcks = update_ip['data']['SenderConfig']['Config']['RequiredAcks'].toString();
    $rootScope.kafkaTimeout= update_ip['data']['SenderConfig']['Config']['Timeout'];
    $rootScope.kafkaCompression = update_ip['data']['SenderConfig']['Config']['Compression'].toString();
    $rootScope.kafkaPartitioner = update_ip['data']['SenderConfig']['Config']['Partitioner'];
    $rootScope.kafkaReturnErrors = update_ip['data']['SenderConfig']['Config']['ReturnErrors'];
    $rootScope.kafkaFlush=update_ip['data']['SenderConfig']['Config']['Flush'];
    $rootScope.kafkaRetry = update_ip['data']['SenderConfig']['Config']['Retry'];
  }

  $rootScope.fields_array=update_ip['data']['Fields'];
  $rootScope.Delimiters=update_ip['data']['Delimiters'];
  $rootScope.Keywords=update_ip['data']['Keywords'];
  $rootScope.LogFormat=update_ip['data']['LogFormat'];
  if($rootScope.LogFormat=="text"){
    $rootScope.type=true;
  }else if($rootScope.LogFormat=="json"){
    $rootScope.type=false;
  }
  if($rootScope.fields_array==null){
    $rootScope.fields_array=[];
  }

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
    var T=false;
    var measurementTargetNull=false;
    if($rootScope.fields_array==null){

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
      $rootScope.addTaskResult = "Fields is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else if(measurementTargetNull){
      $rootScope.testArea=true;
      $rootScope.testResults = "Measurment is not complete";
      $rootScope.error={"color":"#ff0000"};
    }
    else if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $rootScope.addTaskResult = "IP is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else if($rootScope.Name==""||$rootScope.LogPath==""){
      $rootScope.addTaskResult = "Name or LogPath is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }else if ($rootScope.ConfigName=="ElasticSearchConfig"&&($rootScope.esHosts==""||$rootScope.esIndex==""||$rootScope.esType=="")){
      $rootScope.addTaskResult = "ElasticSearchConfig is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }else if($rootScope.ConfigName=="InfluxDbConfig"&&($rootScope.influxHosts==''||$rootScope.influxDBName==''||$rootScope.influxInterval=='')){
      $rootScope.addTaskResult = "InfluxDbConfig is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else {
      if($rootScope.ConfigName=="ElasticSearchConfig"){
        $rootScope.Sender={Hosts: $rootScope.esHosts, Index: $rootScope.esIndex, Type: $rootScope.esType, Mapping: $rootScope.esMapping,}
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

        $rootScope.Sender={Hosts: $rootScope.influxHosts, Interval: $rootScope.influxInterval, DBName: $rootScope.influxDBName,AggregatorConfigs:$rootScope.influxdb_array}
        console.log($rootScope.Sender);
      }else if ($rootScope.ConfigName="KafkaConfig"){
        $rootScope.Sender={
          Brokers: $rootScope.kafkaBrokers,Topic :$rootScope.kafkaTopic,MaxMessageBytes:$rootScope.kafkaMaxMessageBytes,RequiredAcks:$rootScope.kafkaRequiredAcks,
          Timeout:$rootScope.kafkaTimeout,Compression:$rootScope.kafkaCompression,Partitioner:$rootScope.kafkaPartitioner,ReturnErrors:$rootScope.kafkaReturnErrors,
          Flush:$rootScope.kafkaFlush,Retry:$rootScope.kafkaRetry
        };
      }
      $http({
        method: 'POST',
        url: '../api/logpeck/updateTask',
        data: {
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          ConfigName:$rootScope.ConfigName,
          Sender: $rootScope.Sender,
          Fields: $rootScope.fields_array,
          Delimiters: $rootScope.Delimiters,
          Keywords: $rootScope.Keywords,
          LogFormat: $rootScope.LogFormat,
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
          //$rootScope.T_array = new_arr;
          task_ip = new_arr;
          task_ip_exist = true;
          window.location.href = "#/";
        }
        else {
          $rootScope.addTaskResult =response['data'][0]['result'];
          $rootScope.testArea=true;
          $rootScope.testResults = $rootScope.addTaskResult;
          $rootScope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
      });
    }
  };

});


//*************the share function of 'Add' and 'Update'******************
app.run(function($rootScope,$route, $http) {
  //Change configName (Elasticsearch InfluxDb Kafka)
  $rootScope.configChange = function(configName){
    if(configName=="ElasticSearchConfig"){
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
    }else if(type=="json"){
      $rootScope.type=false;
    }
  };

  //checkbox
  $rootScope.selectOne=function(string,key){
    console.log(string,key);
    if($rootScope.influxdb_array[key]['Aggregations'][string]==false){
      $rootScope.influxdb_array[key]['Aggregations'][string]=true;
    }else{
      $rootScope.influxdb_array[key]['Aggregations'][string]=false;
    }
  };
  $rootScope.selectAll=function(key){
    console.log(key);
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
    console.log($rootScope.influxdb_array['Tags']);
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
    $rootScope.addTaskResult="";
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
      $rootScope.addTaskResult = "fields is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $rootScope.addTaskResult = "IP is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else if($rootScope.Name==""||$rootScope.LogPath==""){
      $rootScope.addTaskResult = "filed is not complete";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
      $rootScope.error={"color":"#ff0000"};
    }
    else {
      $http({
        method: 'POST',
        url: '../api/logpeck/testTask',
        data: {
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          ConfigName:$rootScope.ConfigName,
          Fields: $rootScope.fields_array,
          Delimiters: $rootScope.Delimiters,
          Keywords: $rootScope.Keywords,
          LogFormat: $rootScope.LogFormat,
          TestNum: $rootScope.TestNum,
          Timeout:    $rootScope.Time,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data'][0]['result']==undefined) {
          console.log(response['data']);
          var obj = angular.fromJson(response['data']);
          console.log(obj);
          $rootScope.testResults=JSON.stringify(response['data'],null,4);
          console.log($rootScope.testResults.Log);
          $rootScope.error={"color":"#2d2d2d"};
        }
        else {
          $rootScope.addTaskResult =response['data'][0]['result'];
          $rootScope.testArea=true;
          $rootScope.testResults = $rootScope.addTaskResult;
          $rootScope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };

  //Add some template
  $rootScope.addTemplate = function () {
    $rootScope.addTaskResult="";
    $rootScope.testArea=false;
    if ($rootScope.template_name == ""||$rootScope.template_name ==undefined) {
      $rootScope.addTaskResult = "template is null";
      $rootScope.testArea=true;
      $rootScope.testResults = $rootScope.addTaskResult;
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
      if($rootScope.ConfigName=="ElasticSearchConfig"){
        $rootScope.Sender={Hosts: $rootScope.esHosts, Index: $rootScope.esIndex, Type: $rootScope.esType, Mapping: $rootScope.esMapping,}
      }else if($rootScope.ConfigName=="InfluxDbConfig"){
        $rootScope.Sender={Hosts: $rootScope.influxHosts, Interval: $rootScope.influxInterval, DBName: $rootScope.influxDBName,AggregatorConfigs:$rootScope.influxdb_array}
      }else if ($rootScope.ConfigName="KafkaConfig"){
        $rootScope.Sender={
          Brokers: $rootScope.kafkaBrokers,Topic :$rootScope.kafkaTopic,MaxMessageBytes:$rootScope.kafkaMaxMessageBytes,RequiredAcks:$rootScope.kafkaRequiredAcks,
          Timeout:$rootScope.kafkaTimeout,Compression:$rootScope.kafkaCompression,Partitioner:$rootScope.kafkaPartitioner,ReturnErrors:$rootScope.kafkaReturnErrors,
          Flush:$rootScope.kafkaFlush,Retry:$rootScope.kafkaRetry
        };
      }
      $http({
        method: 'POST',
        url: '../api/logpeck/addTemplate',
        data: {
          template_name: $rootScope.template_name,
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          ConfigName:$rootScope.ConfigName,
          Sender: $rootScope.Sender,
          Fields: $rootScope.fields_array,
          Delimiters: $rootScope.Delimiters,
          Keywords: $rootScope.Keywords,
          LogFormat: $rootScope.LogFormat,
        },
      }).then(function successCallback(response) {
        if (response['data'][0]['result'] == "Add success") {
          $rootScope.TemplateList.push($rootScope.template_name);
          console.log($rootScope.TemplateList);
          $rootScope.addTaskResult = response['data'][0]['result'];
          $rootScope.template_name ="";
        }
        else{
          $rootScope.addTaskResult = response['data'][0]['result'];
          $rootScope.testArea=true;
          $rootScope.testResults = $rootScope.addTaskResult;
          $rootScope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };
  $rootScope.removeTemplate = function ($event) {
    $rootScope.addTaskResult="";
    $rootScope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/removeTemplate',
      data:{template_name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      console.log("app")
      $rootScope.addTaskResult ='';
      if(response['data'][0]['result'] != "err"){
        var new_arr = [];
        for (var id=0 ; id<$rootScope.TemplateList.length ; id++) {
          if(response['data'][0]['result']!=$rootScope.TemplateList[id]) {
            new_arr.push($rootScope.TemplateList[id]);
          }
        }
        $rootScope.TemplateList=new_arr;
      }
      else{
        $rootScope.addTaskResult=response['data'][0]['result'];
        $rootScope.testArea=true;
        $rootScope.testResults = $rootScope.addTaskResult;
        $rootScope.error={"color":"#ff0000"};
      }
    }, function errorCallback() {
    });
  };

  //Apply a template
  $rootScope.applyTemplate = function ($event){
    $rootScope.addTaskResult="";
    $rootScope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/applyTemplate',
      data:{template_name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      console.log(response['data']['_source'])
      $rootScope.Name=response['data']['_source']['Name'];
      $rootScope.LogPath=response['data']['_source']['LogPath'];
      $rootScope.ConfigName=response['data']['_source']['SenderConfig']['SenderName']

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

      if($rootScope.ConfigName=="ElasticSearchConfig")
      {
        $rootScope.elasticsearch=true;
        $rootScope.influxdb=false;
        $rootScope.kafka=false;

        $rootScope.esHosts=response['data']['_source']['SenderConfig']['Config']['Hosts'].toString();
        $rootScope.esIndex=response['data']['_source']['SenderConfig']['Config']['Index'];
        $rootScope.esType=response['data']['_source']['SenderConfig']['Config']['Type'];
        $rootScope.esMapping=JSON.stringify(response['data']['_source']['SenderConfig']['Config']['Mapping'],null,4);
        if($rootScope.esMapping=='null'){
          $rootScope.esMapping="";
        }
      }else if($rootScope.ConfigName=="InfluxDbConfig") {
        $rootScope.elasticsearch=false;
        $rootScope.influxdb=true;
        $rootScope.kafka=false;

        $rootScope.influxHosts = response['data']['_source']['SenderConfig']['Config']['Hosts'].toString();
        $rootScope.influxInterval = response['data']['_source']['SenderConfig']['Config']['Interval'];
        $rootScope.influxDBName = response['data']['_source']['SenderConfig']['Config']['DBName'];
        $rootScope.influxdb_array=response['data']['_source']['SenderConfig']['Config']['AggregatorConfigs'];
      }else if($rootScope.ConfigName=="KafkaConfig") {
        $rootScope.elasticsearch=false;
        $rootScope.influxdb=false;
        $rootScope.kafka=true;

        $rootScope.kafkaBrokers = response['data']['_source']['SenderConfig']['Config']['Brokers'].toString();
        $rootScope.kafkaTopic = response['data']['_source']['SenderConfig']['Config']['Topic'];
        $rootScope.kafkaMaxMessageBytes = response['data']['_source']['SenderConfig']['Config']['MaxMessageBytes'];
        $rootScope.kafkaRequiredAcks = response['data']['_source']['SenderConfig']['Config']['RequiredAcks'].toString();
        $rootScope.kafkaTimeout= response['data']['_source']['SenderConfig']['Config']['Timeout'];
        $rootScope.kafkaCompression = response['data']['_source']['SenderConfig']['Config']['Compression'].toString();
        $rootScope.kafkaPartitioner = response['data']['_source']['SenderConfig']['Config']['Partitioner'];
        $rootScope.kafkaReturnErrors = response['data']['_source']['SenderConfig']['Config']['ReturnErrors'];
        $rootScope.kafkaFlush=response['data']['_source']['SenderConfig']['Config']['Flush'];
        $rootScope.kafkaRetry = response['data']['_source']['SenderConfig']['Config']['Retry'];
      }

      console.log(response['data']['_source']['Fields']);
      $rootScope.fields_array=response['data']['_source']['Fields'];
      $rootScope.Delimiters=response['data']['_source']['Delimiters'];
      $rootScope.Keywords=response['data']['_source']['Keywords'];
      $rootScope.LogFormat=response['data']['_source']['LogFormat'];
      if($rootScope.LogFormat=="text"){
        $rootScope.type=true;
      }else if($rootScope.LogFormat=="json"){
        $rootScope.type=false;
      }
    }, function errorCallback() {
    });
  };

  //Return a page having an exact ip
  $rootScope.jump = function () {
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
        //$rootScope.T_array = new_arr;
        task_ip = new_arr;
        task_ip_exist = true;
        window.location.href = "#/";
      }
      else {
        $rootScope.addTaskResult =response['data'][0]['result'];
        $rootScope.testArea=true;
        $rootScope.testResults = $rootScope.addTaskResult;
        $rootScope.error={"color":"#ff0000"};
      }
    }, function errorCallback() {
    });
  };

  $rootScope.addDefault=function () {
    $rootScope.Delimiters='":{} ,[]';
  };

});

