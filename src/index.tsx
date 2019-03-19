import '@react-qml/cli/hot';

import { render } from 'react-qml';
import React from 'react';

// this is to includes font in qrc
import './assets/fa-solid.ttf';
import './assets/fa-regular.ttf';
import './assets/Lato-Regular.ttf';
import './assets/Lato-Bold.ttf';
import './assets/Lato-Black.ttf';

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
