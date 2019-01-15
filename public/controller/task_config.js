//*************the share function of 'Add' and 'Update'******************
import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

var app = uiModules.get("app",[]);
app.expandControllerConfig = function ($scope, $rootScope, $http, $location) {
  //init pages variable
  $scope.initTask=function () {
    $scope.influxdbArray=[];
    $scope.selectAllList=[];
    $scope.fieldsArray=[];

    $scope.name = "";
    $scope.logPath = "";
    $scope.luaString = myConfig.LuaString;
    $scope.delimiters = myConfig.Delimiters;
    $scope.keywords = myConfig.Keywords;
    $scope.logFormat = myConfig.LogFormat;
    $scope.configName = myConfig.ConfigName;

    $scope.esHosts = myConfig.EsHosts;
    $scope.esIndex = myConfig.EsIndex;
    $scope.esType = myConfig.EsType;
    $scope.esMapping = myConfig.EsMapping;

    $scope.influxHosts = myConfig.InfluxHosts;
    $scope.influxInterval = myConfig.InfluxInterval;
    $scope.influxDBName = myConfig.InfluxDBName;
    $scope.influxdbArray.push(myConfig.InfluxdbArray);

    $scope.kafkaBrokers = myConfig.KafkaBrokers;
    $scope.kafkaTopic = myConfig.KafkaTopic;
    $scope.kafkaMaxMessageBytes = myConfig.KafkaMaxMessageBytes;
    $scope.kafkaRequiredAcks = myConfig.KafkaRequiredAcks;
    $scope.kafkaTimeout= myConfig.KafkaTimeout;
    $scope.kafkaCompression = myConfig.KafkaCompression;
    $scope.kafkaPartitioner = myConfig.KafkaPartitioner;
    $scope.kafkaReturnErrors = myConfig.KafkaReturnErrors;
    $scope.kafkaFlush = myConfig.KafkaFlush;
    $scope.kafkaRetry = myConfig.KafkaRetry;

    $scope.typeChange($scope.logFormat);
    $scope.elasticsearch = true;
    $scope.influxdb = false;
    $scope.kafka = false;
    $scope.type=true;

    $scope.testArea=false;
  }

  //verify before add or update
  $scope.init_add_or_update=function() {
    var T=false;
    var measurementTargetNull=false;
    if($scope.fieldsArray!=null) {
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
    if ($scope.configName=="InfluxDb") {
      for (var id = 0; id < $scope.influxdbArray.length; id++) {
        if ($scope.influxdbArray[id].Target == '' ) {
          measurementTargetNull = true;
          break;
        }
      }
    }

    if (T) {
      $scope.testArea=true;
      $scope.testResults = "Fields is not complete";
      $scope.error={"color":"#ff0000"};
      return false;
    } else if(measurementTargetNull){
      $scope.testArea=true;
      $scope.testResults = "Measurment is not complete";
      $scope.error={"color":"#ff0000"};
      return false;
    } else if ($scope.TaskIP == ""||$scope.TaskIP ==undefined) {
      $scope.testArea=true;
      $scope.testResults = "IP is not complete";
      $scope.error={"color":"#ff0000"};
      return false;
    } else if ($scope.name==""||$scope.logPath=="") {
      $scope.testArea=true;
      $scope.testResults = "Name or LogPath is not complete";
      $scope.error={"color":"#ff0000"};
      return false;
    } else if ($scope.configName=="Elasticsearch"&&($scope.esHosts==""||$scope.esIndex==""||$scope.esType=="")) {
      $scope.testArea=true;
      $scope.testResults = "Elasticsearch is not complete";
      $scope.error={"color":"#ff0000"};
      return false;
    } else if ($scope.configName=="InfluxDb"&&($scope.influxHosts==''||$scope.influxDBName==''||$scope.influxInterval=='')) {
      $scope.testArea=true;
      $scope.testResults = "Elasticsearch is not complete";
      $scope.error={"color":"#ff0000"};
      return false;
    } else {
      return true;
    }
  }

  // Get the config
  $scope.get_configs=function(){
    var Sender;
    var Extractor;
    var Aggregator;
    if ($scope.logFormat=="text") {
      Extractor={Name:$scope.logFormat,Config:{Delimiters: $scope.delimiters,Fields:$scope.fieldsArray}};
    } else if (($scope.logFormat=="json")) {
      Extractor={Name:$scope.logFormat,Config:{Fields:$scope.fieldsArray}};
    } else if (($scope.logFormat=="lua")){
      $scope.luaDump();
      Extractor ={Name:$scope.logFormat,Config:{LuaString: $scope.luaString,Fields:$scope.fieldsArray}};
    }

    if ($scope.configName=="Elasticsearch") {
      var hostsarray = $scope.esHosts.split(',');
      var hosts = [];
      for (var id = 0; id < hostsarray.length; id++) {
        hosts.push(hostsarray[id]);
      }
      Sender={Name:$scope.configName,Config:{Hosts: hosts, Index: $scope.esIndex, Type: $scope.esType, Mapping: JSON.parse($scope.esMapping)}};
      Aggregator={Enable:false};
    } else if ($scope.configName=="InfluxDb"){
      for (var key in $scope.influxdbArray) {
        var tmp=[];
        for (var key2 in $scope.influxdbArray[key].Aggregations) {
          if ($scope.influxdbArray[key].Aggregations[key2]==true) {
            tmp.push(key2);
          }
        }
        if (tmp.length==0) {
          tmp.push("cnt");
        }
        $scope.influxdbArray[key].Aggregations=tmp;
      }

      Sender={Name:$scope.configName,Config:{Hosts: $scope.influxHosts,  Database: $scope.influxDBName}};
      Aggregator={Enable:true,Interval: parseInt($scope.influxInterval),Options:$scope.influxdbArray};
    } else if ($scope.configName="Kafka") {
      var brokersarray = $scope.kafkaBrokers.split(',');
      var brokers = [];
      for (var id = 0; id < brokersarray.length; id++) {
        brokers.push(brokersarray[id]);
      }
      Sender={Name:$scope.configName,Config:{
          Brokers: brokers,Topic :$scope.kafkaTopic,MaxMessageBytes:parseInt($scope.kafkaMaxMessageBytes),Timeout:parseInt($scope.kafkaTimeout),
          Retry:{RetryMax:parseInt($scope.kafkaRetry.RetryMax), RetryBackoff:parseInt($scope.kafkaRetry.RetryBackoff)},
          RequiredAcks:Number($scope.kafkaRequiredAcks),Compression:Number($scope.kafkaCompression),Partitioner:$scope.kafkaPartitioner,ReturnErrors:$scope.kafkaReturnErrors,
          Flush:{FlushBytes:parseInt($scope.kafkaFlush.FlushBytes), FlushMessages:parseInt($scope.kafkaFlush.FlushMessages), FlushFrequency:parseInt($scope.kafkaFlush.FlushFrequency), FlushMaxMessages:parseInt($scope.kafkaFlush.FlushMaxMessages)}
        }};
      Aggregator={Enable:false};
    }
    return{Sender:Sender,Extractor:Extractor,Aggregator:Aggregator};
  }


  $scope.show_task = function (task) {
    if ($scope.addTaskUrl == false && $scope.useTemplate == true) {
      $scope.useTemplate = false;
    } else {
      $scope.name = task['Name'];
    }
    $scope.logPath=task['LogPath'];
    $scope.logFormat=task['Extractor']['Name'];
    $scope.typeChange($scope.logFormat);
    if ($scope.logFormat=="text") {
      $scope.fieldsArray=task['Extractor']['Config']['Fields'];
      $scope.delimiters=task['Extractor']['Config']['Delimiters'];
    } else if ($scope.logFormat=="json"){
      $scope.fieldsArray=task['Extractor']['Config']['Fields'];
    } else if ($scope.logFormat=="lua"){
      $scope.luaString=task['Extractor']['Config']['LuaString'];
      $scope.fieldsArray=task['Extractor']['Config']['Fields'];
    }
    if ($scope.fieldsArray==null) {
      $scope.fieldsArray=[];
    }

    if (task['Aggregator']['Enable']==true) {
      $scope.influxInterval = task['Aggregator']['Interval'];
      $scope.influxdbArray=task['Aggregator']['Options'];
      for(var key in $scope.influxdbArray)
      {
        var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
        for(var key2 in $scope.influxdbArray[key]["Aggregations"]){
          Aggregations[$scope.influxdbArray[key]["Aggregations"][key2]]=true;
        }
        $scope.influxdbArray[key]["Aggregations"]=Aggregations;
      }
    }
    $scope.configName=task['Sender']['Name'];
    if ($scope.configName=="Elasticsearch") {
      $scope.elasticsearch=true;
      $scope.influxdb=false;
      $scope.kafka=false;

      $scope.esHosts=task['Sender']['Config']['Hosts'].toString();
      $scope.esIndex=task['Sender']['Config']['Index'];
      $scope.esType=task['Sender']['Config']['Type'];
      $scope.esMapping=JSON.stringify(task['Sender']['Config']['Mapping'],null,4);
      if($scope.esMapping=='null'){
        console.log("Mapping is null")
        $scope.esMapping="";
      }
    } else if ($scope.configName=="InfluxDb") {
      $scope.elasticsearch=false;
      $scope.influxdb=true;
      $scope.kafka=false;

      $scope.influxHosts = task['Sender']['Config']['Hosts'].toString();
      $scope.influxDBName = task['Sender']['Config']['Database'];
    } else if ($scope.configName=="Kafka") {
      $scope.elasticsearch=false;
      $scope.influxdb=false;
      $scope.kafka=true;

      $scope.kafkaBrokers = task['Sender']['Config']['Brokers'].toString();
      $scope.kafkaTopic = task['Sender']['Config']['Topic'];
      $scope.kafkaMaxMessageBytes = task['Sender']['Config']['MaxMessageBytes'];
      $scope.kafkaRequiredAcks = task['Sender']['Config']['RequiredAcks'].toString();
      $scope.kafkaTimeout= task['Sender']['Config']['Timeout'];
      $scope.kafkaCompression = task['Sender']['Config']['Compression'].toString();
      $scope.kafkaPartitioner = task['Sender']['Config']['Partitioner'];
      $scope.kafkaReturnErrors = task['Sender']['Config']['ReturnErrors'];
      $scope.kafkaFlush=task['Sender']['Config']['Flush'];
      $scope.kafkaRetry = task['Sender']['Config']['Retry'];
    }
    $scope.keywords=task['Keywords'];
  }

};