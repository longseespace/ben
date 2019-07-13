import { WINDOWS } from '.';
import { SimpleThunkAction } from '../constants';
import { RootState } from '../reducers';

const openWindow = (windowId: string) => ({
  type: WINDOWS.OPEN_WINDOW,
  payload: windowId,
});

const closeWindow = (windowId: string) => ({
  type: WINDOWS.CLOSE_WINDOW,
  payload: windowId,
});

export type WindowTitlePayload = {
  windowId: string;
  title: string;
};

const setWindowTitle = (windowId: string, title: string) => ({
  type: WINDOWS.SET_TITLE,
  payload: { windowId, title } as WindowTitlePayload,
});

export type WindowVisibilityPayload = {
  windowId: string;
  visibility: string;
};

const setWindowVisibility = (windowId: string, visibility: string) => ({
  type: WINDOWS.SET_VISIBILITY,
  payload: {
    windowId,
    visibility,
  } as WindowVisibilityPayload,
});

const minimizeWindow = (windowId: string) =>
  setWindowVisibility(windowId, 'Minimized');

const maximizeWindow = (windowId: string) =>
  setWindowVisibility(windowId, 'Maximized');

const toggleMaximize = (windowId: string): SimpleThunkAction => (
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

const enterFullScreen = (windowId: string) =>
  setWindowVisibility(windowId, 'FullScreen');

// alias
const openSigninWindow = () => openWindow('signin');
const closeSigninWindow = () => closeWindow('signin');
const openMainWindow = () => openWindow('main');
const closeMainWindow = () => closeWindow('main');

// exports
const WindowActions = {
  openWindow,
  closeWindow,
  setWindowTitle,
  setWindowVisibility,
  minimizeWindow,
  maximizeWindow,
  toggleMaximize,
  enterFullScreen,
  // alias
  openSigninWindow,
  closeSigninWindow,
  openMainWindow,
  closeMainWindow,
};

export default WindowActions;
