//**************************controller "logpeckInit"****************************
import { uiModules } from 'ui/modules';
import * as myConfig from "../logpeckConfig";

var app=uiModules.get("app",[]);
app.controller('logpeckInit',function ($scope , $rootScope, $route, $http, $interval, $timeout) {

  $scope.showEdit={};
  var init=function(){
    $rootScope.page="init";
    $scope.visible=false;
    $scope.gvisible=false;

    $scope.showGroup=false;
    $scope.IP="";                //addhost:   input IP
    $scope.logstat1=true;
    $scope.logstat2=false;
    $rootScope.useTemplate=false;
    $scope.T_IpList=[];
    $http({
      method: 'POST',
      url: '../api/logpeck/init',
      data: {},
    }).then(function successCallback(response) {
      $scope.allList=[];
      for (var id in response.data) {
        $scope.allList.push(response.data[id].data.host);
        if(response.data[id].data.version){
          if(response.data[id].data.version==myConfig.version){
            console.log(response.data[id].data.host);
            $rootScope.status[response.data[id].data.host]="#2f99c1";
          }else{
            $rootScope.status[response.data[id].data.host]="#F39C12";
          }
        }else{
          $rootScope.status[response.data[id].data.host]="#e8488b";
        }
      }
      if($rootScope.task_ip_exist!=false){
        $scope.T_array=$rootScope.task_ip;
        $scope.visible=true;
        $scope.gvisible=false;

        $rootScope.task_ip_exist=false;
        $rootScope.task_ip=[];
      } else {
        $rootScope.T_ip="";
        $scope.T_array = [];            //index:   tasklist
        $scope.visible = false;
        $scope.gvisible=true;
      }
      $scope.listGroup();
      if($rootScope.GroupName==undefined){
        $rootScope.GroupName="All";
        $scope.T_IpList=$scope.allList;
      }else if($rootScope.GroupName=="All"){
        $scope.T_IpList=$scope.allList;
      }else{
        $scope.listGroupMember($rootScope.GroupName);
      }
    }, function errorCallback() {
      console.log('err');
    });
  }
  init();

  //Add Host
  $scope.addHost = function () {
    if ($scope.IP == ""||$scope.IP==undefined) {
      $scope.addHostResult = "host not exist";
    } else {
      $http({
        method: 'POST',
        url: '../api/logpeck/addHost',
        data: {ip: $scope.IP},
      }).then(function successCallback(response) {
        if (response.data.err == null) {
          $scope.allList.push($scope.IP);
          $scope.T_array=[];
          $scope.logstat1=false;
          $scope.logstat2=true;
          $scope.indexLog="Add success";

          $http({
            method: 'POST',
            url: '../api/logpeck/version',
            data: {ip: $scope.IP},
          }).then(function successCallback(response) {
            console.log(response);
            if (response.data.data) {
              if(response['data']== myConfig.version){
                $rootScope.status[$scope.IP]="#2f99c1";
              } else{
                $rootScope.status[$scope.IP]="#F39C12";
              }
            } else {
              $rootScope.status[$scope.IP]="#e8488b";
            }
          }, function errorCallback() {
            console.log('err');
          });

        }
        else{
          $scope.logstat1=true;
          $scope.logstat2=false;
          $scope.indexLog=response.data.err;
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
      data:{ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      console.log(response);
      $scope.indexLog ='';
      if (response.data.err == null) {
        /*
        var new_arr = [];
        for (var id=0 ; id<$scope.T_IpList.length ; id++) {
          if(response.data.data != $scope.T_IpList[id]) {
            new_arr.push($scope.T_IpList[id]);
          }
        }*/

        $scope.T_IpList = response.data.data;
        $scope.T_array = [];
      } else {
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog = response.data.err;
      }
    }, function errorCallback() {
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
        data: {Group: $scope.Group},
      }).then(function successCallback(response) {
        if (response.data.err == null) {
          $scope.GroupList.push($scope.Group);
          $scope.showEdit[$scope.Group]=true;
          $scope.logstat1=false;
          $scope.logstat2=true;
          $scope.indexLog="Add group success";
        } else {
          $scope.logstat1=true;
          $scope.logstat2=false;
          $scope.indexLog=response.data.err;
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
      data:{Group: name},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response.data.err == null){
        /*
        var list = [];
        for (var id=0 ; id<$scope.GroupList.length ; id++) {
          if(name!=$scope.GroupList[id]) {
            list.push($scope.GroupList[id]);
          }
        }
        */
        $scope.showGroup=false;
        $scope.GroupList=response.data.data;
      } else {
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response.data.err;
      }
    }, function errorCallback() {
    });
  };

  $scope.listGroup =function(){
    $http({
      method: 'POST',
      url: '../api/logpeck/listGroup',
      data: {},
    }).then(function successCallback(response) {
      if(response.data.err == null) {
        $scope.GroupMap = [];
        $scope.GroupMap = response.data.data;
        $scope.GroupList = [];
        for (var i in response.data.data) {
          $scope.GroupList.push(response.data.data[i]);
          $scope.showEdit[response.data.data[i]] = true;
        }
      } else {
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response.data.err;
      }
    }, function errorCallback() {
      console.log('err');
    });
  };

  $scope.listGroupMember = function (name) {
    $scope.indexLog="";
    $rootScope.GroupName=name;
    $http({
      method: 'POST',
      url: '../api/logpeck/listGroupMember',
      data:{Group:$rootScope.GroupName},
    }).then(function successCallback(response) {
      if(response.data.err == null) {
        $scope.T_IpList = response.data.data;
        $scope.showGroup = false;
      } else {
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response.data.err;
      }
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
    $http({
      method: 'POST',
      url: '../api/logpeck/listGroupMember',
      data:{Group:$rootScope.GroupName},
    }).then(function successCallback(response) {
      if(response.data.err == null) {
        for(var i=0;i<response.data.data.length;i++){
          $scope.GroupCheck[response.data.data[i]]=true;
        }
      } else {
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response.data.err;
      }
    }, function errorCallback() {
      console.log('err');
    });
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
      if (response.data.err == null) {
        $scope.logstat1=false;
        $scope.logstat2=true;
        $scope.indexLog="update group success";
      } else {
        $scope.T_IpList=[];
        $scope.logstat1=true;
        $scope.logstat2=false;
        $scope.indexLog=response.data.err;
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

  //A host task list
  $scope.listTask = function (name) {
    $rootScope.T_ip=name;
    localStorage.setItem("T_ip",name);
    $scope.indexLog ='';
    $rootScope.list(callback_listTask);
  }
  function callback_listTask(response) {
    if(response.err==null){
      $scope.visible = true;
      $scope.gvisible=false;
      $scope.T_array=response.data;
    }else {
      $scope.logstat1=true;
      $scope.logstat2=false;
      $scope.indexLog =response.err;
      $scope.T_array = [];
    }
  }

  $scope.set_color = function (ip,click_ip) {
    if(ip==click_ip){
      return { color: $rootScope.status[ip], backgroundColor:"#d4d4d4"};
    }else{
      return { color: $rootScope.status[ip],backgroundColor: "#e4e4e4" };
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
      if (response.data.err == null) {
        if(response.data.data!="Start Success"){
          $scope.indexLog = response.data.data;
          $scope.logstat1=true;
          $scope.logstat2=false;
          // $scope.T_array[]
        } else {
          $scope.logstat1=false;
          $scope.logstat2=true;
          $scope.indexLog=response.data.data;
          $scope.T_array[key]['stop']=false;
          $scope.T_array[key]['start']=true;
        }
      } else {
        $scope.indexLog = response.data.err;
        $scope.logstat1=true;
        $scope.logstat2=false;
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
      if (response.data.err == null) {
        if (response.data.data != "Stop Success") {
          $scope.indexLog = response.data.data;
          $scope.logstat1 = true;
          $scope.logstat2 = false;
        }
        else {
          $scope.logstat1 = false;
          $scope.logstat2 = true;
          $scope.indexLog = response.data.data;
          $scope.T_array[key]['stop'] = true;
          $scope.T_array[key]['start'] = false;
        }
      } else {
        $scope.indexLog = response.data.err;
        $scope.logstat1 = true;
        $scope.logstat2 = false;
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
      if (response.data.err == null) {
        if (response.data.data == "Remove Success") {
          $rootScope.list(callback_listTask);
        } else {
          $scope.logstat1 = true;
          $scope.logstat2 = false;
          $scope.indexLog = response.data.data;
        }
      } else {
        $scope.logstat1 = true;
        $scope.logstat2 = false;
        $scope.indexLog = response.data.err;
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
      if(response.data.err == null) {
        console.log(response.data.data);
        localStorage.setItem("update_ip", angular.toJson(response.data.data.configs[name]));
        window.location.href = "#/updateTask";
      } else {
        $scope.logstat1 = true;
        $scope.logstat2 = false;
        $scope.indexLog = response.data.err;
      }
    }, function errorCallback(err) {
      console.log('err');
      $scope.logstat1=true;
      $scope.logstat2=false;
      $scope.indexLog =err;
    });
  };

});