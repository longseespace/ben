import { ACTIONS } from 'redux-api-call';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { isEmpty, path } from 'lodash/fp';

import { INIT_ACCOUNT, SELF_NAMESPACE } from './constants';
import { selectedTeamIdSelector } from './team';

// API
// ---------------

// ACTIONS
// ---------------

// SELECTORS
// ---------------
const allProfilesSelector = path(`${SELF_NAMESPACE}.info`);

export const selfSelector = createSelector(
  selectedTeamIdSelector,
  allProfilesSelector,
  (selectedTeamId, allProfiles) =>
    isEmpty(selectedTeamId) ? {} : allProfiles[selectedTeamId]
);

// REDUCER
// ---------------
const info = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_ACCOUNT) {
    const team = payload.team;
    if (!team) {
      return state;
    }
    const entry = { [team]: payload.json.self };
    return { ...state, ...entry };
  }
  return state;
};

export default {
  [SELF_NAMESPACE]: combineReducers({
    info,
  }),
};
