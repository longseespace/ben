import '@react-qml/cli/hot';

import { render } from 'react-qml';
import React from 'react';

import App from './App';
import createStore from './store/createStore';

const store = createStore();

export default root => {
  render(<App store={store} />, root);

  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      render(<NextApp store={store} />, root);
    });
  }
};
