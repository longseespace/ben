import { MESSAGES } from '.';

export type Message = {
  client_msg_id: string;
  type: string;
  subtype?: string;
  text: string;
  user: string;
  ts: string | number;
  shouldRenderUserInfo?: boolean;
};

export type FetchMessagesQuery = {
  cursor?: string;
  inclusive?: boolean;
  latest?: number;
  limit?: number;
  oldest?: number;
};

const initStart = (conversationId: string) => ({
  type: MESSAGES.INIT_MESSAGES_START,
  payload: conversationId,
});

const initFailure = (conversationId: string, errorMessage: string) => ({
  type: MESSAGES.INIT_MESSAGES_FAILURE,
  payload: {
    conversationId,
    errorMessage,
  },
});

const initSuccess = (conversationId: string, data: object) => ({
  type: MESSAGES.INIT_MESSAGES_SUCCESS,
  payload: {
    conversationId,
    data,
  },
});

const MessageActions = {
  initStart,
  initSuccess,
  initFailure,
};

export default MessageActions;
