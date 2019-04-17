import { FluxStandardAction } from 'flux-standard-action';
import { ACTIONS as APIAction } from 'redux-api-call';
import { StringMap } from '../constants';
import {
  Timeline,
  TimelineSetPayload,
  Message,
} from '../actions/timelines-actions';
import { TIMELINES } from '../actions';
import { standardizeMessage } from '../actions/helpers';
import { RTM } from '../store/rtmMiddleware/constants';

export type TimelinesState = StringMap<Timeline>;

export const initialState: TimelinesState = {};

export function reducer(
  state: TimelinesState = initialState,
  action: FluxStandardAction<any, void>
): TimelinesState {
  if (action.type === TIMELINES.SET_INITIAL_TIMELINE) {
    return setInitialTimeline(state, action.payload);
  }

  if (
    action.type === APIAction.COMPLETE &&
    action.payload.name === TIMELINES.FETCH_MESSAGES
  ) {
    return handleMessagesLoaded(state, action.payload);
  }

  if (action.type === RTM.RTM_EVENT && action.payload.type === 'message') {
    return handleMessageReceived(state, action.payload);
  }

  return state;
}

function handleMessagesLoaded(state: TimelinesState, payload: any) {
  const channel = payload.ref.channel;
  const query = payload.ref.query;
  const messages = payload.json.messages.reverse();

  const timeline = state[channel] || { messages: [] };
  timeline.query = query;
  const newMessages = messages.map(standardizeMessage);
  timeline.messages = [...newMessages, ...timeline.messages];
  timeline.hasMore = payload.json.has_more;
  timeline.pinCount = payload.json.pin_count;
  timeline.initialized = true;

  return { ...state, [channel]: timeline };
}

function setInitialTimeline(
  state: TimelinesState,
  payload: TimelineSetPayload
) {
  const { conversationId, timeline } = payload;

  return { ...state, [conversationId]: timeline };
}

function handleMessageReceived(state: TimelinesState, payload: any) {
  const channel = payload.channel;
  const timeline = state[channel] || {};

  const messages = timeline.messages || [];

  const message: Message = {
    client_msg_id: payload.client_msg_id,
    type: payload.subtype || '',
    text: payload.text,
    user: payload.user,
    ts: payload.ts,
  };
  const nextMessages = [...messages, message];

  const nextTimeline = {
    ...state[channel],
    messages: nextMessages,
  };

  return { ...state, [channel]: nextTimeline };
}

export default reducer;
