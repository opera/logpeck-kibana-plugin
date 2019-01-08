//*************the share function of 'Add' and 'Update'******************
import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

import '../../bower_components/ace-builds/src-min-noconflict/ace.js';
import '../../bower_components/ace-builds/src-min-noconflict/mode-lua.js';
import '../../bower_components/ace-builds/src-min-noconflict/theme-crimson_editor.js';
import '../../bower_components/angular-ui-ace/ui-ace.js';

var app=uiModules.get("app",['ui.ace']);
app.run(function($rootScope, $route, $http) {
  $rootScope.task_ip_exist=false;
  $rootScope.task_ip=[];
  $rootScope.status=[];

  $rootScope.export_esHosts=myConfig.export_esHosts;
  $rootScope.export_influxHosts=myConfig.export_influxHosts;
  $rootScope.export_influxDBName=myConfig.export_influxDBName;
  $rootScope.export_kafkaBrokers=myConfig.export_kafkaBrokers;
  $rootScope.export_kafkaTopic=myConfig.export_kafkaTopic;

  $rootScope.comply_rules=[];
  $rootScope.comply_rules["measurment"]=false;
  $rootScope.rules = function(rule_bool,key){
    if(rule_bool != true){
      $rootScope.comply_rules[key]=false;
    }else{
      $rootScope.comply_rules[key]=true;
    }
    return rule_bool;
  };

  //Change configName (Elasticsearch InfluxDb Kafka)
  $rootScope.configChange = function(configName){
    if(configName=="Elasticsearch"){
      $rootScope.elasticsearch=true;
      $rootScope.influxdb=false;
      $rootScope.kafka=false;
    }
    if(configName=="InfluxDb"){
      $rootScope.elasticsearch=false;
      $rootScope.influxdb=true;
      $rootScope.kafka=false;
    }
    if(configName=="Kafka"){
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

  //Input click event
  $rootScope.focus = function (string,target,mycolor) {
    if ($rootScope[target]) {
      $rootScope[mycolor]={"color":"#2d2d2d"};
    }
    else{
      $rootScope[mycolor]={"color":"#2d2d2d"};
    }
  }
  $rootScope.blur = function (string,target,mycolor) {
    if (!$rootScope[target] ) {
      $rootScope[target] = string;
      $rootScope[mycolor]={"color":"#e4e4e4"};
    }
    else{
      $rootScope[mycolor]={"color":"#2d2d2d"};
    }
  }
  $rootScope.focus2 = function (target,mycolor) {
    if ($rootScope[target]) {
      $rootScope[mycolor]={"color":"#2d2d2d"};
    }
    else{
      $rootScope[mycolor]={"color":"#2d2d2d"};
    }
  }
  $rootScope.blur2 = function (target,mycolor) {
    if (!$rootScope[target] ) {
      $rootScope[target] = "";
      $rootScope[mycolor]={"color":"#e4e4e4"};
    }
    else{
      $rootScope[mycolor]={"color":"#2d2d2d"};
    }
  }


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
      if(response.data.data == "null"||response.data.data == 'open '+$rootScope.LogPath+'/: no such file or directory'){
        $rootScope.path_array=[];
      } else {
        for (var id=0;id<response.data.data.length;id++){
          $rootScope.path_array.push(response.data.data[id]);
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
          local_ip: myConfig.local_ip,
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
        for(var key in $rootScope.influxdb_array) {
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

  /*
  $rootScope.aceLoaded = function(_editor){
    console.log("*******************");
    var _session = _editor.getSession();
    _session.setValue($rootScope.LuaString);
    _session.on("change", function(){ $rootScope.LuaString=_session.getValue()});

    $rootScope.updateLua=function(){
      _session.setValue($rootScope.LuaString);
    }
  };
*/

  //Apply a template
  $rootScope.applyTemplate = function ($event){
    $rootScope.testArea=false;
    $http({
      method: 'POST',
      url: '../api/logpeck/applyTemplate',
      data:{template_name: event.target.getAttribute('name'),local_ip: myConfig.local_ip},
    }).then(function successCallback(response) {
      console.log(response);
      if (response.data.err == null) {
        $rootScope.useTemplate=true;
        $rootScope.show_task(response.data.data);
        //$rootScope.updateLua();
      } else {
        $rootScope.testArea=true;
        $rootScope.testResults = response.data.err;
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
    $rootScope.ConfigName = "Elasticsearch";
    $rootScope.LuaString="--example:client=105.160.71.175 method=GET status=404\n"+
      "function extract(s)\n" +
      "    ret = {}\n" +
      "    --*********此线下可修改*********\n" +
      "    i,j=string.find(s,'client=.- ')\n" +
      "    ret['client']=string.sub(s,i+7,j-1)\n" +
      "    i,j=string.find(s,'method=.- ')\n" +
      "    ret['method']=string.sub(s,i+7,j-1)\n" +
      "    --*********此线上可修改*********\n" +
      "    return ret\n" +
      "end";

    $rootScope.esHosts = $rootScope.export_esHosts;
    $rootScope.esIndex = "my_index-%{+2006.01.02}";
    $rootScope.esType = "MyType";
    $rootScope.esMapping = JSON.stringify(JSON.parse('{"MyType":{"properties": {"MyField": {"type": "long"}}}}'), null, 4);

    $rootScope.influxHosts = $rootScope.export_influxHosts;
    $rootScope.influxInterval = 30;
    $rootScope.influxDBName = $rootScope.export_influxDBName;
    $rootScope.influxdb_array.push({"PreMeasurment":"","Measurment":"_default","Target":"","Aggregations":{"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false},"Tags":[],"Timestamp":"_default"});

    $rootScope.kafkaBrokers = $rootScope.export_kafkaBrokers;
    $rootScope.kafkaTopic = $rootScope.export_kafkaTopic;
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
    if ($rootScope.ConfigName=="InfluxDb")
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
    } else if ($rootScope.ConfigName=="Elasticsearch"&&($rootScope.esHosts==""||$rootScope.esIndex==""||$rootScope.esType=="")){
      $rootScope.testArea=true;
      $rootScope.testResults = "Elasticsearch is not complete";
      $rootScope.error={"color":"#ff0000"};
      return false;
    } else if($rootScope.ConfigName=="InfluxDb"&&($rootScope.influxHosts==''||$rootScope.influxDBName==''||$rootScope.influxInterval=='')){
      $rootScope.testArea=true;
      $rootScope.testResults = "Elasticsearch is not complete";
      $rootScope.error={"color":"#ff0000"};
      return false;
    } else {
      return true;
    }
  }

  // Get the config
  $rootScope.get_configs=function(){
    var Sender;
    var Extractor;
    var Aggregator;
    if($rootScope.LogFormat=="text"){
      Extractor={Name:$rootScope.LogFormat,Config:{Delimiters: $rootScope.Delimiters,Fields:$rootScope.fields_array}};
    }else if(($rootScope.LogFormat=="json")){
      Extractor={Name:$rootScope.LogFormat,Config:{Fields:$rootScope.fields_array}};
    }else if(($rootScope.LogFormat=="lua")){
      Extractor ={Name:$rootScope.LogFormat,Config:{LuaString: $rootScope.LuaString,Fields:$rootScope.fields_array}};
    }

    if($rootScope.ConfigName=="Elasticsearch"){
      var hostsarray = $rootScope.esHosts.split(',');
      var hosts = [];
      for (var id = 0; id < hostsarray.length; id++) {
        hosts.push(hostsarray[id]);
      }
      Sender={Name:$rootScope.ConfigName,Config:{Hosts: hosts, Index: $rootScope.esIndex, Type: $rootScope.esType, Mapping: JSON.parse($rootScope.esMapping)}};
      Aggregator={Enable:false};
    }else if($rootScope.ConfigName=="InfluxDb"){
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

      Sender={Name:$rootScope.ConfigName,Config:{Hosts: $rootScope.influxHosts,  Database: $rootScope.influxDBName}};
      Aggregator={Enable:true,Interval: parseInt($rootScope.influxInterval),Options:$rootScope.influxdb_array};
    }else if ($rootScope.ConfigName="Kafka"){
      var brokersarray = $rootScope.kafkaBrokers.split(',');
      var brokers = [];
      for (var id = 0; id < brokersarray.length; id++) {
        brokers.push(brokersarray[id]);
      }
      Sender={Name:$rootScope.ConfigName,Config:{
          Brokers: brokers,Topic :$rootScope.kafkaTopic,MaxMessageBytes:parseInt($rootScope.kafkaMaxMessageBytes),Timeout:parseInt($rootScope.kafkaTimeout),
          Retry:{RetryMax:parseInt($rootScope.kafkaRetry.RetryMax), RetryBackoff:parseInt($rootScope.kafkaRetry.RetryBackoff)},
          RequiredAcks:Number($rootScope.kafkaRequiredAcks),Compression:Number($rootScope.kafkaCompression),Partitioner:$rootScope.kafkaPartitioner,ReturnErrors:$rootScope.kafkaReturnErrors,
          Flush:{FlushBytes:parseInt($rootScope.kafkaFlush.FlushBytes), FlushMessages:parseInt($rootScope.kafkaFlush.FlushMessages), FlushFrequency:parseInt($rootScope.kafkaFlush.FlushFrequency), FlushMaxMessages:parseInt($rootScope.kafkaFlush.FlushMaxMessages)}
        }};
      Aggregator={Enable:false};
    }
    return{Sender:Sender,Extractor:Extractor,Aggregator:Aggregator};
  }


  $rootScope.show_task=function (task) {
    if($rootScope.page=="update"&&$rootScope.useTemplate==true){
      $rootScope.useTemplate=false;
    }else{
      $rootScope.Name=task['Name'];
    }
    $rootScope.LogPath=task['LogPath'];
    $rootScope.LogFormat=task['Extractor']['Name'];
    $rootScope.typeChange($rootScope.LogFormat);
    if($rootScope.LogFormat=="text"){
      $rootScope.fields_array=task['Extractor']['Config']['Fields'];
      $rootScope.Delimiters=task['Extractor']['Config']['Delimiters'];
    }else if($rootScope.LogFormat=="json"){
      $rootScope.fields_array=task['Extractor']['Config']['Fields'];
    }else if($rootScope.LogFormat=="lua"){
      $rootScope.LuaString=task['Extractor']['Config']['LuaString'];
      $rootScope.fields_array=task['Extractor']['Config']['Fields'];
    }
    if($rootScope.fields_array==null){
      $rootScope.fields_array=[];
    }

    if(task['Aggregator']['Enable']==true){
      $rootScope.influxInterval = task['Aggregator']['Interval'];
      $rootScope.influxdb_array=task['Aggregator']['Options'];
      for(var key in $rootScope.influxdb_array)
      {
        var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
        for(var key2 in $rootScope.influxdb_array[key]["Aggregations"]){
          Aggregations[$rootScope.influxdb_array[key]["Aggregations"][key2]]=true;
        }
        $rootScope.influxdb_array[key]["Aggregations"]=Aggregations;
      }
    }
    $rootScope.ConfigName=task['Sender']['Name'];
    if($rootScope.ConfigName=="Elasticsearch")
    {
      $rootScope.elasticsearch=true;
      $rootScope.influxdb=false;
      $rootScope.kafka=false;

      $rootScope.esHosts=task['Sender']['Config']['Hosts'].toString();
      $rootScope.esIndex=task['Sender']['Config']['Index'];
      $rootScope.esType=task['Sender']['Config']['Type'];
      $rootScope.esMapping=JSON.stringify(task['Sender']['Config']['Mapping'],null,4);
      if($rootScope.esMapping=='null'){
        console.log("Mapping is null")
        $rootScope.esMapping="";
      }
    }else if($rootScope.ConfigName=="InfluxDb") {
      $rootScope.elasticsearch=false;
      $rootScope.influxdb=true;
      $rootScope.kafka=false;

      $rootScope.influxHosts = task['Sender']['Config']['Hosts'].toString();
      $rootScope.influxDBName = task['Sender']['Config']['Database'];
    }else if($rootScope.ConfigName=="Kafka") {
      $rootScope.elasticsearch=false;
      $rootScope.influxdb=false;
      $rootScope.kafka=true;

      $rootScope.kafkaBrokers = task['Sender']['Config']['Brokers'].toString();
      $rootScope.kafkaTopic = task['Sender']['Config']['Topic'];
      $rootScope.kafkaMaxMessageBytes = task['Sender']['Config']['MaxMessageBytes'];
      $rootScope.kafkaRequiredAcks = task['Sender']['Config']['RequiredAcks'].toString();
      $rootScope.kafkaTimeout= task['Sender']['Config']['Timeout'];
      $rootScope.kafkaCompression = task['Sender']['Config']['Compression'].toString();
      $rootScope.kafkaPartitioner = task['Sender']['Config']['Partitioner'];
      $rootScope.kafkaReturnErrors = task['Sender']['Config']['ReturnErrors'];
      $rootScope.kafkaFlush=task['Sender']['Config']['Flush'];
      $rootScope.kafkaRetry = task['Sender']['Config']['Retry'];
    }
    $rootScope.Keywords=task['Keywords'];
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