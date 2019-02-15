import { ACTIONS } from 'redux-api-call';
import { combineReducers } from 'redux';
import { isEmpty, path } from 'lodash/fp';

import { INIT_ACCOUNT, SELECT_TEAM, TEAM_NAMESPACE } from './constants';

// API
// ---------------

// ACTIONS
// ---------------
export const selectTeam = team => ({
  type: SELECT_TEAM,
  payload: { team },
});

// SELECTORS
// ---------------
export const selectedTeamIdSelector = path(`${TEAM_NAMESPACE}.selectedTeamId`);
export const teamInfoSelector = path(`${TEAM_NAMESPACE}.teamInfo`);
export const selectedTeamSelector = state => {
  const teamInfo = teamInfoSelector(state);
  const selectedTeamId = selectedTeamIdSelector(state);
  return isEmpty(selectedTeamId) ? {} : teamInfo[selectedTeamId];
};

// REDUCER
// ---------------
const selectedTeamId = (state = '', { type, payload }) => {
  if (type === SELECT_TEAM) {
    return payload.team;
  }
  return state;
};

const teamInfo = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_ACCOUNT) {
    // cool
    const team = payload.json.team;
    const entry = { [team.id]: team };
    return { ...state, ...entry };
  }
  return state;
};

export default {
  [TEAM_NAMESPACE]: combineReducers({
    selectedTeamId,
    teamInfo,
  }),
};
