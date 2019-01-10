//************************controller "logpeckAdd"******************************
import { uiModules } from 'ui/modules';

var app=uiModules.get("app",[]);
app.controller('logpeckAdd',function ($scope , $rootScope, $route, $http, $interval) {
  $rootScope.luaLoad();
  //init
  $rootScope.page="add";

  $rootScope.T_ip=localStorage.getItem("T_ip");
  $rootScope.init_task();

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
        if (response.data.err == null) {
          if(response.data.data=="Add Success") {
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
      }, function errorCallback(err) {
        $rootScope.testArea=true;
        $rootScope.testResults = err;
        $rootScope.error={"color":"#ff0000"};
      });
    }
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

});