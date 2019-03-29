import { RootState } from './';
import { createSelector } from 'reselect';
import { StringMap } from '../constants';

// Accounts
export const getAccounts = (state: RootState) => state.accounts;

// Windows
export const getAllWindowSettings = (state: RootState) => state.windows;

export const getMainWindowSettings = createSelector(
  getAllWindowSettings,
  allWindowsSettings => allWindowsSettings.main
);

export const getSigninWindowSettings = createSelector(
  getAllWindowSettings,
  allWindowsSettings => allWindowsSettings.signin
);

// App Teams
export const getSortedTeamIds = (state: RootState) => state.appTeams.teamList;
export const getSelectedTeamId = (state: RootState) =>
  state.appTeams.selectedTeamId;
export const getAllSelectedConversationIds = (state: RootState) =>
  state.appTeams.selectedConversations;
export const getSelectedConversationId = createSelector(
  getAllSelectedConversationIds,
  getSelectedTeamId,
  (selectedConversations, teamId) => {
    if (!teamId) {
      return '';
    }

    return selectedConversations[teamId];
  }
);

// Workspaces
export const getAllWorkspaces = (state: RootState) => state.workspaces;
export const getSelectedWorkspace = createSelector(
  getAllWorkspaces,
  getSelectedTeamId,
  (allWorkspaces, selectedTeamId) => {
    if (!selectedTeamId) {
      return undefined;
    }
    return allWorkspaces[selectedTeamId];
  }
);

// Teams
export const getAllTeams = (state: RootState) => state.teams;
export const getSelectedTeam = createSelector(
  getAllTeams,
  getSelectedTeamId,
  (allTeams, selectedTeamId) => {
    if (!selectedTeamId) {
      return undefined;
    }
    return allTeams[selectedTeamId];
  }
);

export const getSortedTeams = createSelector(
  getAllTeams,
  getSortedTeamIds,
  (allTeams, sortedTeamIds) => {
    return sortedTeamIds.map(teamId => allTeams[teamId]);
  }
);

export const getSelectedTeamName = createSelector(
  getSelectedTeam,
  selectedTeam => (selectedTeam ? selectedTeam.name : '')
);

export const getCurrentTeamUserName = createSelector(
  getSelectedTeam,
  selectedTeam => (selectedTeam ? selectedTeam.user.name : '')
);

export const getCurrentUser = createSelector(
  getSelectedTeam,
  selectedTeam => (selectedTeam ? selectedTeam.user : null)
);

// Conversations
export const getAllConversations = (state: RootState) => state.conversations;
export const getConverstionList = createSelector(
  getAllConversations,
  getSelectedTeamId,
  (allConversations, selectedTeamId) => {
    if (!selectedTeamId) {
      return [];
    }
    return allConversations[selectedTeamId] || [];
  }
);

export const getConversationSectionList = createSelector(
  getConverstionList,
  conversationList => {
    const sections = [
      {
        title: 'Channels',
        data: conversationList.filter(c => c.section === 'Channels'),
      },
      {
        title: 'Direct Messages',
        data: conversationList.filter(c => c.section === 'Direct Messages'),
      },
    ];

    return sections;
  }
);

export const getSelectedConversation = createSelector(
  getConverstionList,
  getSelectedConversationId,
  (conversationList, selectedConversationId) => {
    if (!selectedConversationId) {
      return null;
    }

    return conversationList.find(c => c.id === selectedConversationId);
  }
);

export const getTeamsUnreads = createSelector(
  getSortedTeamIds,
  getAllConversations,
  (teamIds, allConversations) => {
    const teamUnreads: StringMap<boolean> = {};
    teamIds.forEach(teamId => {
      const conversationList = allConversations[teamId] || [];
      const firstUnread = conversationList.find(
        c => !c.is_muted && c.has_unreads
      );

      teamUnreads[teamId] = !!firstUnread;
    });

    return teamUnreads;
  }
);

export const getTeamsBadgeCounts = createSelector(
  getSortedTeamIds,
  getAllConversations,
  (teamIds, allConversations) => {
    const teamBadgeCounts: StringMap<number> = {};
    teamIds.forEach(teamId => {
      const conversationList = allConversations[teamId] || [];
      teamBadgeCounts[teamId] = conversationList.reduce(
        (acc, convo) =>
          acc + (convo.dm_count || 0) + (convo.mention_count || 0),
        0
      );
    });

    return teamBadgeCounts;
  }
);

// Timelines
export const getAllTimelines = (state: RootState) => state.timelines;
export const getMessageList = createSelector(
  getAllTimelines,
  getSelectedConversationId,
  (allTimelines, selectedConversationId) => {
    if (!selectedConversationId) {
      return [];
    }

    return allTimelines[selectedConversationId]
      ? allTimelines[selectedConversationId].messages
      : [];
  }
);

// Presences
export const getAllUserPresences = (state: RootState) => state.presences;
