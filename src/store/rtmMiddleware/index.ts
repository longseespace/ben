import { FluxStandardAction } from 'flux-standard-action';
import slack from '../../lib/slack';
import { RTM } from './constants';
import { RTMConnectPayload, connectSuccess, connectFailure } from './actions';
import { MiddlewareAPI, Dispatch } from 'redux';

export type RtmAction = FluxStandardAction<any, void>;

const socketMap = new Map<string, WebSocket>();

// private events
const connectionClosed = (teamId: string) => ({
  type: RTM.RTM_CONNECTION_CLOSED,
  payload: teamId,
});

const rtmEvent = (teamId: string, payload: any) => ({
  type: RTM.RTM_EVENT,
  payload,
  meta: { teamId },
});

// middleware
const middleware = (api: MiddlewareAPI) => (next: Dispatch) => async (
  action: RtmAction
) => {
  if (action.type === RTM.RTM_CONNECT) {
    const { teamId, token } = action.payload as RTMConnectPayload;

    const currentWs = socketMap.get(teamId);
    if (currentWs) {
      api.dispatch(connectSuccess(teamId));
    } else {
      try {
        const ws = await slack.rtmConnect(token);
        socketMap.set(teamId, ws);

        // setup events
        ws.onmessage = event => {
          try {
            const messageData = JSON.parse(event.data);
            api.dispatch(rtmEvent(teamId, messageData));
          } catch (error) {
            // invalid json message
            // ignore for now
            console.error('RTM: Invalid Message');
          }
        };

        ws.onclose = () => {
          api.dispatch(connectionClosed(teamId));
          socketMap.delete(teamId);
        };

        api.dispatch(connectSuccess(teamId));
      } catch (error) {
        api.dispatch(connectFailure(teamId, error));
      }
    }
  }

  return next(action);
};

export default middleware;
