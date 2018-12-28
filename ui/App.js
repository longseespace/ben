import { Provider } from 'react-redux';
import * as React from 'react';

import MainPage from './components/MainPage';

class App extends React.Component {
  componentWillMount() {
    console.log('App', 'componentWillMount');
  }

  componentDidMount() {
    console.log('App', 'componentDidMount');
  }

  componentWillUnmount() {
    console.log('App', 'componentWillUnmount');
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <MainPage />
      </Provider>
    );
  }
}

export default App;
