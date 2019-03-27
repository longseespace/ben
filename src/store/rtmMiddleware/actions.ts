import { RTM } from './constants';

export type RTMConnectPayload = {
  teamId: string;
  token: string;
};

export const connectToWorkspace = (teamId: string, token: string) => ({
  type: RTM.RTM_CONNECT,
  payload: {
    teamId,
    token,
  } as RTMConnectPayload,
});

export const connectSuccess = (teamId: string) => ({
  type: RTM.RTM_CONNECT_SUCCESS,
  payload: teamId,
});

export const connectFailure = (teamId: string, error: any) => ({
  type: RTM.RTM_CONNECT_FAILURE,
  payload: {
    teamId,
    error,
  },
});
