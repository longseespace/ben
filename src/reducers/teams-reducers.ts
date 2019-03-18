import { FluxStandardAction } from 'flux-standard-action';
import { TEAMS } from '../actions';
import { StringMap } from '../constants';
import { Team } from '../actions/team-actions';

export type TeamsState = StringMap<Team>;

export const initialState: TeamsState = {};

export function reducer(
  state: TeamsState = initialState,
  action: FluxStandardAction<any, void>
): TeamsState {
  switch (action.type) {
    case TEAMS.ADD_TEAM:
      return addTeam(state, action.payload);
    case TEAMS.REMOVE_TEAM:
      return removeTeam(state, action.payload);
    default:
      return state;
  }
}

function addTeam(teams: TeamsState, team: Team) {
  if (teams[team.id]) {
    return teams;
  }

  return {
    ...teams,
    [team.id]: team,
  };
}

function removeTeam(teams: TeamsState, teamId: string) {
  const { [teamId]: removedTeam, ...remainingTeams } = teams;
  return remainingTeams;
}

export default reducer;
