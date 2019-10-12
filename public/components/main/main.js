import React, {
  Component,
  Fragment,
} from 'react';

import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiPageSideBar,
  EuiPageHeaderSection,
  EuiPageContentHeaderSection,
  EuiText,
  EuiFieldText,
  EuiSpacer
} from '@elastic/eui';

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    /*
       FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
       manage state and update your UI than this.
    */
    const { httpClient } = this.props;
    httpClient.get('../api/logpeck-kibana-plugin/example').then((resp) => {
      this.setState({ time: resp.data.time });
    });
  }
  render() {
    const { title } = this.props;
    return (
        <EuiPage>
          <EuiPageSideBar>
            SideBar nav
          </EuiPageSideBar>
          <EuiPageSideBar>
            SideBar nav
          </EuiPageSideBar>
          <EuiPageBody>
            <EuiPageHeader>
              <EuiPageHeaderSection>
                <EuiTitle size="l">
                  <h1>Page title</h1>
                </EuiTitle>
              </EuiPageHeaderSection>
              <EuiPageHeaderSection>
               Page abilities
              </EuiPageHeaderSection>
            </EuiPageHeader>
            <EuiPageContent verticalPosition="center"  horizontalPosition="center">
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection>
                  <EuiTitle>
                    <h2>Content title</h2>
                  </EuiTitle>
                </EuiPageContentHeaderSection>
                <EuiPageContentHeaderSection>
                  Content abilities
                </EuiPageContentHeaderSection>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                Content body
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
    );
  }
}

export textField class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <Fragment>
      <EuiFieldText
    placeholder="Placeholder text"
    value={this.state.value}
    onChange={this.onChange}
    aria-label="Use aria labels when no actual label is in use"
      />

      <EuiSpacer size="m" />

      <EuiFieldText
    placeholder="Disabled"
    value={this.state.value}
    onChange={this.onChange}
    disabled
    aria-label="Use aria labels when no actual label is in use"
      />

      <EuiSpacer size="m" />

      <EuiFieldText
    placeholder="Loading"
    value={this.state.value}
    onChange={this.onChange}
    isLoading
    aria-label="Use aria labels when no actual label is in use"
      />

      <EuiSpacer size="m" />

      <EuiFieldText
    placeholder="Loading and disabled"
    value={this.state.value}
    onChange={this.onChange}
    isLoading
    disabled
    aria-label="Use aria labels when no actual label is in use"
      />

      <EuiSpacer size="m" />

      <EuiFieldText
    placeholder="Read-only"
    value={this.state.value}
    onChange={this.onChange}
    readOnly
    aria-label="Use aria labels when no actual label is in use"
      />

      <EuiSpacer size="m" />

      <EuiFieldText
    placeholder="Compressed"
    value={this.state.value}
    onChange={this.onChange}
    compressed
    />
    </Fragment>
  );
  }
}
