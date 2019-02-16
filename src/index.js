import '@react-qml/cli/hot';

import { render } from 'react-qml';
import React from 'react';

// this is just to includes font in qrc
import './assets/fa-solid-900.ttf';

import App from './App';
import configureStore from './store/configureStore';

const { store, persistor } = configureStore();

export default root => {
  render(<App store={store} persistor={persistor} />, root);

  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      render(<NextApp store={store} persistor={persistor} />, root);
    });
  }
};
