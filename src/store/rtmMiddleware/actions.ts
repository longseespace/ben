import { RTM } from './constants';
import { FluxStandardAction } from 'flux-standard-action';

export type RTMActionMeta = { teamId: string };
export type RTMActionType = FluxStandardAction<any, RTMActionMeta>;

const connectToWorkspace = (teamId: string, token: string) => ({
  type: RTM.RTM_CONNECT,
  payload: {
    teamId,
    token,
  },
  meta: {
    teamId,
  },
});

const connectSuccess = (teamId: string) => ({
  type: RTM.RTM_CONNECT_SUCCESS,
  payload: teamId,
  meta: {
    teamId,
  },
});

const connectFailure = (teamId: string, error: any) => ({
  type: RTM.RTM_CONNECT_FAILURE,
  payload: {
    teamId,
    error,
  },
  meta: {
    teamId,
  },
});

const send = (teamId: string, payload: object) => ({
  type: RTM.RTM_SEND,
  payload,
  meta: {
    teamId,
  },
});

const Actions = {
  connectToWorkspace,
  connectSuccess,
  connectFailure,
  send,
};

export default Actions;
