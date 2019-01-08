//******************Code Editor********************
import React, { Component } from 'react';

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
  luaString = {this.state.value}

  onChange = (value) => {
    this.setState({ value });
    luaString = {this.state.value}
  };

  render() {
    return (
      <EuiCodeEditor
    mode="lua"
    theme="github"
    width="100%"
    height='250px'
    value={this.state.value}
    onChange={this.onChange}
    setOptions={{
      fontSize: '14px',
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
    }}
    onBlur={() => { console.log('blur'); }} // eslint-disable-line no-console
    aria-label="Code Editor"
      />
  );
  }
}