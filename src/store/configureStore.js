// TODO: redux-persist seems overkill, revive this later
// also: react-router / react-observable (needed?)

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import {
  connectRouter,
  routerMiddleware as createRouterMiddleware,
} from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import createHistory from 'history/createMemoryHistory';
import reduxThunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';

import apiMiddleware from './apiMiddleware';
import rootReducer from './rootReducer';

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
  suppressConnectErrors: false,
  realtime: process.env.NODE_ENV !== 'production',
});

// then router
const rootReducerWithRouter = connectRouter(history)(rootReducer);

// then persist storage
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['account', 'team', 'conversation', 'user'],
};
const persistedReducer = persistReducer(persistConfig, rootReducerWithRouter);

// then logger
const logger = createLogger({
  colors: false,
  logger: {
    log: (...args) => {
      console.log(require('util').inspect(args, { depth: 2 }));
    },
    info: (...args) => {
      console.log(require('util').inspect(args, { depth: 2 }));
    },
    error: (...args) => {
      console.log(require('util').inspect(args, { depth: 2 }));
    },
    warn: (...args) => {
      console.log(require('util').inspect(args, { depth: 2 }));
    },
  },
});

// finally composeEnhancers
const enhancers = composeEnhancers(
  applyMiddleware(
    reduxThunk,
    apiMiddleware,
    // epicMiddleware,
    routerMiddleware
    // logger
  )
);

export { history };
export default initialState => {
  const store = createStore(persistedReducer, initialState, enhancers);
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextReducer = require('./rootReducer').default;
      const rootReducerWithRouter = connectRouter(history)(nextReducer);
      const persistedReducer = persistReducer(
        persistConfig,
        rootReducerWithRouter
      );
      store.replaceReducer(connectRouter(history)(persistedReducer));
    });
    // module.hot.accept('./rootEpic', () => {
    //   const rootEpic = require('./rootEpic').default;
    //   epicMiddleware.replaceEpic(rootEpic);
    // });
  }

  return { store, persistor };
};
