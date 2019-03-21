import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { Epic, ActionsObservable } from 'redux-observable';
import { filter, mapTo } from 'rxjs/operators';

export const pingEpic: Epic<AnyAction, AnyAction, RootState> = (
  action$: ActionsObservable<AnyAction>
) =>
  action$.pipe(
    filter((action: AnyAction) => action.type === 'PING'),
    mapTo({ type: 'PONG' })
  );
