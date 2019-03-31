import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { Epic, ActionsObservable, StateObservable } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import { APP_TEAMS } from '../actions';
import TimelinesActions from '../actions/timelines-actions';

export const fetchTimelineIfNeededEpic: Epic<
  AnyAction,
  AnyAction,
  RootState
> = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    filter(
      (action: AnyAction) => action.type === APP_TEAMS.SELECT_CONVERSATION
    ),
    filter(action => {
      const allTimelines = state$.value.timelines;
      const thisTimeline = allTimelines[action.payload];
      return !thisTimeline || !thisTimeline.initialized;
    }),
    map(action => {
      const allAccounts = state$.value.accounts;
      const selectedTeamId = state$.value.appTeams.selectedTeamId || '';
      const account = allAccounts[selectedTeamId];
      return TimelinesActions.fetchMessages(account.token, action.payload);
    })
  );
