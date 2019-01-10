import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import 'ui/autoload/styles';

import '../bower_components/ace-builds/src-min-noconflict/ace.js';
import '../bower_components/ace-builds/src-min-noconflict/mode-lua.js';
import '../bower_components/ace-builds/src-min-noconflict/theme-crimson_editor.js';
import '../bower_components/angular-ui-ace/ui-ace.js';

import index from './templates/index.html';
import addTask from './templates/addTask.html';
import updateTask from './templates/updateTask.html';

import './controller/index.js';
import './controller/addTask.js';
import './controller/updateTask.js';
import './controller/shared.js';
import './controller/page-variable.js';
import './controller/event.js';

import * as myConfig from './logpeckConfig.js';
/*
import React, {
  Component,
  Fragment,
} from 'react';
*/

uiRoutes.enable();
uiRoutes
  .when('/', {
    template : index,
    controller : 'logpeckInit',
  })
  .when('/addTask', {
    template : addTask,
  controller : 'logpeckAdd',
  })
  .when('/updateTask', {
    template : updateTask,
    controller : 'logpeckUpdate',
  })
  .otherwise({redirectTo:'/'});



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