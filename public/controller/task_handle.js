//************************controller "logpeckAdd"******************************
import { uiModules } from 'ui/modules';
import * as myConfig from "../../logpeckConfig";
import "./task_event.js";
import "./task_config.js";

var app=uiModules.get("app",[]);
app.controller('logpeckTask', function ($scope, $rootScope, $http, $location) {

  app.expandControllerConfig($scope, $rootScope, $http, $location);
  app.expandControllerEvent($scope, $rootScope, $http, $location);

  function init() {

    $rootScope.TaskIP = localStorage.getItem("TaskIP");
    $scope.useTemplate = false;
    var url = $location.url();
    var path = new RegExp("/addTask.*");
    if (path.test(url)) {
      $scope.initDefaultTask();
      $scope.addTaskUrl = true;
    } else {
      var TaskInfo = angular.fromJson(localStorage.getItem("TaskInfo"));
      $scope.initExistTask(TaskInfo);
      $scope.addTaskUrl = false;
    }
    $scope.luaLoad();

    $http({
      method: 'POST',
      url: '../api/logpeck/list_template',
      data: {},
    }).then(function successCallback(response) {
      $scope.TemplateList = [];
      for (var id in response.data.data) {
        $scope.TemplateList.push(response.data.data[id]);
      }
    });
  }
  init();

  //Add task
  $scope.addTask = function () {
    for(var key in $scope.comply_rules){
      if($scope.comply_rules[key]==true){
        alert("Only letters,numbers,'-' and '_' are allowed");
        return;
      }
    }
    if($scope.taskValueRule()==true){
      var config=$scope.getConfigs()
      $http({
        method: 'POST',
        url: '../api/logpeck/addTask',
        data: {
          Name: $scope.name,
          Logpath: $scope.logPath,
          Extractor: config.Extractor,
          Sender: config.Sender,
          Aggregator: config.Aggregator,
          Keywords: $scope.keywords,
          ip: $rootScope.TaskIP
        },
      }).then(function successCallback(response) {
        if (response.data.err == null) {
          if(response.data.data=="Add Success") {
            $rootScope.list(callback);
          }
          else {
            $scope.testArea=true;
            $scope.testResults = response.data.data;
            $scope.error={"color":"#ff0000"};
          }
        } else {
          $scope.testArea=true;
          $scope.testResults = response.data.err;
          $scope.error={"color":"#ff0000"};
        }
      }, function errorCallback(err) {
        $scope.testArea=true;
        $scope.testResults = err;
        $scope.error={"color":"#ff0000"};
      });
    }
  };

  //update
  $scope.updateTask = function () {
    for(var key in $scope.comply_rules){
      if($scope.comply_rules[key]==true){
        alert("Only letters,numbers,- and _ are allowed");
        return;
      }
    }
    if ($scope.taskValueRule() == true) {
      var config=$scope.getConfigs()
      $http({
        method: 'POST',
        url: '../api/logpeck/updateTask',
        data: {
          Name: $scope.name,
          Logpath: $scope.logPath,
          Extractor: config.Extractor,
          Sender: config.Sender,
          Aggregator: config.Aggregator,
          Keywords: $scope.keywords,
          ip: $rootScope.TaskIP
        },
      }).then(function successCallback(response) {
        if (response.data.err == null) {
          if(response.data.data == "Update Success") {
            $rootScope.list(callback);
          }
          else {
            $scope.testArea=true;
            $scope.testResults = response.data.data;
            $scope.error={"color":"#ff0000"};
          }
        } else {
          $scope.testArea=true;
          $scope.testResults = response.data.err;
          $scope.error={"color":"#ff0000"};
        }
      });
    }
  };

  //Test task and return some logs
  $scope.testTask = function () {
    $scope.testArea=true;
    $scope.TestNum=10;
    $scope.Time=2;
    var T=false;
    if($scope.fieldsArray==null){
      ;
    }
    else {
      for (var id = 0; id < $scope.fieldsArray.length; id++) {
        if ($scope.fieldsArray[id].Name == '' ) {
          T = true;
          break;
        }
        if($scope.logFormat=="text" && $scope.fieldsArray[id].Value == ''){
          T = true;
          break;
        }
      }
    }

    if(T){
      $scope.testArea=true;
      $scope.testResults = "fields is not complete";
      $scope.error={"color":"#ff0000"};
    }
    else if ($scope.TaskIP == ""||$scope.TaskIP ==undefined) {
      $scope.testArea=true;
      $scope.testResults = "IP is not complete";
      $scope.error={"color":"#ff0000"};
    }
    else if($scope.name==""||$scope.logPath==""){
      $scope.testArea=true;
      $scope.testResults = "filed is not complete";
      $scope.error={"color":"#ff0000"};
    } else {
      var Sender={Name:"Elasticsearch",Config:{Hosts:["127.0.0.1:7117"],Name:"Test"}};
      var Extractor={};
      var Aggregator={};
      if($scope.logFormat=="text"){
        Extractor={Name:$scope.logFormat,Config:{Delimiters: $scope.delimiters,Fields:$scope.fieldsArray}};
      }else if(($scope.logFormat=="json")){
        Extractor={Name:$scope.logFormat,Config:{Fields:$scope.fieldsArray}};
      }else if(($scope.logFormat=="lua")){
        Extractor ={Name:$scope.logFormat,Config:{LuaString: $scope.luaString,Fields:$scope.fieldsArray}};
      }
      var Test={TestNum:$scope.TestNum,Timeout:$scope.Time};
      $http({
        method: 'POST',
        url: '../api/logpeck/testTask',
        data: {
          Name: $scope.name,
          Logpath: $scope.logPath,
          Extractor: Extractor,
          Sender: Sender,
          Aggregator: Aggregator,
          Keywords: $scope.keywords,
          Test: Test,
          ip: $scope.TaskIP
        },
      }).then(function successCallback(response) {
        console.log(response);
        console.log(response.toString());
        if (response.data.err == null) {
          if (response.data.data == "null") {

          }
          var tmp = JSON.parse(response.data.data);
          $scope.testResults=JSON.stringify(tmp, null, 4);
          $scope.error={"color":"#2d2d2d"};
        } else {
          $scope.testArea=true;
          $scope.testResults = response.data.err;
          $scope.error={"color":"#ff0000"};
        }
      });
    }
  };

  //Add some template
  $scope.addTemplate = function () {
    $scope.testArea=false;
    if ($scope.template_name == ""||$scope.template_name ==undefined) {
      $scope.testArea=true;
      $scope.testResults = "template is null";
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

      var config = $scope.getConfigs();

      $http({
        method: 'POST',
        url: '../api/logpeck/addTemplate',
        data: {
          template_name: $scope.template_name,
          reset: exist,
          Name: $scope.name,
          Logpath: $scope.logPath,
          Extractor: config.Extractor,
          Sender: config.Sender,
          Aggregator: config.Aggregator,
          Keywords: $scope.keywords,
        },
      }).then(function successCallback(response) {
        if (response.data.err == null) {
          $scope.TemplateList.push($scope.template_name);
          $scope.testResults = "Add success";
          $scope.template_name ="";
        } else {
          $scope.testArea=true;
          $scope.testResults = response.data.err;
          $scope.error={"color":"#ff0000"};
        }
        if (config.Aggregator.Enable == true) {
          for(var key in $scope.influxdbArray) {
            var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
            for(var key2 in $scope.influxdbArray[key]["Aggregations"]){
              Aggregations[$scope.influxdbArray[key]["Aggregations"][key2]]=true;
            }
            $scope.influxdbArray[key]["Aggregations"]=Aggregations;
          }
        }
      });
    }
  };

  $scope.removeTemplate = function ($event) {
    var template_name = event.target.getAttribute('name');
    if(!confirm("Remove " + template_name)){
      return;
    }
    $scope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/removeTemplate',
      data:{template_name: template_name},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        $scope.TemplateList=response.data.data;
      } else {
        $scope.testArea=true;
        $scope.testResults = response.data.err;
        $scope.error={"color":"#ff0000"};
      }
    });
  };


  //Apply a template
  $scope.applyTemplate = function ($event) {
    $scope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/applyTemplate',
      data:{template_name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        $scope.useTemplate
        $scope.initExistTask(response.data.data);
        $scope.luaLoad();
      } else {
        $scope.testArea=true;
        $scope.testResults = response.data.err;
        $scope.error={"color":"#ff0000"};
      }
    });
  };

  //Return a page having an exact ip
  $scope.jump = function () {
    $rootScope.list(callback);
  }

  $scope.jumpMain = function () {
    localStorage.setItem("TaskIP", "");
    $rootScope.TaskIP = "";
    $rootScope.GroupName = "All";
    window.location.href = "#/";
  }

  function callback(response) {
    if(response.err == null){
      $rootScope.TaskList = response.data;
      window.location.href = "#/";
    } else {
      $scope.testArea=true;
      $scope.testResults = response.err;
      $scope.error={"color":"#ff0000"};
    }
  }

});