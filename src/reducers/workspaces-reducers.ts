import { FluxStandardAction } from 'flux-standard-action';
import { StringMap } from '../constants';
import { WORKSPACE } from '../actions';

export enum InitStatus {
  Started = 'started',
  Success = 'success',
  Failure = 'failure',
}

type SingleWorkspaceState = {
  initStatus?: InitStatus;
  errorMessage?: string;
};

type WorkspacesState = StringMap<SingleWorkspaceState>;

export function reducer(
  state: WorkspacesState = {},
  action: FluxStandardAction<any, void>
): WorkspacesState {
  switch (action.type) {
    case WORKSPACE.INIT_WORKSPACE_START:
      return initStart(state, action.payload);
    case WORKSPACE.INIT_WORKSPACE_SUCCESS:
      return initSuccess(state, action.payload);
    case WORKSPACE.INIT_WORKSPACE_FAILURE:
      return initFailure(state, action.payload);
    default:
      return state;
  }
}

function initStart(state: WorkspacesState, teamId: string) {
  return { ...state, [teamId]: { initStatus: InitStatus.Started } };
}

function initSuccess(state: WorkspacesState, teamId: string) {
  return { ...state, [teamId]: { initStatus: InitStatus.Success } };
}

function initFailure(state: WorkspacesState, teamId: string) {
  return { ...state, [teamId]: { initStatus: InitStatus.Failure } };
}

export default reducer;
