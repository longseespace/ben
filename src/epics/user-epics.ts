import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { Epic, ActionsObservable } from 'redux-observable';
import { filter, take, mergeMap } from 'rxjs/operators';
import { CONVERSATIONS } from '../actions';
import { TeamConversationListPayload } from '../actions/conversation-actions';
import { RTM } from '../store/rtmMiddleware/constants';
import RTMActions, { RTMActionType } from '../store/rtmMiddleware/actions';

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
