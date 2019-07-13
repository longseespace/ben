import { FluxStandardAction } from 'flux-standard-action';
import { StringMap } from '../constants';
import { RTM } from '../store/rtmMiddleware/constants';
import { TEAMS } from '../actions';
import { Team } from '../actions/team-actions';
import { RTMActionType } from '../store/rtmMiddleware/actions';

export type PresencesState = StringMap<string>;

export function reducer(
  state: PresencesState = {},
  action: FluxStandardAction<any, any>
): PresencesState {
  switch (action.type) {
    case RTM.RTM_EVENT:
      return handleRtmEvent(state, action);

    case TEAMS.ADD_TEAM:
      return handleAddTeam(state, action.payload);

    default:
      return state;
  }
}

function handleAddTeam(state: PresencesState, team: Team) {
  const user = team.user;
  return { ...state, [user.id]: user.manual_presence };
}

function handleRtmEvent(state: PresencesState, action: RTMActionType) {
  const payload = action.payload;
  if (payload.type === 'presence_change') {
    if (payload.users) {
      const clonedState = { ...state };
      return payload.users.reduce(
        (currentState: PresencesState, user: string) => ({
          ...currentState,
          [user]: payload.presence,
        }),
        clonedState
      );
    }

    if (payload.user) {
      return { ...state, [payload.user]: payload.presence };
    }
  }

  return state;
}

export default reducer;
