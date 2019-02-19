import { ACTIONS } from 'redux-api-call';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { filter, flow, isEmpty, map, path, pathOr, sortBy } from 'lodash/fp';

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
export const selectConversation = conversationId => (dispatch, getState) => {
  const state = getState();
  const selectedTeamId = selectedTeamIdSelector(state);
  if (isEmpty(selectedTeamId)) {
    // select conversation without any team context
    // should not happen
    console.warn('Cannot select conversation without a team context');
    return;
  }
  const action = {
    type: SELECT_CONVERSATION,
    payload: { conversationId, team: selectedTeamId },
  };
  dispatch(action);
};

// SELECTORS
// ---------------
const allSelectedConversationIdsSelector = path(
  `${CONVERSATION_NAMESPACE}.allSelectedConversationIds`
);
const allChannelsSelector = path(`${CONVERSATION_NAMESPACE}.allChannels`);
const allGroupsSelector = path(`${CONVERSATION_NAMESPACE}.allGroups`);
const allImsSelector = path(`${CONVERSATION_NAMESPACE}.allIms`);
const allMpimsSelector = path(`${CONVERSATION_NAMESPACE}.allMpims`);

export const selectedConversationId = createSelector(
  selectedTeamIdSelector,
  allSelectedConversationIdsSelector,
  (selectedTeamId, allSelectedConversationIds) =>
    isEmpty(selectedTeamId)
      ? ''
      : pathOr('', selectedTeamId, allSelectedConversationIds)
);

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

const channelListSelector = createSelector(
  selectedTeamIdSelector,
  allChannelsSelector,
  (selectedTeamId, allChannels) =>
    isEmpty(selectedTeamId) ? [] : pathOr([], selectedTeamId, allChannels)
);

const groupListSelector = createSelector(
  selectedTeamIdSelector,
  allGroupsSelector,
  (selectedTeamId, allGroups) =>
    isEmpty(selectedTeamId) ? [] : pathOr([], selectedTeamId, allGroups)
);

const imListSelector = createSelector(
  selectedTeamIdSelector,
  allImsSelector,
  (selectedTeamId, allIms) =>
    isEmpty(selectedTeamId) ? [] : pathOr([], selectedTeamId, allIms)
);

const mpimListSelector = createSelector(
  selectedTeamIdSelector,
  allMpimsSelector,
  (selectedTeamId, allMpims) =>
    isEmpty(selectedTeamId) ? [] : pathOr([], selectedTeamId, allMpims)
);

export const conversationListSelector = createSelector(
  channelListSelector,
  groupListSelector,
  imListSelector,
  mpimListSelector,
  (channelList, groupList, imList, mpimList) => {
    const sectionChannels = transformSectionChannel([
      ...channelList,
      ...groupList,
    ]);

    const sectionDirectMessages = transformSectionDirectMessage([
      ...imList,
      ...mpimList,
    ]);
    return [...sectionChannels, ...sectionDirectMessages];
  }
);

// REDUCER
// ---------------
const allSelectedConversationIds = (state = {}, { type, payload }) => {
  if (type === SELECT_CONVERSATION) {
    const team = payload.team;
    if (!team) {
      return state;
    }
    const entry = { [team]: payload.conversationId };
    return { ...state, ...entry };
  }
  return state;
};

const allChannels = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_USER) {
    const team = payload.team;
    if (!team) {
      return state;
    }
    const entry = { [team]: payload.json.channels };
    return { ...state, ...entry };
  }
  return state;
};

const allGroups = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_USER) {
    const team = payload.team;
    if (!team) {
      return state;
    }
    const entry = { [team]: payload.json.groups };
    return { ...state, ...entry };
  }
  return state;
};

const allIms = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_USER) {
    const team = payload.team;
    if (!team) {
      return state;
    }
    const entry = { [team]: payload.json.ims };
    return { ...state, ...entry };
  }
  return state;
};

const allMpims = (state = {}, { type, payload }) => {
  if (type === ACTIONS.COMPLETE && payload.name === INIT_USER) {
    const team = payload.team;
    if (!team) {
      return state;
    }
    const entry = { [team]: payload.json.mpims };
    return { ...state, ...entry };
  }
  return state;
};

export default {
  [CONVERSATION_NAMESPACE]: combineReducers({
    allSelectedConversationIds,
    allChannels,
    allGroups,
    allIms,
    allMpims,
  }),
};
