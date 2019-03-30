import { QQuickScreenInfo } from 'react-qml/dist/components/QtQuickWindow';

export const MainScreen = Qt.application.screens[0] as QQuickScreenInfo;
export const screenWidth = Math.min(MainScreen.width, MainScreen.height);
export const screenHeight = Math.max(MainScreen.width, MainScreen.height);

export const isDesktopOS = ['osx', 'windows', 'linux'].includes(Qt.platform.os);
export const isMobileOS = ['ios', 'android'].includes(Qt.platform.os);

export const isTablet = isMobileOS && screenWidth > 400;
export const isPhone = isMobileOS && screenWidth < 400;
