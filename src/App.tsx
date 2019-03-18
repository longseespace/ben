import { Provider } from 'react-redux';
import * as React from 'react';
import { PersistGate } from 'redux-persist/integration/react';

import MainWindow from './containers/MainWindow';
import { Persistor } from 'redux-persist';
import { Store } from 'redux';

type AppProps = {
  store: Store;
  persistor: Persistor;
};

class App extends React.Component<AppProps> {
  componentDidMount() {
    console.log('App', 'componentDidMount');
  }

  componentWillUnmount() {
    console.log('App', 'componentWillUnmount');
  }

  render() {
    const { store, persistor } = this.props;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainWindow />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
