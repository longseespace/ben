import { ACTIONS, makeFetchAction } from 'redux-api-call';
import { combineReducers } from 'redux';
import { path } from 'lodash/fp';

import { FETCH_MESSAGE, MESSAGE_NAMESPACE } from './constants';

const API_ROOT = 'https://slack.com/api';

// API
// ---------------
export const FetchMessageAPI = makeFetchAction(
  FETCH_MESSAGE,
  ({ token, channel, team }) => ({
    endpoint: `${API_ROOT}/conversations.history`,
    method: 'POST',
    form: {
      token,
      channel,
    },
    team: team,
  })
);

// ACTIONS
// ---------------
export const fetchMessage = FetchMessageAPI.actionCreator;

// SELECTORS
// ---------------
export const allMessagesSelector = path(`${MESSAGE_NAMESPACE}.allMessages`);

// REDUCER
// ---------------
const allMessages = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === FETCH_MESSAGE) {
    const team = payload.team;
    if (!team) {
      return state;
    }
    const entry = { [team]: payload.json.messages };
    return { ...state, ...entry };
  }
  return state;
};

export default {
  [MESSAGE_NAMESPACE]: combineReducers({
    allMessages,
  }),
};
