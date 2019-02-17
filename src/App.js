import { Provider } from 'react-redux';
import * as React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from './theming';

import MainWindow from './containers/MainWindow';

class App extends React.Component {
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
          <ThemeProvider>
            <MainWindow />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
