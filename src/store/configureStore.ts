// TODO: redux-persist seems overkill, revive this later
// also: react-router / react-observable (needed?)

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import {
  connectRouter,
  routerMiddleware as createRouterMiddleware,
} from 'connected-react-router';
import { persistStore } from 'redux-persist';
import createHistory from 'history/createMemoryHistory';
import reduxThunk from 'redux-thunk';

import apiMiddleware from './apiMiddleware';
import rootReducer, { RootState } from '../reducers';

const history = createHistory();
// const epicMiddleware = createEpicMiddleware(rootEpic);
const routerMiddleware = createRouterMiddleware(history);

// dev tools
// const composeEnhancers = composeWithDevTools({
//   suppressConnectErrors: false,
//   realtime: process.env.NODE_ENV !== 'production',
// });

// for local remote-dev server, use below config
const composeEnhancers = composeWithDevTools({
  hostname: process.env.DEV_SERVER_HOST || 'localhost',
  port: 8000,
  realtime: process.env.NODE_ENV !== 'production',
});

// then router
const connectRouterHistory = connectRouter(history);
const rootReducerWithRouter = connectRouterHistory<RootState>(rootReducer);

// finally composeEnhancers
const enhancers = composeEnhancers(
  applyMiddleware(
    reduxThunk,
    apiMiddleware,
    // epicMiddleware,
    routerMiddleware
  )
);

export { history };

function configureStore() {
  const store = createStore(rootReducerWithRouter, {}, enhancers);
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      const rootReducerWithRouter = connectRouterHistory<RootState>(
        nextReducer
      );
      store.replaceReducer(rootReducerWithRouter);
    });
    // module.hot.accept('./rootEpic', () => {
    //   const rootEpic = require('./rootEpic').default;
    //   epicMiddleware.replaceEpic(rootEpic);
    // });
  }

  return { store, persistor };
}

export default configureStore;
