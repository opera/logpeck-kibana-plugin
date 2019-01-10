//******************Code Editor********************
import React,{ Component } from 'react';

import 'brace/theme/github';
import 'brace/mode/lua';
import 'brace/snippets/lua';
import 'brace/ext/language_tools';

import {
  EuiCodeEditor,
} from '@elastic/eui';

export class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {value:props.lua};
  }

  onChange = (value) => {
    this.setState({ value });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return { value:nextProps.lua };
  }

  render() {
    return (
      <div>
      <textarea id="luastring" value={this.state.value} hidden onChange={(value) => {}}>
  </textarea>
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
      </div>
  );
  }
}