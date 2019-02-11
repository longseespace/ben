import { Provider } from 'react-redux';
import * as React from 'react';

import MainWindow from './containers/MainWindow';
import LoginWindow from './containers/LoginWindow';

class App extends React.Component {
  componentDidMount() {
    console.log('App', 'componentDidMount');
  }

  componentWillUnmount() {
    console.log('App', 'componentWillUnmount');
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <React.Fragment>
          <MainWindow />
          <LoginWindow />
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
