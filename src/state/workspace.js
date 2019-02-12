import { ACTIONS, makeFetchAction } from 'redux-api-call';
import { combineReducers } from 'redux';
import { equals, path } from 'lodash/fp';

const API_ROOT = 'https://slack.com/api';

// API
// ---------------
const TEAM_INFO = 'TEAM_INFO';
export const TeamInfoAPI = makeFetchAction(TEAM_INFO, ({ token }) => ({
  endpoint: `${API_ROOT}/team.info`,
  method: 'POST',
  form: { token },
}));

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

export const getTeamInfo = TeamInfoAPI.actionCreator;

// SELECTORS
// ---------------
export const workspaceListSelector = path('workspace.list');
export const workspaceInfoSelector = path('workspace.info');

// REDUCER
// ---------------

const list = (state = {}, { type, payload }) => {
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

const info = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && equals(payload.name, TEAM_INFO)) {
    const resp = payload.json;
    if (resp.ok) {
      const entry = { [resp.team.id]: resp.team };
      return { ...state, ...entry };
    }
  }
  return state;
};

// we need namespace `workspace` here
// otherwise selectors won't work
export default {
  workspace: combineReducers({
    list,
    info,
  }),
};
