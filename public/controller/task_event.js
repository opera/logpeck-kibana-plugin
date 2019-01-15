import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

import {CodeEditor} from "./ui";
import ReactDOM from 'react-dom';
import React from 'react';

var app = uiModules.get("app",[]);
app.expandControllerEvent = function ($scope, $rootScope, $http, $location) {

  $scope.comply_rules=[];
  $scope.comply_rules["measurment"]=false;
  $scope.rules = function(rule_bool,key){
    if(rule_bool != true){
      $scope.comply_rules[key]=false;
    }else{
      $scope.comply_rules[key]=true;
    }
    return rule_bool;
  };

  $scope.luaDump = function(){
    $scope.luaString = document.getElementById("luastring").value;
  };
  $scope.luaLoad = function(){
    ReactDOM.render(<CodeEditor lua={$scope.luaString} />, document.getElementById('CodeEditor'));
  };

  //Change configName (Elasticsearch InfluxDb Kafka)
  $scope.configChange = function(configName){
    if(configName=="Elasticsearch"){
      $scope.elasticsearch=true;
      $scope.influxdb=false;
      $scope.kafka=false;
    }
    if(configName=="InfluxDb"){
      $scope.elasticsearch=false;
      $scope.influxdb=true;
      $scope.kafka=false;
    }
    if(configName=="Kafka"){
      $scope.elasticsearch=false;
      $scope.influxdb=false;
      $scope.kafka=true;
    }
  };

  //Change type (text json)
  $scope.typeChange= function(type) {
    if(type=="text"){
      $scope.type=true;
      $scope.type_lua=false;
    }else if(type=="json") {
      $scope.type=false;
      $scope.type_lua=false;
    } else if (type=="lua") {
      $scope.type=false;
      $scope.type_lua=true;
    }
  };

  //checkbox
  $scope.selectOne=function(string,key){
    if($scope.influxdbArray[key]['Aggregations'][string]==false){
      $scope.influxdbArray[key]['Aggregations'][string]=true;
    }else{
      $scope.influxdbArray[key]['Aggregations'][string]=false;
    }
  };
  $scope.selectAll=function(key){
    if($scope.selectAllList.hasOwnProperty(key)==false||$scope.selectAllList[key]==false){
      $scope.selectAllList[key]=true;
      $scope.influxdbArray[key]['Aggregations']={"cnt":true,"sum":true,"avg":true,"p99":true,"p90":true,"p50":true,"max":true,"min":true};
    }else{
      $scope.selectAllList[key]=false;
      $scope.influxdbArray[key]['Aggregations']={"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false};
    }
  };


  //plus influxdb config
  $scope.plusinfluxdb=function () {
    $scope.influxdbArray.push({"PreMeasurment":"","Measurment":"_default","Target":"","Aggregations":{"cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false},"Tags":[],"Timestamp":"default"});
  }
  //minus influxdb config
  $scope.minusinfluxdb=function (idx) {
    $scope.influxdbArray.splice(idx,1);
  };

  //plus influxdb tags
  $scope.plusTags=function (key) {
    console.log($scope.influxdbArray);
    $scope.influxdbArray[key]['Tags'].push("");
  };
  //minus influxdb tags
  $scope.minusTags=function (key) {
    $scope.influxdbArray[key]['Tags'].pop();
  };

  //plus fields
  $scope.plusfields=function () {
    $scope.fieldsArray.push({Name:"",Value:""});
  };
  //minus fields
  $scope.minusfields=function (idx) {
    $scope.fieldsArray.splice(idx,1);
  };

  //Input Logpath
  $scope.optionChange = function(){
    $scope.keyUp();
  };

  $scope.keyUp = function (){
    $http({
      method: 'POST',
      url: '../api/logpeck/key_up',
      data: {LogPath: $scope.logPath,
        ip: $rootScope.TaskIP,
      },
    }).then(function successCallback(response) {
      $scope.path_array=[];
      var patern = new RegExp(".*no such file or directory.*");
      if(response.data.data == "null"||patern.test(response.data.data)){
        $scope.path_array=[];
      } else {
        var data = JSON.parse(response.data.data);
        for (var id=0;id<data.length;id++){
          $scope.path_array.push(data[id]);
        }
      }
    }, function errorCallback() {
    });
  };

  //Add Delimiters
  $scope.addDefault=function () {
    $scope.delimiters='":{} ,[]';
  };
};