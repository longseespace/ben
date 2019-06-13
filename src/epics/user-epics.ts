import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { Epic, ActionsObservable, StateObservable } from 'redux-observable';
import { filter, take, mergeMap } from 'rxjs/operators';
import { CONVERSATIONS, USERS } from '../actions';
import { TeamConversationListPayload } from '../actions/conversation-actions';
import { RTM } from '../store/rtmMiddleware/constants';
import RTMActions, { RTMActionType } from '../store/rtmMiddleware/actions';
import { getAccounts, getSelectedTeamId } from '../reducers/selectors';
import UserActions, { UserFetchResult } from '../actions/user-actions';
import slack from '../lib/slack';
import { inspect } from 'util';

export const userPresenceSubEpic: Epic<AnyAction, AnyAction, RootState> = (
  action$: ActionsObservable<AnyAction>
) => {
  const setConvoListAction$ = action$.pipe(
    filter(
      (action: AnyAction) => action.type === CONVERSATIONS.SET_CONVERSATION_LIST
    )
  );

  const project = (convoListAction: AnyAction) =>
    action$.pipe(
      filter(
        (action: RTMActionType) =>
          action.type === RTM.RTM_EVENT &&
          action.payload.type === 'hello' &&
          !!action.meta &&
          action.meta.teamId === convoListAction.payload.teamId
      ),
      take(1)
    );

  const resultSelector = (setConvoListAction: AnyAction) => {
    const payload = setConvoListAction.payload as TeamConversationListPayload;
    const userIds = payload.conversations
      .filter(c => c.is_im)
      .map(c => c.user_id);
    const command = {
      type: 'presence_sub',
      ids: userIds,
    };
    return RTMActions.send(payload.teamId, command);
  };

  return setConvoListAction$.pipe(mergeMap(project, resultSelector));
};

export const fetchUserEpic: Epic<AnyAction, AnyAction, RootState> = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    filter((action: AnyAction) => action.type === USERS.FETCH_USERS_START),
    mergeMap(async action => {
      const userId = action.payload;

      const state = state$.value;
      const allAccounts = getAccounts(state);
      const teamId = getSelectedTeamId(state);

      if (!teamId) {
        console.warn('No team selected');
        return UserActions.fetchFailure(userId, 'No team selected');
      }

      const account = allAccounts[teamId];
      if (!account || !account.token) {
        console.warn('Team not authorized', teamId);
        return UserActions.fetchFailure(userId, 'Team not authorized');
      }

      try {
        // fetch here
        const resp: UserFetchResult = await slack.apiCall('users.info', {
          token: account.token,
          user: userId,
        });

        return UserActions.fetchSuccess(userId, resp);
      } catch (error) {
        console.log('fetchUser failure', error);
        console.log(inspect(error));
        const message = error.message || 'Unknown error';
        return UserActions.fetchFailure(userId, message);
      }
    })
  );
