import { FluxStandardAction } from 'flux-standard-action';
import { StringMap } from '../constants';
import { WINDOWS } from '../actions';
import { WindowVisibilityPayload } from '../actions/window-actions';

export type SingleWindowState = {
  visible: boolean;
  visibility: string | number;
};

export type WindowsState = StringMap<SingleWindowState>;

const initialState: WindowsState = {
  main: {
    visible: true,
    visibility: 'Windowed',
  },
  signin: {
    visible: false,
    visibility: 'Windowed',
  },
};

export function reducer(
  state: WindowsState = initialState,
  action: FluxStandardAction<any, void>
): WindowsState {
  switch (action.type) {
    case WINDOWS.OPEN_WINDOW:
      return openWindow(state, action.payload);
    case WINDOWS.CLOSE_WINDOW:
      return closeWindow(state, action.payload);
    case WINDOWS.SET_VISIBILITY:
      return setVisibility(state, action.payload);
    default:
      return state;
  }
}

function openWindow(state: WindowsState, windowId: string) {
  const windowSettings = state[windowId];
  return { ...state, [windowId]: { ...windowSettings, visible: true } };
}

function closeWindow(state: WindowsState, windowId: string) {
  const windowSettings = state[windowId];
  return { ...state, [windowId]: { ...windowSettings, visible: false } };
}

function setVisibility(state: WindowsState, payload: WindowVisibilityPayload) {
  const { windowId, visibility } = payload;
  const windowSettings = state[windowId];
  return {
    ...state,
    [windowId]: { ...windowSettings, visibility },
  };
}

export default reducer;
