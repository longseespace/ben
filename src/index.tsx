// webpack HMR
import '../webpack/hot';

import CrashHandler from '@react-qml/breakpad';
import { render } from 'react-qml';
import React from 'react';
import pkg from '../package.json';

import App from './App';
import configureStore from './store/configureStore';

const { store, persistor } = configureStore();

// setup CrashHandler
if (process.env.NODE_ENV === 'production') {
  CrashHandler.init({
    productName: 'Ben',
    companyName: 'Podzim',
    submitURL:
      'https://sentry.io/api/1433538/minidump/?sentry_key=c621e085d91f467fa0d9629ba4375508',
    uploadToServer: true,
    extra: {
      sentry: {
        release: pkg.version,
      },
    },
  });
}

export default (root: any) => {
  render(<App store={store} persistor={persistor} />, root);

  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      render(<NextApp store={store} persistor={persistor} />, root);
    });
  }
};
