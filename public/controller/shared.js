//*************the share function of 'Add' and 'Update'******************
import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

var app=uiModules.get("app",[]);
app.run(function($rootScope, $route, $http) {

  //Return a page having an exact ip
  $rootScope.jump = function () {
    $rootScope.list(Callback);
  }

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
      var Sender={Name:"Elasticsearch",Config:{Hosts:["127.0.0.1:7117"],Name:"Test"}};
      var Extractor={};
      var Aggregator={};
      if($rootScope.LogFormat=="text"){
        Extractor={Name:$rootScope.LogFormat,Config:{Delimiters: $rootScope.Delimiters,Fields:$rootScope.fields_array}};
      }else if(($rootScope.LogFormat=="json")){
        Extractor={Name:$rootScope.LogFormat,Config:{Fields:$rootScope.fields_array}};
      }else if(($rootScope.LogFormat=="lua")){
        Extractor ={Name:$rootScope.LogFormat,Config:{LuaString: $rootScope.LuaString,Fields:$rootScope.fields_array}};
      }
      var Test={TestNum:$rootScope.TestNum,Timeout:$rootScope.Time};
      $http({
        method: 'POST',
        url: '../api/logpeck/testTask',
        data: {
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          Extractor: Extractor,
          Sender: Sender,
          Aggregator: Aggregator,
          Keywords: $rootScope.Keywords,
          Test: Test,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        console.log(response);
        console.log(response.toString());
        if (response.data.err == null) {
          if (response.data.data == "null") {

          }
          var tmp = JSON.parse(response.data.data);
          $rootScope.testResults=JSON.stringify(tmp, null, 4);
          $rootScope.error={"color":"#2d2d2d"};
        } else {
          $rootScope.testArea=true;
          $rootScope.testResults = response.data.err;
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
          Extractor: config.Extractor,
          Sender: config.Sender,
          Aggregator: config.Aggregator,
          Keywords: $rootScope.Keywords,
        },
      }).then(function successCallback(response) {
        if (response.data.err == null) {
          $rootScope.TemplateList.push($rootScope.template_name);
          $rootScope.testResults = "Add success";
          $rootScope.template_name ="";
        } else {
          $rootScope.testArea=true;
          $rootScope.testResults = response.data.err;
          $rootScope.error={"color":"#ff0000"};
        }
        for(var key in $rootScope.InfluxdbArray) {
          var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
          for(var key2 in $rootScope.InfluxdbArray[key]["Aggregations"]){
            Aggregations[$rootScope.InfluxdbArray[key]["Aggregations"][key2]]=true;
          }
          $rootScope.InfluxdbArray[key]["Aggregations"]=Aggregations;
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };

  $rootScope.removeTemplate = function ($event) {
    var template_name = event.target.getAttribute('name');
    if(!confirm("Remove " + template_name)){
      return;
    }
    $rootScope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/removeTemplate',
      data:{template_name: template_name},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        $rootScope.TemplateList=response.data.data;
      } else {
        $rootScope.testArea=true;
        $rootScope.testResults = response.data.err;
        $rootScope.error={"color":"#ff0000"};
      }
    }, function errorCallback() {
    });
  };


  //Apply a template
  $rootScope.applyTemplate = function ($event){
    $rootScope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/applyTemplate',
      data:{template_name: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      console.log(response);
      if (response.data.err == null) {
        $rootScope.useTemplate=true;
        $rootScope.show_task(response.data.data);
        $rootScope.luaLoad();
      } else {
        $rootScope.testArea=true;
        $rootScope.testResults = response.data.err;
        $rootScope.error={"color":"#ff0000"};
      }

    }, function errorCallback() {
    });
  };

  function Callback(response) {
    if(response.err==null){
      $rootScope.task_ip = response.data;
      $rootScope.task_ip_exist = true;
      window.location.href = "#/";
    }else {
      $rootScope.testArea=true;
      $rootScope.testResults = response.err;
      $rootScope.error={"color":"#ff0000"};
    }
  }

  $rootScope.list=function (Callback) {
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      console.log
      if (response.data.err == null) {
        var name;
        var stat;
        var start;
        var logpath;
        var array=[];
        for (var Name in response.data.data.configs) {
          name=Name;
          logpath=response.data.data.configs[Name]['LogPath'];
          stat=response.data.data.stats[Name]['Stop'];
          start=!stat;
          array.push({name:name,logpath:logpath,stop:stat,start:start});
        }
        Callback({data:array,err:null});
      } else {
        Callback({data:null,err:response.data.err});
      }
    }, function errorCallback(err) {
      console.log('err');
      Callback({data:null,err:err});
    });
  };

});