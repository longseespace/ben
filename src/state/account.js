import { combineReducers } from 'redux';
import { makeFetchAction } from 'redux-api-call';
import { path } from 'lodash/fp';

import {
  ACCOUNT_NAMESPACE,
  ADD_ACCOUNT,
  INIT_ACCOUNT,
  REMOVE_ACCOUNT,
} from './constants';

const API_ROOT = 'https://slack.com/api';

// API
// ---------------
export const InitAccountAPI = makeFetchAction(INIT_ACCOUNT, ({ token }) => ({
  endpoint: `${API_ROOT}/client.boot`,
  method: 'POST',
  form: { token },
}));

// ACTIONS
// ---------------
export const addAccount = ({ team, user, userEmail, token }) => ({
  type: ADD_ACCOUNT,
  payload: {
    [team]: { team, user, userEmail, token },
  },
});

export const removeAccount = team => ({
  type: REMOVE_ACCOUNT,
  payload: { team },
});

export const initAccount = InitAccountAPI.actionCreator;

// SELECTORS
// ---------------
export const accountListSelector = path(`${ACCOUNT_NAMESPACE}.accountList`);

// REDUCER
// ---------------
const accountList = (state = {}, { type, payload }) => {
  if (type === ADD_ACCOUNT) {
    return { ...state, ...payload };
  }
  if (type === REMOVE_ACCOUNT) {
    // eslint-disable-next-line no-unused-vars
    const { [payload.team]: removedTeam, ...nextState } = state;
    return nextState;
  }
  return state;
};

export default {
  [ACCOUNT_NAMESPACE]: combineReducers({
    accountList,
  }),
};
