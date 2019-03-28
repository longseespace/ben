import { FluxStandardAction } from 'flux-standard-action';
import { StringMap } from '../constants';
import { WINDOWS } from '../actions';
import {
  WindowVisibilityPayload,
  WindowTitlePayload,
} from '../actions/window-actions';

export type SingleWindowState = {
  visible: boolean;
  visibility: string | number;
  title?: string;
};

export type WindowsState = StringMap<SingleWindowState>;

const initialState: WindowsState = {
  main: {
    visible: true,
    visibility: 'Windowed',
    title: 'Ben',
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
    case WINDOWS.SET_TITLE:
      return setTitle(state, action.payload);
    default:
      return state;
  }
}

function openWindow(state: WindowsState, windowId: string) {
  const windowSettings = state[windowId];
  return {
    ...state,
    [windowId]: {
      ...windowSettings,
      visible: true,
      visibility: 'AutomaticVisibility',
    },
  };
}

function closeWindow(state: WindowsState, windowId: string) {
  const windowSettings = state[windowId];
  return {
    ...state,
    [windowId]: { ...windowSettings, visible: false, visibility: 'Hidden' },
  };
}

function setVisibility(state: WindowsState, payload: WindowVisibilityPayload) {
  const { windowId, visibility } = payload;
  const windowSettings = state[windowId];
  return {
    ...state,
    [windowId]: { ...windowSettings, visibility },
  };
}

function setTitle(state: WindowsState, payload: WindowTitlePayload) {
  const { windowId, title } = payload;
  const windowSettings = state[windowId];
  return {
    ...state,
    [windowId]: { ...windowSettings, title },
  };
}

export default reducer;
