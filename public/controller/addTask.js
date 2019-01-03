//************************controller "logpeckAdd"******************************
import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

var app=uiModules.get("app",['ui.ace']);
app.controller('logpeckAdd',function ($scope , $rootScope, $route, $http, $interval) {
  //init
  $rootScope.page="add";

  $rootScope.T_ip=localStorage.getItem("T_ip");
  $rootScope.init_task();

  $http({
    method: 'POST',
    url: '../api/logpeck/list_template',
    data:{local_ip: myConfig.local_ip},
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
    for(var key in $rootScope.comply_rules){
      if($rootScope.comply_rules[key]==true){
        alert("Only letters,numbers,'-' and '_' are allowed");
        return;
      }
    }
    if($rootScope.init_add_or_update()==true){
      var config=$rootScope.get_configs()
      $http({
        method: 'POST',
        url: '../api/logpeck/addTask',
        data: {
          Name: $rootScope.Name,
          Logpath: $rootScope.LogPath,
          Extractor: config.Extractor,
          Sender: config.Sender,
          Aggregator: config.Aggregator,
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