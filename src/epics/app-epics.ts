import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { Epic, ActionsObservable, StateObservable } from 'redux-observable';
import { filter, mapTo, map } from 'rxjs/operators';
import { APP_TEAMS } from '../actions';
import { setWindowTitle } from '../actions/window-actions';
import { getAllTeams } from '../reducers/selectors';

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
