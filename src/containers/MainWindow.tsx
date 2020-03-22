import { MainWindow, Window } from 'react-qml';
import { connect } from 'react-redux';
import React, { useRef, useEffect } from 'react';

import AppMenu from './AppMenu';

import AppTrayIcon from './AppTrayIcon';
import ErrorBoundary from '../components/ErrorBoundary';
import SigninWindow from './SigninWindow';
import { QQuickCloseEvent } from 'react-qml/QtQuick';
import {
  QQuickWindow,
  QQuickScreenAttached,
} from 'react-qml/dist/components/QtQuickWindow';
import {
  getSortedTeamIds,
  getAccounts,
  getMainWindowSettings,
  getSelectedTeamId,
} from '../reducers/selectors';
import { AccountsState } from '../reducers/accounts-reducer';
import { RootState } from '../reducers';
import WorkspaceActions from '../actions/workspace-actions';
import WindowActions from '../actions/window-actions';
import { SingleWindowState } from '../reducers/windows-reducers';
import { isDesktopOS, isTablet, isPhone } from '../helpers';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';
import { inspect } from 'util';

const connectToRedux = connect(
  (state: RootState) => ({
    accounts: getAccounts(state),
    selectedTeamId: getSelectedTeamId(state),
    settings: getMainWindowSettings(state),
    sortedTeamIds: getSortedTeamIds(state),
  }),
  {
    initWorkspace: WorkspaceActions.initWorkspace,
    closeMainWindow: WindowActions.closeMainWindow,
    openMainWindow: WindowActions.openMainWindow,
    setWindowVisibility: WindowActions.setWindowVisibility,
  }
);

const styles = {
  desktop: {},
  mobile: {},
};

type Props = {
  accounts: AccountsState;
  selectedTeamId: string | null | undefined;
  sortedTeamIds: Array<string>;
  settings: SingleWindowState;
  initWorkspace: Function;
  closeMainWindow: Function;
  openMainWindow: Function;
  setWindowVisibility: Function;
};

type WithScreen = {
  Screen: QQuickScreenAttached;
};

function AppWindow(props: Props) {
  const { settings } = props;

  // handle window state
  const { setWindowVisibility } = props;
  const handleVisibilityChanged = (visibility: any) => {
    if (settings.visibility !== visibility) {
      setWindowVisibility('main', visibility);
    }
  };

  const { closeMainWindow } = props;
  const handleClosing = (ev: QQuickCloseEvent) => {
    ev.accepted = true;
    closeMainWindow();
  };

  // window ref
  const windowRef = useRef<QQuickWindow & WithScreen>(null);

  // handle app state
  const { openMainWindow } = props;
  const handleAppStateChanged = (state: any) => {
    // on app activate, show the window (if already closed)
    const $window = windowRef.current;
    if ($window && !$window.visible && state === Qt.ApplicationActive) {
      // open
      openMainWindow();
    }
  };

  useEffect(() => {
    Qt.application.stateChanged.connect(handleAppStateChanged);
    return () => {
      Qt.application.stateChanged.disconnect(handleAppStateChanged);
    };
  }, [windowRef.current]);

  // load teams
  const { selectedTeamId, sortedTeamIds, accounts, initWorkspace } = props;
  useEffect(() => {
    // TODO: change this to epic instead
    if (selectedTeamId) {
      const account = accounts[selectedTeamId];
      if (account) {
        initWorkspace(account.teamId, account.token, true);
      }
    }

    setTimeout(() => {
      sortedTeamIds.forEach(id => {
        if (selectedTeamId !== id && accounts[id]) {
          const account = accounts[id];
          initWorkspace(account.teamId, account.token, false);
        }
      });
    }, 1000);
  }, []);

  return (
    <MainWindow
      visible={settings.visible}
      visibility={settings.visibility}
      // onVisibilityChanged={handleVisibilityChanged}
      onClosing={handleClosing}
      style={isDesktopOS ? styles.desktop : styles.mobile}
      title={settings.title}
      flags={Qt.Window | Qt.WindowFullscreenButtonHint}
      ref={windowRef}
    >
      <ErrorBoundary>
        <AppMenu />
        <AppTrayIcon />
        <SigninWindow />
        {(isDesktopOS || isTablet) && <DesktopLayout />}
        {isPhone && <MobileLayout />}
      </ErrorBoundary>
    </MainWindow>
  );
}

export default connectToRedux(AppWindow);
