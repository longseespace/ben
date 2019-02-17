import { combineReducers } from 'redux';
import { makeFetchAction } from 'redux-api-call';
import { path } from 'lodash/fp';

import {
  ACCOUNT_NAMESPACE,
  ADD_ACCOUNT,
  INIT_ACCOUNT,
  INIT_USER,
  REMOVE_ACCOUNT,
} from './constants';
import { rtmConnect } from '../lib/slack';

const API_ROOT = 'https://slack.com/api';

// API
// ---------------
// NOTE: private API
export const InitAccountAPI = makeFetchAction(
  INIT_ACCOUNT,
  ({ token, team }) => ({
    endpoint: `${API_ROOT}/client.boot`,
    method: 'POST',
    form: {
      token,
      flannel_api_ver: 4,
      _x_reason: 'fetch-legacy-start-data',
      _x_mode: 'online',
    },
    team: team,
  })
);

// NOTE: private API
export const InitUserAPI = makeFetchAction(INIT_USER, ({ token, team }) => ({
  endpoint: `${API_ROOT}/users.counts`,
  method: 'POST',
  form: {
    token,
    mpim_aware: true,
    only_relevant_ims: true,
    simple_unreads: true,
    include_threads: true,
    mpdm_dm_users: false,
    _x_reason: 'users-counts-api/fetchUsersCounts',
    _x_mode: 'online',
  },
  team: team, // for reference only
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
export const initUser = InitUserAPI.actionCreator;

// thunk
export const initWorkspace = ({
  team,
  user,
  userEmail,
  token,
}) => async dispatch => {
  dispatch(addAccount({ team, user, userEmail, token }));
  dispatch(initAccount({ token, team }));
  dispatch(initUser({ token, team }));
};

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
