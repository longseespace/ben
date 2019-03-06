import { ACTIONS } from 'redux-api-call';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import {
  filter,
  find,
  flow,
  isEmpty,
  map,
  path,
  pathOr,
  pick,
  sortBy,
} from 'lodash/fp';

import {
  CONVERSATION_NAMESPACE,
  INIT_USER,
  SELECT_CONVERSATION,
} from './constants';
import { accountListSelector } from './account';
import { fetchMessage } from './message';
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

  // select action
  const selectAction = {
    type: SELECT_CONVERSATION,
    payload: { conversationId, team: selectedTeamId },
  };
  dispatch(selectAction);

  // fetch message list
  const accountList = accountListSelector(state);
  const token = path([selectedTeamId, 'token'], accountList);
  dispatch(
    fetchMessage({
      token,
      channel: conversationId,
      team: selectedTeamId,
    })
  );
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

export const selectedConversationIdSelector = createSelector(
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
const transformMpimName = map(item => {
  if (item.is_mpim) {
    const name = item.name
      .substring(item.name.indexOf('-') + 1, item.name.lastIndexOf('-'))
      .split('--')
      .join(', ');
    return { ...item, name };
  }
  return item;
});

// ListModel disables dynamicRoles by default
// we need to set model's schema explicitly
// @see https://doc.qt.io/archives/qt-5.10/qml-qtqml-models-listmodel.html#dynamicRoles-prop
const defaultConversationItem = {
  is_im: false,
  is_mpim: false,
  is_private: false,
  is_muted: false,
  is_active: false,
  is_open: false,
  name: '',
  section: '',
  id: '',
};

const picky = pick(Object.keys(defaultConversationItem));

const standardizeConversation = map(item => ({
  ...defaultConversationItem,
  ...picky(item),
}));

const transformSectionChannel = flow(
  addSection('Channels'),
  filterOpen,
  sortByMuted,
  standardizeConversation
);

const transformSectionDirectMessage = flow(
  addSection('Direct Messages'),
  filterOpen,
  transformMpimName,
  standardizeConversation
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

export const selectedConversationSelector = createSelector(
  selectedConversationIdSelector,
  conversationListSelector,
  (conversationId, conversationList) => {
    if (isEmpty(conversationId)) {
      return {};
    }
    return find({ id: conversationId }, conversationList);
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
