import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

import {CodeEditor} from "./ui";
import ReactDOM from 'react-dom';
import React from 'react';

var app=uiModules.get("app",[]);
app.run(function($rootScope, $route, $http) {
  $rootScope.luaDump = function(){
    $rootScope.LuaString = document.getElementById("luastring").value;
  };
  $rootScope.luaLoad = function(){
    ReactDOM.render(<CodeEditor lua={$rootScope.LuaString} />, document.getElementById('CodeEditor'));
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
    }else if(type=="json") {
      $rootScope.type=false;
      $rootScope.type_lua=false;
    } else if (type=="lua") {
      $rootScope.type=false;
      $rootScope.type_lua=true;
    }
  };

  //checkbox
  $rootScope.selectOne=function(string,key){
    if($rootScope.InfluxdbArray[key]['Aggregations'][string]==false){
      $rootScope.InfluxdbArray[key]['Aggregations'][string]=true;
    }else{
      $rootScope.InfluxdbArray[key]['Aggregations'][string]=false;
    }
  };
  $rootScope.selectAll=function(key){
    if($rootScope.select_all.hasOwnProperty(key)==false||$rootScope.select_all[key]==false){
      $rootScope.select_all[key]=true;
      $rootScope.InfluxdbArray[key]['Aggregations']={"cnt":true,"sum":true,"avg":true,"p99":true,"p90":true,"p50":true,"max":true,"min":true};
    }else{
      $rootScope.select_all[key]=false;
      $rootScope.InfluxdbArray[key]['Aggregations']={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
    }
  };


  //plus influxdb config
  $rootScope.plusinfluxdb=function () {
    $rootScope.InfluxdbArray.push({"PreMeasurment":"","Measurment":"_default","Target":"","Aggregations":{"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false},"Tags":[],"Timestamp":"default"});
  }
  //minus influxdb config
  $rootScope.minusinfluxdb=function (idx) {
    $rootScope.InfluxdbArray.splice(idx,1);
  };

  //plus influxdb tags
  $rootScope.plusTags=function (key) {
    $rootScope.InfluxdbArray[key]['Tags'].push("");
  };
  //minus influxdb tags
  $rootScope.minusTags=function (key) {
    $rootScope.InfluxdbArray[key]['Tags'].pop();
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

  //Add Delimiters
  $rootScope.addDefault=function () {
    $rootScope.Delimiters='":{} ,[]';
  };
});