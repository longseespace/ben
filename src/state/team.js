import { ACTIONS, makeFetchAction } from 'redux-api-call';
import { combineReducers } from 'redux';
import { equals, isEmpty, merge, path } from 'lodash/fp';

const API_ROOT = 'https://slack.com/api';

// API
// ---------------
const CLIENT_BOOT = 'CLIENT_BOOT';
export const ClientBootAPI = makeFetchAction(CLIENT_BOOT, ({ token }) => ({
  endpoint: `${API_ROOT}/client.boot`,
  method: 'POST',
  form: { token },
}));

// ACTIONS
// ---------------
const ADD_TEAM = 'ADD_TEAM';
export const addTeam = ({ team, user, userEmail, token }) => ({
  type: ADD_TEAM,
  payload: {
    [team]: { team, user, userEmail, token },
  },
});

const REMOVE_TEAM = 'REMOVE_TEAM';
export const removeTeam = team => ({
  type: REMOVE_TEAM,
  payload: { team },
});

const SELECT_TEAM = 'SELECT_TEAM';
export const selectTeam = team => ({
  type: SELECT_TEAM,
  payload: { team },
});

// export const fetchTeamInfo = TeamInfoAPI.actionCreator;
export const clientBoot = ClientBootAPI.actionCreator;

// SELECTORS
// ---------------
export const teamListSelector = path('team.teamList');
export const clientDataSelector = path('team.clientData');
export const selectedTeamIdSelector = path('team.selectedTeamId');
export const teamInfoSelector = state => {
  const clientData = clientDataSelector(state);
  const teamIds = Object.keys(teamListSelector(state));
  const teamInfoList = teamIds.map(id => ({
    [id]: path(`${id}.team`)(clientData),
  }));
  if (teamInfoList.length > 0) {
    return teamInfoList.reduce(merge);
  }
  return {};
};
export const selectedTeamSelector = state => {
  const id = selectedTeamIdSelector(state);
  if (isEmpty(id)) {
    return {};
  }
  const teamInfo = teamInfoSelector(state) || {};
  return teamInfo[id];
};

// REDUCER
// ---------------

const teamList = (state = {}, { type, payload }) => {
  if (type === ADD_TEAM) {
    return { ...state, ...payload };
  }
  if (type === REMOVE_TEAM) {
    // eslint-disable-next-line no-unused-vars
    const { [payload.team]: removedTeam, ...nextState } = state;
    return nextState;
  }
  return state;
};

const selectedTeamId = (state = '', { type, payload }) => {
  if (type === SELECT_TEAM) {
    return payload.team;
  }
  return state;
};

const clientData = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && equals(payload.name, CLIENT_BOOT)) {
    const resp = payload.json;
    if (resp.ok) {
      const entry = { [resp.team.id]: resp };
      return { ...state, ...entry };
    }
  }
  return state;
};

// we need namespace `team` here
// otherwise selectors won't work
export default {
  team: combineReducers({
    teamList,
    selectedTeamId,
    clientData,
  }),
};
