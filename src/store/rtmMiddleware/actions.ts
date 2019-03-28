import { RTM } from './constants';

export type RTMActionMeta = { teamId: string };

export const connectToWorkspace = (teamId: string, token: string) => ({
  type: RTM.RTM_CONNECT,
  payload: {
    teamId,
    token,
  },
  meta: {
    teamId,
  },
});

export const connectSuccess = (teamId: string) => ({
  type: RTM.RTM_CONNECT_SUCCESS,
  payload: teamId,
  meta: {
    teamId,
  },
});

export const connectFailure = (teamId: string, error: any) => ({
  type: RTM.RTM_CONNECT_FAILURE,
  payload: {
    teamId,
    error,
  },
  meta: {
    teamId,
  },
});

export const rtmSend = (teamId: string, payload: object) => ({
  type: RTM.RTM_SEND,
  payload,
  meta: {
    teamId,
  },
});
