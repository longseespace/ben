import { makeFetchAction } from 'redux-api-call';

import { TIMELINES } from '.';
import { API_ROOT } from '../constants';

export type Message = {
  client_msg_id: string;
  type: string;
  text: string;
  user: string;
  ts: number;
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

// ACTIONS
// ---------------
export const fetchMessages = FetchMessagesAPI.actionCreator;

export type TimelineSetPayload = {
  conversationId: string;
  timeline: Timeline;
};
export const setInitialTimeline = (
  conversationId: string,
  timeline: Timeline
) => ({
  type: TIMELINES.SET_INITIAL_TIMELINE,
  payload: {
    conversationId,
    timeline,
  } as TimelineSetPayload,
});

// export const fetchMessages = (
//   channel: string,
//   query: TimelineQuery = {}
// ): SimpleThunkAction => (dispatch, getState) => {
//   const state = getState() as RootState;
//   const selectedTeamId = state.appTeams.selectedTeamId;
//   if (selectedTeamId) {
//     const account = state.accounts[selectedTeamId];
//     dispatch(FetchMessagesAPI.actionCreator(account.token, channel, query));
//   }
// };
