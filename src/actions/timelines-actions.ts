import { makeFetchAction } from 'redux-api-call';

import { TIMELINES } from '.';
import { API_ROOT, SimpleThunkAction } from '../constants';
import {
  getSelectedTeamToken,
  getLatestMessage,
  getSelectedConversationId,
} from '../reducers/selectors';
import { RootState } from '../reducers';

export type Message = {
  client_msg_id: string;
  type: string;
  text: string;
  user: string;
  ts: string;
};

export type TimelineQuery = {
  cursor?: string;
  inclusive?: boolean;
  latest?: number;
  limit?: number;
  oldest?: number;
};

export type Timeline = {
  messages: Array<Message>;
  query: TimelineQuery;
  hasMore?: boolean;
  pinCount?: number;
  initialized?: boolean;
};

// API
// ---------------
export const FetchMessagesAPI = makeFetchAction(
  TIMELINES.FETCH_MESSAGES,
  (token: string, channel: string, query: TimelineQuery = {}) => ({
    endpoint: `${API_ROOT}/conversations.history`,
    method: 'POST',
    form: {
      token: token,
      channel: channel,
      ...query,
    },
    ref: {
      channel,
      query,
    },
  })
);

export const MarkAsReadAPI = makeFetchAction(
  TIMELINES.IM_MARK,
  (token: string, channel: string, ts: string) => ({
    endpoint: `${API_ROOT}/im.mark`,
    method: 'POST',
    form: {
      token,
      channel,
      ts,
    },
    ref: {
      channel,
    },
  })
);

// ACTIONS
// ---------------
const fetchMessages = FetchMessagesAPI.actionCreator;
const imMark = MarkAsReadAPI.actionCreator;

export type TimelineSetPayload = {
  conversationId: string;
  timeline: Timeline;
};

const setInitialTimeline = (conversationId: string, timeline: Timeline) => ({
  type: TIMELINES.SET_INITIAL_TIMELINE,
  payload: {
    conversationId,
    timeline,
  } as TimelineSetPayload,
});

const markAsRead = (): SimpleThunkAction => (dispatch, getState) => {
  // not sure if we should do dis
  const state = getState() as RootState;
  const token = getSelectedTeamToken(state);
  const channel = getSelectedConversationId(state);
  const latestMessage = getLatestMessage(state);
  if (!token || !channel || !latestMessage) {
    return;
  }

  dispatch(imMark(token, channel, latestMessage.ts));
};

const TimelinesActions = {
  fetchMessages,
  setInitialTimeline,
  markAsRead,
};

export default TimelinesActions;
