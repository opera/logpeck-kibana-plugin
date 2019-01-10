//********************controller "logpeckUpdate"***************************
import { uiModules } from 'ui/modules';

var app=uiModules.get("app",[]);
app.controller('logpeckUpdate',function ($scope , $rootScope, $route, $http) {

  $rootScope.page="update";
  //init
  var update_ip=angular.fromJson(localStorage.getItem("update_ip"));
  $rootScope.T_ip=localStorage.getItem("T_ip");
  $rootScope.init_task();
  $rootScope.show_task(update_ip);
  $rootScope.luaLoad();

  $http({
    method: 'POST',
    url: '../api/logpeck/list_template',
    data:{},
  }).then(function successCallback(response) {
    $rootScope.TemplateList=[];
    for (var id in response.data.data) {
      $rootScope.TemplateList.push(response.data.data[id]);
    }
  }, function errorCallback(err) {
    console.log('err');
  });

  //update
  $scope.updateTask = function () {
    for(var key in $rootScope.comply_rules){
      if($rootScope.comply_rules[key]==true){
        alert("Only letters,numbers,- and _ are allowed");
        return;
      }
    }
    if($rootScope.init_add_or_update()==true){
      var config=$rootScope.get_configs()
      $http({
        method: 'POST',
        url: '../api/logpeck/updateTask',
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
        if (response.data.err == null) {
          if(response.data.data == "Update Success") {
            $rootScope.list(Callback);
          }
          else {
            $rootScope.testArea=true;
            $rootScope.testResults = response.data.data;
            $rootScope.error={"color":"#ff0000"};
          }
        } else {
          $rootScope.testArea=true;
          $rootScope.testResults = response.data.err;
          $rootScope.error={"color":"#ff0000"};
        }
      }, function errorCallback() {
      });
    }
  };
  function Callback(response) {
    if(response["err"]==null){
      $rootScope.task_ip = response["result"];
      $rootScope.task_ip_exist = true;
      window.location.href = "#/";
    }else {
      $rootScope.testArea=true;
      $rootScope.testResults = response["err"];
      $rootScope.error={"color":"#ff0000"};
    }
  }

});
