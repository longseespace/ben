import { WINDOWS } from '.';

export const openWindow = (windowId: string) => ({
  type: WINDOWS.OPEN_WINDOW,
  payload: windowId,
});

export const closeWindow = (windowId: string) => ({
  type: WINDOWS.CLOSE_WINDOW,
  payload: windowId,
});

// alias
export const openSigninWindow = () => openWindow('signin');
export const closeSigninWindow = () => closeWindow('signin');
export const openMainWindow = () => openWindow('main');
export const closeMainWindow = () => closeWindow('main');
