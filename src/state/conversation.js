import { ACTIONS, makeFetchAction } from 'redux-api-call';
import { combineReducers } from 'redux';
import { equals, path } from 'lodash/fp';

const API_ROOT = 'https://slack.com/api';

// API
// ---------------
const GET_CHANNEL_LIST = 'GET_CHANNEL_LIST';
export const GetChannelListAPI = makeFetchAction(
  GET_CHANNEL_LIST,
  ({ token, types = 'public_channel,private_channel' }) => ({
    endpoint: `${API_ROOT}/conversations.list`,
    method: 'POST',
    form: { token, types },
  })
);

// ACTIONS
// ---------------
export const getChannelList = GetChannelListAPI.actionCreator;

// SELECTORS
// ---------------
export const channelListSelector = path('channel.list');
export const channelInfoSelector = path('channel.info');

// REDUCER
// ---------------

const list = (state = [], { type, payload }) => {
  if (type === ACTIONS.COMPLETE && equals(payload.name, GET_CHANNEL_LIST)) {
    const resp = payload.json;
    if (resp.ok) {
      return [...state, ...resp.channels];
    }
  }
  return state;
};

export default {
  conversation: combineReducers({
    list,
  }),
};
