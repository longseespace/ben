import { RootState } from './';
import { createSelector } from 'reselect';

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
export const getSelectedConversationId = (state: RootState) =>
  state.appTeams.selectedConversationId;

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
