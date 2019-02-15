// TODO: redux-persist seems overkill, revive this later
// also: react-router / react-observable (needed?)

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import {
  connectRouter,
  routerMiddleware as createRouterMiddleware,
} from 'connected-react-router';
import createHistory from 'history/createMemoryHistory';
import reduxThunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import apiMiddleware from './apiMiddleware';
// import rootEpic from './rootEpic';
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
  whitelist: ['account'],
};
const persistedReducer = persistReducer(persistConfig, rootReducerWithRouter);

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
