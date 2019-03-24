import { FluxStandardAction } from 'flux-standard-action';
import { APP_TEAMS, TEAMS } from '../actions';
import { Team } from '../actions/team-actions';
import { StringMap } from '../constants';

export type AppTeamsState = {
  selectedTeamId: string | null;
  teamList: Array<string>;
  selectedConversations: StringMap<string>;
};

export const initialState: AppTeamsState = {
  selectedTeamId: null,
  teamList: [],
  selectedConversations: {},
};

export function reducer(
  state: AppTeamsState = initialState,
  action: FluxStandardAction<any, void>
): AppTeamsState {
  switch (action.type) {
    case TEAMS.ADD_TEAM:
      return insertTeam(state, action.payload);
    case TEAMS.REMOVE_TEAM:
      return removeTeam(state, action.payload);
    case APP_TEAMS.SELECT_TEAM:
      return selectTeam(state, action.payload);
    case APP_TEAMS.SET_TEAMS_SORTED:
      return setTeamsSorted(state, action.payload);
    case APP_TEAMS.SELECT_CONVERSATION:
      return selectConversation(state, action.payload);
    case APP_TEAMS.SELECT_NEXT_TEAM:
      return selectNextTeam(state);
    case APP_TEAMS.SELECT_PREVIOUS_TEAM:
      return selectPreviousTeam(state);
    default:
      return state;
  }
}

function insertTeam(state: AppTeamsState, team: Team) {
  if (!state.teamList.includes(team.id)) {
    const teamList = [...state.teamList, team.id];
    return { ...state, teamList };
  }
  return state;
}

function removeTeam(state: AppTeamsState, teamId: string) {
  const removedTeamIndex = state.teamList.indexOf(teamId);
  if (removedTeamIndex > -1) {
    const teamList = [...state.teamList]; // cloned
    teamList.splice(removedTeamIndex, 1);

    // need to update selectedTeamId also
    let selectedTeamId = state.selectedTeamId;
    if (state.selectedTeamId === teamId) {
      selectedTeamId = state.teamList[0] || null;
    }

    return {
      ...state,
      selectedTeamId,
      teamList,
    };
  }
  return state;
}

function selectTeam(state: AppTeamsState, teamId: string) {
  console.time('SELECT_TEAM');
  if (!state.teamList.includes(teamId)) {
    console.error('Team not found', teamId);
    return state;
  }

  return { ...state, selectedTeamId: teamId };
}

function setTeamsSorted(state: AppTeamsState, teamList: Array<string>) {
  return { ...state, teamList };
}

function selectConversation(state: AppTeamsState, conversationId: string) {
  const currentTeamId = state.selectedTeamId;
  if (!currentTeamId) {
    console.warn('Selecting conversation without a team context. ABORT!');
    return state;
  }
  const { selectedConversations } = state;
  const newConversations = {
    ...selectedConversations,
    [currentTeamId]: conversationId,
  };
  return { ...state, selectedConversations: newConversations };
}

function selectNextTeam(state: AppTeamsState) {
  const currentIndex = state.teamList.indexOf(state.selectedTeamId || '');
  if (currentIndex === -1) {
    return state;
  }

  const nextIndex = currentIndex + 1;
  if (nextIndex === state.teamList.length) {
    return { ...state, selectedTeamId: state.teamList[0] };
  }

  return { ...state, selectedTeamId: state.teamList[nextIndex] };
}

function selectPreviousTeam(state: AppTeamsState) {
  const currentIndex = state.teamList.indexOf(state.selectedTeamId || '');
  if (currentIndex === -1) {
    return state;
  }

  const previousIndex = currentIndex - 1;
  if (previousIndex === -1) {
    return {
      ...state,
      selectedTeamId: state.teamList[state.teamList.length - 1],
    };
  }

  return { ...state, selectedTeamId: state.teamList[previousIndex] };
}

export default reducer;
