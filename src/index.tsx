import '@react-qml/cli/hot';

import { render } from 'react-qml';
import React from 'react';

import App from './App';
import configureStore from './store/configureStore';

const { store, persistor } = configureStore();

export default (root: any) => {
  render(<App store={store} persistor={persistor} />, root);

  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      render(<NextApp store={store} persistor={persistor} />, root);
    });
  }
};
