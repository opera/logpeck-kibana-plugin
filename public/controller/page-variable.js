//*************the share function of 'Add' and 'Update'******************
import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

var app=uiModules.get("app",[]);
app.run(function($rootScope, $route, $http) {
  $rootScope.task_ip_exist=false;
  $rootScope.task_ip=[];
  $rootScope.status=[];
  $rootScope.default_logpeck_ip = myConfig.DefaultLogpeckIp;

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

  $rootScope.LuaString = myConfig.luaString

  //init pages variable
  $rootScope.init_task=function () {
    $rootScope.InfluxdbArray=[];
    $rootScope.select_all=[];
    $rootScope.fields_array=[];

    $rootScope.Name = myConfig.TaskName;
    $rootScope.LogPath = myConfig.LogPath;
    $rootScope.ConfigName = myConfig.ConfigName;
    $rootScope.LuaString=myConfig.LuaString;

    $rootScope.esHosts = myConfig.EsHosts;
    $rootScope.esIndex = myConfig.EsIndex;
    $rootScope.esType = myConfig.EsType;
    $rootScope.esMapping = myConfig.EsMapping;

    $rootScope.influxHosts = myConfig.InfluxHosts;
    $rootScope.influxInterval = myConfig.InfluxInterval;
    $rootScope.influxDBName = myConfig.InfluxDBName;
    $rootScope.InfluxdbArray.push(myConfig.InfluxdbArray);

    $rootScope.kafkaBrokers = myConfig.KafkaBrokers;
    $rootScope.kafkaTopic = myConfig.KafkaTopic;
    $rootScope.kafkaMaxMessageBytes = myConfig.KafkaMaxMessageBytes;
    $rootScope.kafkaRequiredAcks = myConfig.KafkaRequiredAcks;
    $rootScope.kafkaTimeout= myConfig.KafkaTimeout;
    $rootScope.kafkaCompression = myConfig.KafkaCompression;
    $rootScope.kafkaPartitioner = myConfig.KafkaPartitioner;
    $rootScope.kafkaReturnErrors = myConfig.KafkaReturnErrors;
    $rootScope.kafkaFlush = myConfig.KafkaFlush;
    $rootScope.kafkaRetry = myConfig.KafkaRetry;

    $rootScope.Delimiters = myConfig.Delimiters;
    $rootScope.Keywords = myConfig.Keywords;
    $rootScope.LogFormat = myConfig.LogFormat;

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
    if ($rootScope.ConfigName=="InfluxDb") {
      for (var id = 0; id < $rootScope.InfluxdbArray.length; id++) {
        if ($rootScope.InfluxdbArray[id].Target == '' ) {
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
      $rootScope.luaDump();
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
      for(var key in $rootScope.InfluxdbArray){
        var tmp=[];
        for(var key2 in $rootScope.InfluxdbArray[key].Aggregations){
          if($rootScope.InfluxdbArray[key].Aggregations[key2]==true){
            tmp.push(key2);
          }
        }
        if(tmp.length==0){
          tmp.push("cnt");
        }
        $rootScope.InfluxdbArray[key].Aggregations=tmp;
      }

      Sender={Name:$rootScope.ConfigName,Config:{Hosts: $rootScope.influxHosts,  Database: $rootScope.influxDBName}};
      Aggregator={Enable:true,Interval: parseInt($rootScope.influxInterval),Options:$rootScope.InfluxdbArray};
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
      $rootScope.InfluxdbArray=task['Aggregator']['Options'];
      for(var key in $rootScope.InfluxdbArray)
      {
        var Aggregations={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
        for(var key2 in $rootScope.InfluxdbArray[key]["Aggregations"]){
          Aggregations[$rootScope.InfluxdbArray[key]["Aggregations"][key2]]=true;
        }
        $rootScope.InfluxdbArray[key]["Aggregations"]=Aggregations;
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

});