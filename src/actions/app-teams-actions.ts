import { APP_TEAMS } from '.';

export const selectTeam = (teamId: string) => ({
  type: APP_TEAMS.SELECT_TEAM,
  payload: teamId,
});

export const setTeamSorted = (teamList: Array<string>) => ({
  type: APP_TEAMS.SET_TEAMS_SORTED,
  payload: teamList,
});

export const selectConversation = (conversationId: string) => ({
  type: APP_TEAMS.SELECT_CONVERSATION,
  payload: conversationId,
});

export const selectNextTeam = () => ({
  type: APP_TEAMS.SELECT_NEXT_TEAM,
});

export const selectPreviousTeam = () => ({
  type: APP_TEAMS.SELECT_PREVIOUS_TEAM,
});
