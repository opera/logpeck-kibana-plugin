//************************controller "logpeckAdd"******************************
import { uiModules } from 'ui/modules';

//******************Code Editor********************
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import 'brace/theme/github';
import 'brace/mode/lua';
import 'brace/snippets/lua';
import 'brace/ext/language_tools';

import {
  EuiCodeEditor,
} from '@elastic/eui';

var luaString;
export class CodeEditor extends Component {
  state = {
    value: '--example:client=105.160.71.175 method=GET status=404\nfunction extract(s)\n'+
    '    ret = {}\n'+
    '    --*********此线下可修改*********\n'+
    '    i,j=string.find(s,\'client=.- \')\n'+
    '    ret[\'client\']=string.sub(s,i+7,j-1)\n'+
    '    i,j=string.find(s,\'method=.- \')\n'+
    '    ret[\'method\']=string.sub(s,i+7,j-1)\n'+
    '    --*********此线上可修改*********\n'+
    '    return ret\n'+
    'end'
  };

  onChange = (value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div ng-model="$root.LuaString">
      <EuiCodeEditor
    mode="lua"
    theme="github"
    width="100%"
    height='250px'
    value={this.state.value}
    onChange={(value) => {
      this.setState({ value });
    }}
    setOptions={{
      fontSize: '14px',
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
    }}
    onBlur={() => { console.log('blur'); }} // eslint-disable-line no-console
    aria-label="Code Editor"
      />
      </div>
  );
  }
}

var app=uiModules.get("app",[]);
app.controller('logpeckAdd',function ($scope , $rootScope, $route, $http, $interval) {
  ReactDOM.render(<CodeEditor />, document.getElementById('CodeEditor'));

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