import { USERS } from '.';
import { User } from './team-actions';

const fetchStart = (userId: string) => ({
  type: USERS.FETCH_USERS_START,
  payload: userId,
});

const fetchFailure = (userId: string, errorMessage: string) => ({
  type: USERS.FETCH_USERS_FAILURE,
  payload: {
    userId,
    errorMessage,
  },
});

export type UserFetchResult = {
  ok: boolean;
  user: User;
};

export type UserFetchSuccessPayload = {
  userId: string;
  data: UserFetchResult;
};

const fetchSuccess = (userId: string, data: UserFetchResult) => ({
  type: USERS.FETCH_USERS_SUCCESS,
  payload: {
    userId,
    data,
  },
});

const UserActions = {
  fetchStart,
  fetchSuccess,
  fetchFailure,
};

export default UserActions;
