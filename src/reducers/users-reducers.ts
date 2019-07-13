import { FluxStandardAction } from 'flux-standard-action';
import { USERS } from '../actions';
import { StringMap } from '../constants';
import { User } from '../actions/team-actions';
import { UserFetchSuccessPayload } from '../actions/user-actions';

export type UsersState = StringMap<User>;

export const initialState: UsersState = {};

export function reducer(
  state: UsersState = initialState,
  action: FluxStandardAction<any, void>
): UsersState {
  switch (action.type) {
    case USERS.FETCH_USERS_SUCCESS:
      return updateUser(state, action.payload);
    default:
      return state;
  }
}

function updateUser(state: UsersState, payload: UserFetchSuccessPayload) {
  const { userId, data } = payload;
  return { ...state, [userId]: data.user };
}

export default reducer;
