import { combineReducers } from 'redux';

import { path } from 'lodash/fp';

// API
// ---------------

// ACTIONS
// ---------------
const SHOW_WINDOW = 'SHOW_WINDOW';
export const showWindow = windowId => ({
  type: SHOW_WINDOW,
  payload: {
    windowId,
  },
});

const HIDE_WINDOW = 'HIDE_WINDOW';
export const hideWindow = windowId => ({
  type: HIDE_WINDOW,
  payload: {
    windowId,
  },
});

// SELECTORS
// ---------------
export const windowVisibilitySelector = path('window.windowVisibility');
export const mainWindowVisibilitySelector = path(
  'window.windowVisibility.main'
);
export const signinWindowVisibilitySelector = path(
  'window.windowVisibility.signin'
);

// REDUCER
// ---------------
const defaultVisibility = {
  main: true,
  signin: false,
};
const windowVisibility = (state = defaultVisibility, { type, payload }) => {
  if (type === SHOW_WINDOW) {
    const config = { [payload.windowId]: true };
    return { ...state, ...config };
  }
  if (type === HIDE_WINDOW) {
    // eslint-disable-next-line no-unused-vars
    const config = { [payload.windowId]: false };
    return { ...state, ...config };
  }
  return state;
};

export default {
  window: combineReducers({
    windowVisibility,
  }),
};
