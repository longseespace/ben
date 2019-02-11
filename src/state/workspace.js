import { combineReducers } from 'redux';
// import { makeFetchAction } from 'redux-api-call';

import { path } from 'lodash/fp';

// const API_ROOT = 'https://slack.com/api';

// API
// ---------------

// ACTIONS
// ---------------
const ADD_WORKSPACE = 'ADD_WORKSPACE';
export const addWorkspace = ({ team, user, userEmail, token }) => ({
  type: ADD_WORKSPACE,
  payload: {
    [team]: { team, user, userEmail, token },
  },
});

const REMOVE_WORKSPACE = 'REMOVE_WORKSPACE';
export const removeWorkspace = team => ({
  type: REMOVE_WORKSPACE,
  payload: { team },
});

// SELECTORS
// ---------------
export const workspaceListSelector = path('workspace.workspaceList');

// REDUCER
// ---------------

const workspaceList = (state = {}, { type, payload }) => {
  if (type === ADD_WORKSPACE) {
    return { ...state, ...payload };
  }
  if (type === REMOVE_WORKSPACE) {
    // eslint-disable-next-line no-unused-vars
    const { [payload.team]: removedTeam, ...nextState } = state;
    return nextState;
  }
  return state;
};

// we need namespace `workspace` here
// otherwise selectors won't work
export default {
  workspace: combineReducers({
    workspaceList,
  }),
};
