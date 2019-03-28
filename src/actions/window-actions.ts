import { WINDOWS } from '.';
import { SimpleThunkAction } from '../constants';
import { RootState } from '../reducers';

export const openWindow = (windowId: string) => ({
  type: WINDOWS.OPEN_WINDOW,
  payload: windowId,
});

export const closeWindow = (windowId: string) => ({
  type: WINDOWS.CLOSE_WINDOW,
  payload: windowId,
});

export type WindowTitlePayload = {
  windowId: string;
  title: string;
};
export const setWindowTitle = (windowId: string, title: string) => ({
  type: WINDOWS.SET_TITLE,
  payload: { windowId, title } as WindowTitlePayload,
});

export type WindowVisibilityPayload = {
  windowId: string;
  visibility: string;
};
export const setWindowVisibility = (windowId: string, visibility: string) => ({
  type: WINDOWS.SET_VISIBILITY,
  payload: {
    windowId,
    visibility,
  } as WindowVisibilityPayload,
});

export const minimizeWindow = (windowId: string) =>
  setWindowVisibility(windowId, 'Minimized');

export const maximizeWindow = (windowId: string) =>
  setWindowVisibility(windowId, 'Maximized');

export const toggleMaximize = (windowId: string): SimpleThunkAction => (
  dispatch,
  getState
) => {
  const state = getState() as RootState;
  const windowSettings = state.windows[windowId];
  const nextVisibility =
    windowSettings.visibility === 'Windowed' || windowSettings.visibility === 2
      ? 'Maximized'
      : 'Windowed';
  dispatch(setWindowVisibility(windowId, nextVisibility));
};

export const enterFullScreen = (windowId: string) =>
  setWindowVisibility(windowId, 'FullScreen');

// alias
export const openSigninWindow = () => openWindow('signin');
export const closeSigninWindow = () => closeWindow('signin');
export const openMainWindow = () => openWindow('main');
export const closeMainWindow = () => closeWindow('main');
