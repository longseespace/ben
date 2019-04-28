import { FluxStandardAction } from 'flux-standard-action';
import { CONVERSATIONS } from '../actions';
import { StringMap } from '../constants';
import {
  Conversation,
  TeamConversationListPayload,
} from '../actions/conversation-actions';

export type ConversationsState = StringMap<Array<Conversation>>;

export const initialState: ConversationsState = {};

export function reducer(
  state: ConversationsState = initialState,
  action: FluxStandardAction<any, void>
): ConversationsState {
  switch (action.type) {
    case CONVERSATIONS.SET_CONVERSATION_LIST:
      return setConversationList(state, action.payload);
    default:
      return state;
  }
}

function setConversationList(
  state: ConversationsState,
  payload: TeamConversationListPayload
) {
  const { teamId, conversations } = payload;
  return { ...state, [teamId]: conversations };
}

export default reducer;
