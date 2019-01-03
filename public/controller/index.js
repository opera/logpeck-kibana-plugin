//**************************controller "logpeckInit"****************************
import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

var app=uiModules.get("app",['ui.ace']);
app.controller('logpeckInit',function ($scope , $rootScope, $route, $http, $interval, $timeout) {

  //Init
  $scope.showEdit={};
  var init=function(){
    $rootScope.mycolor1={"color":"#e4e4e4"};
    $rootScope.mycolor2={"color":"#e4e4e4"};
    $rootScope.mycolor3={"color":"#e4e4e4"};
    $rootScope.mycolor4={"color":"#e4e4e4"};
    $rootScope.mycolor5={"color":"#e4e4e4"};
    $rootScope.mycolor6={"color":"#e4e4e4"};
    $rootScope.mycolor7={"color":"#e4e4e4"};
    $rootScope.mycolor8={"color":"#e4e4e4"};
    $rootScope.mycolor9={"color":"#e4e4e4"};
    $rootScope.page="init";
    $scope.visible=false;
    $scope.gvisible=false;

    $scope.showGroup=false;
    $scope.logstat1=true;
    $scope.logstat2=false;
    $rootScope.useTemplate=false;
    $scope.T_IpList=[];
    $http({
      method: 'POST',
      url: '../api/logpeck/init',
      data: {local_ip: myConfig.local_ip},
    }).then(function successCallback(response) {
      $scope.allList=[];
      for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
        $scope.allList.push(response['data']['hits']['hits'][id]['_id']);
        if(response['data']['hits']['hits'][id]['_source']['exist']=="true"){
          if(response['data']['hits']['hits'][id]['_source']['version']==myConfig.version){
            status[response['data']['hits']['hits'][id]['_id']]="#2f99c1";
          }else{
            status[response['data']['hits']['hits'][id]['_id']]="#F39C12";
          }
        }else{
          status[response['data']['hits']['hits'][id]['_id']]="#e8488b";
        }
      }
      if(task_ip_exist!=false){
        $scope.T_array=task_ip;
        $scope.visible=true;
        $scope.gvisible=false;

        task_ip_exist=false;
        task_ip=[];
      }
      else {
        $rootScope.T_ip="";
        $scope.T_array = [];            //index:   tasklist
        $scope.visible = false;
        $scope.gvisible=true;
      }
      $scope.search_group();
      if($rootScope.GroupName==undefined){
        $rootScope.GroupName="All";
        $scope.T_IpList=$scope.allList;
      }else if($rootScope.GroupName=="All"){
        $scope.T_IpList=$scope.allList;
      }else{
        $scope.listGroup($rootScope.GroupName);
      }

    }, function errorCallback() {
      console.log('err');
    });
  }
  init();

  $scope.search_group =function(){
    $http({
      method: 'POST',
      url: '../api/logpeck/searchGroup',
      data: {local_ip: myConfig.local_ip},
    }).then(function successCallback(response) {
      $scope.GroupMap={};
      $scope.GroupMap=response['data'];
      $scope.GroupList=[];
      for(var k in $scope.GroupMap){
        $scope.GroupList.push(k);
        $scope.showEdit[k]=true;
      }
    }, function errorCallback() {
      console.log('err');
    });
  };

  $scope.addGroup=function(){
    if ($scope.Group == ""||$scope.Group ==undefined) {
      $scope.indexLog = "Group name is null";
      $scope.logstat1=true;
      $scope.logstat2=false;
    }
    else{
      $http({
        method: 'POST',
        url: '../api/logpeck/addGroup',
        data: {Group: $scope.Group,local_ip: myConfig.local_ip},
      }).then(function successCallback(response) {
        if (response['data']['result'] == "Add group success") {
          $scope.GroupList.push($scope.Group);
          $scope.showEdit[$scope.Group]=true;
          $scope.logstat1=false;
          $scope.logstat2=true;
          $scope.indexLog="Add group success";
        }
        else{
          $scope.logstat1=true;
          $scope.logstat2=false;
          $scope.indexLog=response['data']['result'];
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  }

  $scope.removeGroup = function(name) {
    if(!confirm("Remove a group")){
      return;
    }
    $http({
      method: 'POST',
      url: '../api/logpeck/removeGroup',
      data:{Group: name,local_ip: myConfig.local_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data']['result'] == "Remove group success"){
        var list = [];
        for (var id=0 ; id<$scope.GroupList.length ; id++) {
          if(name!=$scope.GroupList[id]) {
            list.push($scope.GroupList[id]);
          }
        }
        $scope.T_IpList=[];
        $scope.showGroup=false;
        $scope.GroupList=list;
      }
      else{
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response['data']['result'];
      }
    }, function errorCallback() {
    });
  };

  $scope.listGroup = function (name) {
    $scope.indexLog="";
    $rootScope.GroupName=name;
    $http({
      method: 'POST',
      url: '../api/logpeck/searchGroup',
      data:{local_ip: myConfig.local_ip},
    }).then(function successCallback(response) {
      $scope.GroupMap={};
      $scope.GroupMap=response['data'];
      $scope.GroupList=[];
      for(var k in $scope.GroupMap){
        $scope.GroupList.push(k);
        $scope.showEdit[k]=true;
      }
      $scope.T_IpList=$scope.GroupMap[$rootScope.GroupName];
      console.log($scope.T_IpList);
      $scope.showGroup=false;
    }, function errorCallback() {
      console.log('err');
    });
  };

  $scope.editGroup = function (name) {
    $scope.indexLog="";
    $scope.T_IpList=$scope.allList;
    $scope.showGroup=true;
    for(var k in $scope.showEdit){
      $scope.showEdit[k]=true;
    }
    $scope.showEdit[name]=false;
    $scope.GroupCheck={};
    for(var i=0;i<$scope.T_IpList.length;i++){
      $scope.GroupCheck[$scope.T_IpList[i]]=false;
    }
    for(var i=0;i<$scope.GroupMap[name].length;i++){
      $scope.GroupCheck[$scope.GroupMap[name][i]]=true;
    }
  };

  $scope.updateGroup = function (name) {
    $rootScope.GroupName=name;
    $scope.showGroup=false;
    $scope.showEdit[$rootScope.GroupName]=true;
    var list=[];
    for(var k in $scope.GroupCheck){
      if($scope.GroupCheck[k]==true){
        list.push(k);
      }
    }
    $scope.T_IpList=list;
    $http({
      method: 'POST',
      url: '../api/logpeck/updateGroup',
      data: {GroupMembers:list,Group:$rootScope.GroupName,local_ip: myConfig.local_ip},
    }).then(function successCallback(response) {
      if (response['data']['result'] == "update group success") {
        $scope.logstat1=false;
        $scope.logstat2=true;
        $scope.indexLog="update group success";
        $scope.GroupMap[$rootScope.GroupName]=$scope.T_IpList;
      }
      else{
        $scope.T_IpList=[];
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response['data']['result'];
      }
    }, function errorCallback() {
      console.log('err');
    });
  };

  $scope.tag_list = function (){
    $rootScope.GroupName="All";
    init();
  }
  $scope.selectGroupMember=function(key){
    if($scope.GroupCheck[key]===false){
      $scope.GroupCheck[key]=true;
    }else{
      $scope.GroupCheck[key]=false;
    }
  };

  //refresh
  var timer = $interval(function(){
    var t = [];

    $http({
      method: 'POST',
      url: '../api/logpeck/refresh',
      data:{local_ip: myConfig.local_ip},
    }).then(function successCallback(response2) {

    }, function errorCallback(err) {
      console.log('err2');
    });

    $http({
      method: 'POST',
      url: '../api/logpeck/init',
      data: {local_ip: myConfig.local_ip},
    }).then(function successCallback(response) {
      for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
        if(response['data']['hits']['hits'][id]['_source']['exist']=="true"){
          if(response['data']['hits']['hits'][id]['_source']['version']==myConfig.version){
            t[response['data']['hits']['hits'][id]['_id']]="#2f99c1";
          }else{
            t[response['data']['hits']['hits'][id]['_id']]="#F39C12";
          }
        }else{
          t[response['data']['hits']['hits'][id]['_id']]="#e8488b";
        }
      }
    }, function errorCallback(err) {
      console.log('err1');
    });
    status = t;
  },1,1);
  $scope.$on('$destroy',function(){
    $interval.cancel(timer);
  });
  $scope.set_color = function (ip,click_ip) {
    if(ip==click_ip){
      return { color: status[ip], backgroundColor:"#d4d4d4"};
    }else{
      return { color: status[ip],backgroundColor: "#e4e4e4" };
    }
  }

  //A host task list
  $scope.listTask = function (name) {
    $rootScope.T_ip=name;
    localStorage.setItem("T_ip",name);
    $scope.indexLog ='';
    $rootScope.list(callback_listTask);
  }
  function callback_listTask(response) {
    if(response["err"]==null){
      $scope.visible = true;
      $scope.gvisible=false;
      $scope.T_array=response["result"];
    }else {
      $scope.logstat1=true;
      $scope.logstat2=false;
      $scope.indexLog =response["err"];
      $scope.T_array = [];
    }
  }


  //Start Task
  $scope.startTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/start',
      data: {Name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data']['result']!="Start Success"){
        $scope.indexLog =response['data']['result'];
        $scope.logstat1=true;
        $scope.logstat2=false;
        // $scope.T_array[]
      }
      else{
        $scope.logstat1=false;
        $scope.logstat2=true;
        $scope.indexLog="Start Success";
        $scope.T_array[key]['stop']=false;
        $scope.T_array[key]['start']=true;
      }
    }, function errorCallback() {
    });
  };


  //Stop Task
  $scope.stopTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/stop',
      data: {Name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data']['result']!="Stop Success"){
        $scope.indexLog =response['data']['result'];
        $scope.logstat1=true;
        $scope.logstat2=false;
      }
      else{
        $scope.logstat1=false;
        $scope.logstat2=true;
        $scope.indexLog="Stop Success";
        $scope.T_array[key]['stop']=true;
        $scope.T_array[key]['start']=false;
      }
    }, function errorCallback() {
    });
  };


  //Remove Task
  $scope.removeTask = function ($event,list) {
    if(!confirm("Remove a task")){
      return;
    }
    $http({
      method: 'POST',
      url: '../api/logpeck/remove',
      data: {Name: event.target.getAttribute('name'),ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      if(response['data']['result']=="Remove Success") {
        $rootScope.list(callback_listTask);
      }else {
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response['data']['result'];
      }
    }, function errorCallback() {
    });
  };

  //Add Host
  $scope.addHost = function () {
    if ($scope.IP == ""||$scope.IP==undefined) {
      $scope.addHostResult = "host not exist";
    }
    else{
      $http({
        method: 'POST',
        url: '../api/logpeck/addHost',
        data: {ip: $scope.IP,local_ip: myConfig.local_ip},
      }).then(function successCallback(response) {
        if (response['data']['result'] == "Add success") {
          $scope.allList.push($scope.IP);
          $scope.T_array=[];
          $scope.logstat1=false;
          $scope.logstat2=true;
          $scope.indexLog="Add success";

          $http({
            method: 'POST',
            url: '../api/logpeck/version',
            data: {ip: $scope.IP,local_ip: myConfig.local_ip},
          }).then(function successCallback(response) {
            if(response['data']==myConfig.version){
              status[$scope.IP]="#2f99c1";
            }else if(response['data']=="error"){
              status[$scope.IP]="#e8488b";
            } else{
              status[$scope.IP]="#F39C12";
            }
          }, function errorCallback() {
            console.log('err');
          });

        }
        else{
          $scope.logstat1=true;
          $scope.logstat2=false;
          $scope.indexLog=response['data']['result'];
        }
      }, function errorCallback() {
        console.log('err');
      });
    }
  };
  //remove host
  $scope.removeHost = function ($event) {
    if(!confirm("Remove a host")){
      return;
    }
    $http({
      method: 'POST',
      url: '../api/logpeck/removeHost',
      data:{ip: event.target.getAttribute('name'),local_ip: myConfig.local_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data']['result'] != "err"&&response['data']['result']!="Ip not exist"){
        var new_arr = [];
        for (var id=0 ; id<$scope.T_IpList.length ; id++) {
          if(response['data']['result']!=$scope.T_IpList[id]) {
            new_arr.push($scope.T_IpList[id]);
          }
        }
        $scope.T_IpList=new_arr;
        $scope.T_array=[];
      }
      else{
        $scope.indexLog=response['data']['result'];
      }
    }, function errorCallback() {
    });
  };

  //click task link
  $scope.updateList= function ($event) {
    var name=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      if(response['data']["result"]==undefined) {
        localStorage.setItem("update_ip", angular.toJson(response['data']["configs"][name]));
        window.location.href = "#/updateTask";
      }
      else{
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog =response['data']['result'];
      }
    }, function errorCallback(err) {
      console.log('err');
      $scope.logstat1=true;
      $scope.logstat2=false;
      $scope.indexLog =err;
    });
  };

});