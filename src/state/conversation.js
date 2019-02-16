import { ACTIONS } from 'redux-api-call';
import { combineReducers } from 'redux';
import { filter, flow, isEmpty, map, path, sortBy } from 'lodash/fp';

import {
  CONVERSATION_NAMESPACE,
  INIT_USER,
  SELECT_CONVERSATION,
} from './constants';
import { selectedTeamIdSelector } from './team';

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
const channelListSelector = path(`${CONVERSATION_NAMESPACE}.channelList`);
const groupListSelector = path(`${CONVERSATION_NAMESPACE}.groupList`);
const imListSelector = path(`${CONVERSATION_NAMESPACE}.imList`);
const mpimListSelector = path(`${CONVERSATION_NAMESPACE}.mpimList`);

const addSection = section => map(item => ({ ...item, section }));
const filterOpen = filter(item => item.is_open || item.is_member);
const sortByMuted = sortBy('is_muted');
const transformName = map(item => {
  if (item.is_mpim) {
    const name = item.name
      .substring(item.name.indexOf('-') + 1, item.name.lastIndexOf('-'))
      .split('--')
      .join(', ');
    return { ...item, name };
  }
  return item;
});

const transformSectionChannel = flow(
  addSection('Channels'),
  filterOpen,
  sortByMuted
);

const transformSectionDirectMessage = flow(
  addSection('Direct Messages'),
  filterOpen,
  transformName
);

export const conversationListSelector = state => {
  const selectedTeamId = selectedTeamIdSelector(state);
  if (isEmpty(selectedTeamId)) {
    return [];
  }
  const allChannels = channelListSelector(state)[selectedTeamId] || [];
  const allGroups = groupListSelector(state)[selectedTeamId] || [];
  const allIms = imListSelector(state)[selectedTeamId] || [];
  const allMpims = mpimListSelector(state)[selectedTeamId] || [];

  const sectionChannels = transformSectionChannel([
    ...allChannels,
    ...allGroups,
  ]);

  const sectionDirectMessages = transformSectionDirectMessage([
    ...allIms,
    ...allMpims,
  ]);
  return [...sectionChannels, ...sectionDirectMessages];
};

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

const mpimList = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_USER) {
    const teamId = payload.teamId;
    if (!teamId) {
      return state;
    }
    const entry = { [teamId]: payload.json.mpims };
    return { ...state, ...entry };
  }
  return state;
};

export default {
  [CONVERSATION_NAMESPACE]: combineReducers({
    selectedConversation,
    channelList,
    groupList,
    imList,
    mpimList,
  }),
};
