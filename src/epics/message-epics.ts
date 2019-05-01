import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { Epic, ActionsObservable, StateObservable } from 'redux-observable';
import { filter, mergeMap } from 'rxjs/operators';
import { APP_TEAMS } from '../actions';
import { getAccounts, getSelectedTeamId } from '../reducers/selectors';
import MessageActions from '../actions/message-actions';
import slack from '../lib/slack';
import { inspect } from 'util';

export const initMessageViewEpic: Epic<AnyAction, AnyAction, RootState> = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    filter(
      (action: AnyAction) => action.type === APP_TEAMS.SELECT_CONVERSATION
    ),
    mergeMap(async action => {
      const conversationId = action.payload;

      const state = state$.value;
      const allAccounts = getAccounts(state);
      const teamId = getSelectedTeamId(state);

      if (!teamId) {
        console.warn('No team selected');
        return MessageActions.initFailure(conversationId, 'No team selected');
      }

      const account = allAccounts[teamId];
      if (!account || !account.token) {
        console.warn('Team not authorized', teamId);
        return MessageActions.initFailure(
          conversationId,
          'Team not authorized'
        );
      }

      try {
        // fetch here
        const resp = await slack.apiCall('conversations.history', {
          token: account.token,
          channel: conversationId,
        });

        return MessageActions.initSuccess(conversationId, resp);
      } catch (error) {
        console.log('initMessageView failure', error);
        console.log(inspect(error));
        const message = error.message || 'Unknown error';
        return MessageActions.initFailure(conversationId, message);
      }
    })
  );
