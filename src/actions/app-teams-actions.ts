import { APP_TEAMS } from '.';

const selectTeam = (teamId: string) => ({
  type: APP_TEAMS.SELECT_TEAM,
  payload: teamId,
});

const setTeamSorted = (teamList: Array<string>) => ({
  type: APP_TEAMS.SET_TEAMS_SORTED,
  payload: teamList,
});

const selectConversation = (conversationId: string) => ({
  type: APP_TEAMS.SELECT_CONVERSATION,
  payload: conversationId,
});

const selectNextTeam = () => ({
  type: APP_TEAMS.SELECT_NEXT_TEAM,
});

const selectPreviousTeam = () => ({
  type: APP_TEAMS.SELECT_PREVIOUS_TEAM,
});

const AppTeamsActions = {
  selectTeam,
  setTeamSorted,
  selectConversation,
  selectNextTeam,
  selectPreviousTeam,
};

export default AppTeamsActions;
