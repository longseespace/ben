import { WINDOWS } from '.';

export const openWindow = (windowId: string) => ({
  type: WINDOWS.OPEN_WINDOW,
  payload: windowId,
});

export const closeWindow = (windowId: string) => ({
  type: WINDOWS.CLOSE_WINDOW,
  payload: windowId,
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

export const enterFullScreen = (windowId: string) =>
  setWindowVisibility(windowId, 'FullScreen');

// alias
export const openSigninWindow = () => openWindow('signin');
export const closeSigninWindow = () => closeWindow('signin');
export const openMainWindow = () => openWindow('main');
export const closeMainWindow = () => closeWindow('main');
