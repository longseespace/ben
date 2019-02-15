import { combineReducers } from 'redux';
import { path } from 'lodash/fp';

import {
  HIDE_LOGIN_WINDOW,
  LOGIN_WINDOW_NAMESPACE,
  SHOW_LOGIN_WINDOW,
} from './constants';

// ACTIONS
// ---------------
export const showLoginWindow = () => ({
  type: SHOW_LOGIN_WINDOW,
});

export const hideLoginWindow = () => ({
  type: HIDE_LOGIN_WINDOW,
});

// SELECTORS
// ---------------
export const loginWindowConfigSelector = path(
  `${LOGIN_WINDOW_NAMESPACE}.windowConfig`
);

// REDUCER
// ---------------
const initialState = {
  visible: false,
};
const windowConfig = (state = initialState, { type }) => {
  if (type === SHOW_LOGIN_WINDOW) {
    return { visible: true };
  }
  if (type === HIDE_LOGIN_WINDOW) {
    return { visible: false };
  }
  return state;
};

export default {
  [LOGIN_WINDOW_NAMESPACE]: combineReducers({
    windowConfig,
  }),
};
