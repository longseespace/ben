import { ACTIONS, makeFetchAction } from 'redux-api-call';
import { combineReducers } from 'redux';
import { isEmpty, path } from 'lodash/fp';

import { INIT_ACCOUNT, USERS_NAMESPACE } from './constants';
import { selectedTeamIdSelector } from './team';

const API_ROOT = 'https://slack.com/api';

// API
// ---------------

// ACTIONS
// ---------------

// SELECTORS
// ---------------
const allProfilesSelector = path(`${USERS_NAMESPACE}.self`);

export const selfSelector = state => {
  const selectedTeamId = selectedTeamIdSelector(state);
  if (isEmpty(selectedTeamId)) {
    return {};
  }

  return allProfilesSelector(state)[selectedTeamId] || {};
};

// REDUCER
// ---------------
const self = (state = {}, { type, payload }) => {
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
  [USERS_NAMESPACE]: combineReducers({
    self,
  }),
};
