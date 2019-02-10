import { Provider } from 'react-redux';
import * as React from 'react';

import MainWindow from './containers/MainWindow';

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
        <MainWindow />
      </Provider>
    );
  }
}

export default App;
