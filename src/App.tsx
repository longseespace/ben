import { Provider } from 'react-redux';
import * as React from 'react';
import { PersistGate } from 'redux-persist/integration/react';

import MainWindow from './containers/MainWindow';
import { Persistor } from 'redux-persist';
import { Store } from 'redux';
import ResourcesLoader from './components/ResourcesLoader';

type AppProps = {
  store: Store;
  persistor: Persistor;
};

class App extends React.Component<AppProps> {
  onAppStateChanged = (state: any) => {
    if (state === Qt.ApplicationInactive) {
      gc();
    }
  };

  componentDidMount() {
    console.log('App', 'componentDidMount');
    Qt.application.stateChanged.connect(this.onAppStateChanged);
  }

  componentWillUnmount() {
    console.log('App', 'componentWillUnmount');
    Qt.application.stateChanged.disconnect(this.onAppStateChanged);
  }

  render() {
    const { store, persistor } = this.props;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ResourcesLoader>
            <MainWindow />
          </ResourcesLoader>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
