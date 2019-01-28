//**************************controller "logpeckInit"****************************
import { uiModules } from 'ui/modules';
import * as myConfig from "../../logpeckConfig";

var app = uiModules.get("app",[]);
app.controller('logpeckMain',function ($scope , $rootScope, $http) {
  var init = function() {
    $scope.showTask = false;
    $scope.showGroup = false;
    $scope.logstat = false;
    $scope.showGroupEdit = false;
    $scope.showEdit = {};

    $scope.addHostIP = "";
    $scope.addHostPort = myConfig.DefaultLogpeckPort;
    $scope.hostList = [];
    $scope.hostListAll = [];
    $scope.hostStatus = [];

    $scope.addGroupName = "";
    $scope.groupList = [];
    $scope.groupCheck = {};

    $scope.indexLog = "";
    $http({
      method: 'POST',
      url: '../api/logpeck/init',
    }).then(function successCallback(response) {
      //list task
      if ($rootScope.TaskIP != "") {
        $scope.showTask = true;
        $scope.showGroup = false;
      } else {
        $scope.showTask = false;
        $scope.showGroup = true;
      }
      //list host
      var hostList = getVersion(response.data.data)
      if ($rootScope.GroupName == "All") {
        $scope.hostList = hostList;
        $scope.hostListAll = hostList;
      } else {
        $scope.listGroupMember($rootScope.GroupName);
      }
      //list group
      $scope.listGroup();
    });
  }
  init();

  function getVersion(data) {
    var hostList = [];
    for (var id in data) {
      hostList.push(data[id].host);
      if (data[id].version) {
        if (data[id].version == myConfig.Version) {
          $scope.hostStatus[data[id].host] = "#2f99c1";
        } else {
          $scope.hostStatus[data[id].host] = "#F39C12";
        }
      } else {
        $scope.hostStatus[data[id].host] = "#e8488b";
      }
    }
    return hostList
  }

  //Add Host
  $scope.addHost = function () {
    if ($scope.addHostIP == "" || $scope.addHostPort == "") {
      $scope.logstat = false;
      $scope.indexLog = "host port is not complete";
    } else {
      var host = $scope.addHostIP + ":" + $scope.addHostPort
      $http({
        method: 'POST',
        url: '../api/logpeck/addHost',
        data: {ip: host},
      }).then(function successCallback(response) {
        if (response.data.err == null) {
          $http({
            method: 'POST',
            url: '../api/logpeck/version',
            data: {ip: host},
          }).then(function successCallback(response) {
            if (response.data.data) {
              if (response.data.data == myConfig.Version) {
                $scope.hostStatus[host] = "#2f99c1";
              } else {
                $scope.hostStatus[host] = "#F39C12";
              }
            } else {
              $scope.hostStatus[host] = "#e8488b";
            }
            $scope.hostList.push(host);
            $rootScope.TaskIP = "";
            $rootScope.TaskList = [];
            $scope.logstat = true;
            $scope.indexLog = "Add success";
          });
        } else {
          $scope.logstat = false;
          $scope.indexLog = response.data.err;
        }
      });
    }
  };

  //remove host
  $scope.removeHost = function ($event) {
    $scope.indexLog = "";
    if(!confirm("Remove a host")){
      return;
    }
    $http({
      method: 'POST',
      url: '../api/logpeck/removeHost',
      data:{ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        $scope.hostList = response.data.data;
        $rootScope.TaskIP = "";
        $rootScope.TaskList = [];
      } else {
        $scope.logstat = false;
        $scope.indexLog = response.data.err;
      }
    });
  };

  $scope.addGroup=function(){
    if ($scope.addGroupName == "") {
      $scope.indexLog = "Group name is null";
      $scope.logstat = false;
    } else {
      $http({
        method: 'POST',
        url: '../api/logpeck/addGroup',
        data: {Group: $scope.addGroupName},
      }).then(function successCallback(response) {
        if (response.data.err == null) {
          $scope.groupList.push($scope.addGroupName);
          $scope.showEdit[$scope.addGroupName] = true;
          $scope.logstat = true;
          $scope.indexLog = "Add group success";
        } else {
          $scope.logstat = false;
          $scope.indexLog = response.data.err;
        }
      });
    }
  }

  $scope.removeGroup = function(name) {
    $scope.indexLog = "";
    if(!confirm("Remove a group")){
      return;
    }
    $http({
      method: 'POST',
      url: '../api/logpeck/removeGroup',
      data:{Group: name},
    }).then(function successCallback(response) {
      if(response.data.err == null){
        $scope.showGroupEdit = false;
        $scope.groupList = response.data.data;
      } else {
        $scope.logstat=false;
        $scope.indexLog=response.data.err;
      }
    });
  };

  $scope.listGroup =function(){
    $scope.indexLog = "";
    $http({
      method: 'POST',
      url: '../api/logpeck/listGroup',
    }).then(function successCallback(response) {
      if(response.data.err == null) {
        $scope.groupList = [];
        for (var i in response.data.data) {
          $scope.groupList.push(response.data.data[i]);
          $scope.showEdit[response.data.data[i]] = true;
        }
      } else {
        $scope.logstat = false;
        $scope.indexLog = response.data.err;
      }
    });
  };

  $scope.listGroupMember = function (name) {
    $scope.indexLog = "";
    $rootScope.GroupName = name;
    $http({
      method: 'POST',
      url: '../api/logpeck/listGroupMember',
      data:{Group:$rootScope.GroupName},
    }).then(function successCallback(response) {
      if(response.data.err == null) {
        $http({
          method: 'POST',
          url: '../api/logpeck/versions',
          data: {hosts: response.data.data},
        }).then(function successCallback(response) {
          console.log(response)
          var hostList = getVersion(response.data.data)
          $scope.hostList = hostList;
          $scope.showGroupEdit = false;
        });
      } else {
        $scope.logstat = false;
        $scope.indexLog = response.data.err;
      }
    });
  };

  $scope.editGroup = function (name) {
    $scope.indexLog = "";
    $scope.showGroupEdit = true;
    for (var k in $scope.showEdit) {
      $scope.showEdit[k] = true;
    }
    $scope.showEdit[name] = false;
    $scope.groupCheck = {};
    $scope.hostList = $scope.hostListAll;
    for (var i = 0; i < $scope.hostList.length; i++) {
      $scope.groupCheck[$scope.hostList[i]] = false;
    }
    console.log("group name", name);
    $http({
      method: 'POST',
      url: '../api/logpeck/listGroupMember',
      data:{Group:name},
    }).then(function successCallback(response) {
      console.log("member",response );
      if (response.data.err == null) {
        for (var i = 0; i < response.data.data.length; i++) {
          $scope.groupCheck[response.data.data[i]] = true;
        }
      } else {
        $scope.logstat = false;
        $scope.indexLog = response.data.err;
      }
    });
  };

  $scope.updateGroup = function (name) {
    $scope.showGroupEdit = false;
    $scope.showEdit[name] = true;
    var list = [];
    for (var k in $scope.groupCheck) {
      if ($scope.groupCheck[k] == true) {
        list.push(k);
      }
    }
    $scope.hostList=list;
    $http({
      method: 'POST',
      url: '../api/logpeck/updateGroup',
      data: {GroupMembers:list,Group:name},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        $scope.logstat = true;
        $scope.indexLog = "update group success";
      } else {
        $scope.hostList = [];
        $scope.logstat = false;
        $scope.indexLog = response.data.err;
      }
    });
  };

  //A host task list
  $scope.listTask = function (name) {
    $rootScope.TaskIP = name;
    localStorage.setItem("TaskIP", name);
    $scope.indexLog = '';
    $rootScope.list(callback_listTask);
  }

  //Start Task
  $scope.startTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/start',
      data: {Name: $rootScope.TaskList[key]['name'],ip: $rootScope.TaskIP},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        if (response.data.data != "Start Success") {
          $scope.indexLog = response.data.data;
          $scope.logstat = false;
        } else {
          $rootScope.TaskList[key]['stop'] = false;
          $rootScope.TaskList[key]['start'] = true;
          $scope.indexLog = response.data.data;
          $scope.logstat = true;
        }
      } else {
        $scope.indexLog = response.data.err;
        $scope.logstat = false;
      }
    });
  };


  //Stop Task
  $scope.stopTask = function ($event) {
    $scope.indexLog = '';
    var key = event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/stop',
      data: {Name: $rootScope.TaskList[key]['name'], ip: $rootScope.TaskIP},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        if (response.data.data != "Stop Success") {
          $scope.indexLog = response.data.data;
          $scope.logstat = false;
        }
        else {
          $rootScope.TaskList[key]['stop'] = true;
          $rootScope.TaskList[key]['start'] = false;
          $scope.indexLog = response.data.data;
          $scope.logstat = true;
        }
      } else {
        $scope.indexLog = response.data.err;
        $scope.logstat = false;
      }
    });
  };


  //Remove Task
  $scope.removeTask = function ($event,list) {
    $scope.indexLog = "";
    if(!confirm("Remove a task")){
      return;
    }
    $http({
      method: 'POST',
      url: '../api/logpeck/remove',
      data: {Name: event.target.getAttribute('name'),ip: $rootScope.TaskIP},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        if (response.data.data == "Remove Success") {
          $rootScope.list(callback_listTask);
        } else {
          $scope.logstat = false;
          $scope.indexLog = response.data.data;
        }
      } else {
        $scope.logstat = false;
        $scope.indexLog = response.data.err;
      }
    });
  };

  //click task link
  $scope.updateList = function ($event) {
    $scope.indexLog = "";
    var name = event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: $rootScope.TaskIP},
    }).then(function successCallback(response) {
      if(response.data.err == null) {
        localStorage.setItem("TaskInfo", angular.toJson(response.data.data.configs[name]));
        window.location.href = "#/updateTask";
      } else {
        $scope.logstat = false;
        $scope.indexLog = response.data.err;
      }
    });
  };

  function callback_listTask(response) {
    $scope.showTask = true;
    $scope.showGroup = false;
    if(response.err == null){
      $rootScope.TaskList = response.data;
    }else {
      $scope.logstat = false;
      $scope.indexLog = response.err;
      $rootScope.TaskList = [];
    }
  }

  $scope.jumpMain = function () {
    localStorage.setItem("TaskIP", "");
    $rootScope.TaskIP = "";
    $rootScope.GroupName = "All";
    init();
  }

  $scope.selectGroupMember = function(key) {
    if ($scope.groupCheck[key] == false) {
      $scope.groupCheck[key] = true;
    } else {
      $scope.groupCheck[key] = false;
    }
  };

  $scope.set_color = function (ip, click_ip) {
    if(ip == click_ip){
      return { color: $scope.hostStatus[ip], backgroundColor:"#d4d4d4"};
    }else{
      return { color: $scope.hostStatus[ip],backgroundColor: "#e4e4e4" };
    }
  }

});