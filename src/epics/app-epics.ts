import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { Epic, ActionsObservable, StateObservable } from 'redux-observable';
import { filter, mapTo, map } from 'rxjs/operators';
import { APP_TEAMS } from '../actions';
import { setWindowTitle } from '../actions/window-actions';
import { getAllTeams } from '../reducers/selectors';
import { RTM } from '../store/rtmMiddleware/constants';
import NotificationActions from '../store/notificationMiddleware/actions';

export const pingEpic: Epic<AnyAction, AnyAction, RootState> = (
  action$: ActionsObservable<AnyAction>
) =>
  action$.pipe(
    filter((action: AnyAction) => action.type === 'PING'),
    mapTo({ type: 'PONG' })
  );

export const setWindowTitleWhenSelectTeamEpic: Epic<
  AnyAction,
  AnyAction,
  RootState
> = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    filter((action: AnyAction) => action.type === APP_TEAMS.SELECT_TEAM),
    map(action => {
      const allTeams = getAllTeams(state$.value);
      const teamName = allTeams[action.payload].name;
      return setWindowTitle('main', `Ben — ${teamName}`);
    })
  );
/**
 * Action looks like this
 * ```
 * {
    meta: {
      teamId: 'T40D4841Z'
    },
    payload: {
      type: 'desktop_notification',
      title: 'bodidata',
      subtitle: 'Slackbot',
      msg: '1553845689.001000',
      ts: '1553845689.001000',
      content: 'You asked me to remind you to “code”.',
      channel: 'D6FB3HJ49',
      launchUri: 'slack://channel?id=D6FB3HJ49&message=1553845689001000&team=T40D4841Z',
      avatarImage: 'https://a.slack-edge.com/16510/img/slackbot_192.png',
      ssbFilename: '',
      imageUri: null,
      is_shared: false,
      event_ts: '1553845690.002200'
    },
    type: 'RTM_EVENT'
  }
 * ```
 */
export const showNotificationEpic: Epic<AnyAction, AnyAction, RootState> = (
  action$: ActionsObservable<AnyAction>
) =>
  action$.pipe(
    filter(
      (action: AnyAction) =>
        action.type === RTM.RTM_EVENT &&
        action.payload.type === 'desktop_notification'
    ),
    map(action =>
      NotificationActions.showMessage(
        action.payload.subtitle,
        action.payload.content
      )
    )
  );
