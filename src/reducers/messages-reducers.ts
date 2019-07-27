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

const groupMultipleMessagesByAuthor = (messages: Array<Message>) => {
  return messages.map((message, index) => {
    let shouldRenderUserInfo = true;
    if (index > 0) {
      const prevMsg = messages[index - 1];
      shouldRenderUserInfo = prevMsg.user !== message.user;
    }
    return {
      ...message,
      shouldRenderUserInfo,
    };
  });
};

function initMessageView(state: MessagesState, payload: any) {
  const { conversationId, data } = payload;
  const messages = groupMultipleMessagesByAuthor(
    (data.messages || []).reverse()
  );
  const viewState: MessageViewState = {
    messages: messages,
    hasMore: data.has_more,
    pinCount: data.pin_count,
    initialized: true,
  };
  return { ...state, [conversationId]: viewState };
}

export default reducer;
