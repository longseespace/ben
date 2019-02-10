import '@react-qml/cli/hot';

import { render } from 'react-qml';
import React from 'react';

import App from './App';
import makeStore, { history } from './state/makeStore';

const store = makeStore();

export default root => {
  render(<App store={store} history={history} />, root);

  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      render(<NextApp store={store} history={history} />, root);
    });
  }
};
