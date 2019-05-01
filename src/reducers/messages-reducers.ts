import { FluxStandardAction } from 'flux-standard-action';
import { MESSAGES } from '../actions';
import { StringMap } from '../constants';
import { Message } from '../actions/message-actions';

export type MessageViewState = {
  messages: Array<Message>;
  hasMore?: boolean;
  pinCount?: number;
  initialized?: boolean;
};

export type MessagesState = StringMap<MessageViewState>;

export const initialState: MessagesState = {};

export function reducer(
  state: MessagesState = initialState,
  action: FluxStandardAction<any, void>
): MessagesState {
  switch (action.type) {
    case MESSAGES.INIT_MESSAGES_SUCCESS:
      return initMessageView(state, action.payload);
    default:
      return state;
  }
}

function initMessageView(state: MessagesState, payload: any) {
  const { conversationId, data } = payload;
  const viewState: MessageViewState = {
    messages: data.messages,
    hasMore: data.has_more,
    pinCount: data.pin_count,
    initialized: true,
  };
  return { ...state, [conversationId]: viewState };
}

export default reducer;
