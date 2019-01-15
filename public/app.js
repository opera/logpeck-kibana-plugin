import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import 'ui/autoload/styles';

import logpeckMain from './templates/logpeck_main.html';
import logpeckTask from './templates/logpeck_task.html';

import './controller/main_handle.js';
import './controller/task_handle.js';

import * as myConfig from './logpeckConfig.js';

uiRoutes.enable();
uiRoutes
  .when('/', {
    template : logpeckMain,
    controller : 'logpeckMain',
  })
  .when('/addTask', {
    template : logpeckTask,
  controller : 'logpeckTask',
  })
  .when('/updateTask', {
    template : logpeckTask,
    controller : 'logpeckTask',
  })
  .otherwise({redirectTo:'/'});

var app=uiModules.get("app",[]);
app.run(function($rootScope, $route, $http, $location) {
  $rootScope.TaskIP = "";
  $rootScope.TaskList = [];
  $rootScope.GroupName = "All";

  $rootScope.DefaultLogpeckIP = myConfig.DefaultLogpeckIP;
  $rootScope.DefaultName = myConfig.TaskName;
  $rootScope.DefaultLogPath = myConfig.LogPath;

  $rootScope.list = function (callback) {
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: $rootScope.TaskIP},
    }).then(function successCallback(response) {
      if (response.data.err == null) {
        var name, stat, start, logpath;
        var array = [];
        for (var Name in response.data.data.configs) {
          name = Name;
          logpath = response.data.data.configs[Name]['LogPath'];
          stat = response.data.data.stats[Name]['Stop'];
          start = !stat;
          array.push({name:name,logpath:logpath,stop:stat,start:start});
        }
        callback({data:array,err:null});
      } else {
        callback({data:null,err:response.data.err});
      }
    });
  };
});

/*
const app = uiModules.get('apps/logpeckKibanaPlugin');

app.config($locationProvider => {
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false,
    rewriteLinks: false,
  });
});
app.config(stateManagementConfigProvider =>
  stateManagementConfigProvider.disable()
);

function RootController($scope, $element, $http) {
  const domNode = $element[0];

  // render react to DOM
  render(<Main title="logpeck_kibana_plugin" httpClient={$http} />, domNode);

  // unmount react on controller destroy
  $scope.$on('$destroy', () => {
    unmountComponentAtNode(domNode);
  });
}

chrome.setRootController('logpeckKibanaPlugin', RootController);
*/