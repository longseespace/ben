import { ACTIONS } from 'redux-api-call';
import { combineReducers } from 'redux';
import { path } from 'lodash/fp';

import {
  CONVERSATION_NAMESPACE,
  INIT_USER,
  SELECT_CONVERSATION,
} from './constants';

// API
// ---------------

// ACTIONS
// ---------------
export const selectConversation = ({ type, id }) => ({
  type: SELECT_CONVERSATION,
  payload: { type, id },
});

// SELECTORS
// ---------------
export const selectedConversationSelector = path(
  `${CONVERSATION_NAMESPACE}.selectedConversation`
);
export const channelListSelector = path(
  `${CONVERSATION_NAMESPACE}.channelList`
);
export const groupListSelector = path(`${CONVERSATION_NAMESPACE}.groupList`);
export const imListSelector = path(`${CONVERSATION_NAMESPACE}.imList`);

// REDUCER
// ---------------
const selectedConversation = (state = {}, { type, payload }) => {
  if (type === SELECT_CONVERSATION) {
    return payload;
  }
  return state;
};

const channelList = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_USER) {
    const teamId = payload.teamId;
    if (!teamId) {
      return state;
    }
    const entry = { [teamId]: payload.json.channels };
    return { ...state, ...entry };
  }
  return state;
};

const groupList = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_USER) {
    const teamId = payload.teamId;
    if (!teamId) {
      return state;
    }
    const entry = { [teamId]: payload.json.groups };
    return { ...state, ...entry };
  }
  return state;
};

const imList = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_USER) {
    const teamId = payload.teamId;
    if (!teamId) {
      return state;
    }
    const entry = { [teamId]: payload.json.ims };
    return { ...state, ...entry };
  }
  return state;
};

// const mpimList = (state = {}, { type, payload }) => {
//   if (type === ACTIONS.COMPLETE && payload.name === INIT_ACCOUNT) {
//     const team = payload.json.team;
//     const entry = { [team.id]: payload.json.mpims };
//     return { ...state, ...entry };
//   }
//   return state;
// };

export default {
  [CONVERSATION_NAMESPACE]: combineReducers({
    selectedConversation,
    channelList,
    groupList,
    imList,
    // mpimList,
  }),
};
