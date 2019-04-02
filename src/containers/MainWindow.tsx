import { Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import AppMenu from './AppMenu';
import AppTrayIcon from './AppTrayIcon';
import ErrorBoundary from '../components/ErrorBoundary';
import SigninWindow from './SigninWindow';
import { QQuickCloseEvent } from 'react-qml/dist/components/QtQuick';
import {
  QQuickWindow,
  QQuickScreenAttached,
} from 'react-qml/dist/components/QtQuickWindow';
import {
  getAccounts,
  getMainWindowSettings,
  getSelectedTeamId,
} from '../reducers/selectors';
import { AccountsState } from '../reducers/accounts-reducer';
import { RootState } from '../reducers';
import { initWorkspace } from '../actions/workspace-actions';
import {
  closeMainWindow,
  openMainWindow,
  setWindowVisibility,
} from '../actions/window-actions';
import { SingleWindowState } from '../reducers/windows-reducers';
import { isDesktopOS, isTablet, isPhone } from '../helpers';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

const connectToRedux = connect(
  (state: RootState) => ({
    accounts: getAccounts(state),
    selectedTeamId: getSelectedTeamId(state),
    settings: getMainWindowSettings(state),
  }),
  {
    initWorkspace,
    closeMainWindow,
    openMainWindow,
    setWindowVisibility,
  }
);

const styles = {
  desktop: {
    // use localStorage since its API is sync
    x: localStorage.getItem('windowX') || 100,
    y: localStorage.getItem('windowY') || 100,
    width: localStorage.getItem('windowWidth') || 100,
    height: localStorage.getItem('windowHeight') || 100,
  },
  mobile: {},
};

type Props = {
  accounts: AccountsState;
  selectedTeamId: string | null | undefined;
  settings: SingleWindowState;
  initWorkspace: Function;
  closeMainWindow: Function;
  openMainWindow: Function;
  setWindowVisibility: Function;
};

type WithScreen = {
  Screen: QQuickScreenAttached;
};

class MainWindow extends React.Component<Props> {
  private windowRef = React.createRef<QQuickWindow & WithScreen>();

  onClosing = (ev: QQuickCloseEvent) => {
    // persist window's geometry
    const { settings } = this.props;
    const isInNormalForm =
      settings.visibility === 'Windowed' || settings.visibility === 2;

    const $window = this.windowRef.current;
    if ($window && isInNormalForm) {
      localStorage.setItem('windowX', String($window.x));
      localStorage.setItem('windowY', String($window.y));
      localStorage.setItem('windowWidth', String($window.width));
      localStorage.setItem('windowHeight', String($window.height));
    }

    ev.accepted = true;
    this.props.closeMainWindow();
  };

  onVisibilityChanged = (visibility: any) => {
    const { settings } = this.props;
    if (settings.visibility !== visibility) {
      this.props.setWindowVisibility('main', visibility);
    }
  };

  onAppStateChanged = (state: any) => {
    // on app activate, show the window (if already closed)
    const $window = this.windowRef.current;
    if ($window && !$window.visible && state === Qt.ApplicationActive) {
      // open
      this.props.openMainWindow();
    }
  };

  componentDidMount() {
    // TODO: change this to epic instead
    if (this.props.selectedTeamId) {
      const account = this.props.accounts[this.props.selectedTeamId];
      if (account) {
        this.props.initWorkspace(account.teamId, account.token, false);
      }
    }

    setTimeout(() => {
      Object.keys(this.props.accounts).forEach(id => {
        if (this.props.selectedTeamId !== id && this.props.accounts[id]) {
          const account = this.props.accounts[id];
          this.props.initWorkspace(account.teamId, account.token, false);
        }
      });
    }, 1000);

    Qt.application.stateChanged.connect(this.onAppStateChanged);
  }

  componentWillUnmount() {
    Qt.application.stateChanged.disconnect(this.onAppStateChanged);
  }

  render() {
    const { settings } = this.props;
    return (
      <Window
        objectName="MainWindow"
        visible={settings.visible}
        visibility={settings.visibility}
        onVisibilityChanged={this.onVisibilityChanged}
        onClosing={this.onClosing}
        style={isDesktopOS ? styles.desktop : styles.mobile}
        title={settings.title}
        flags={Qt.Window | Qt.WindowFullscreenButtonHint}
        ref={this.windowRef}
      >
        <ErrorBoundary>
          <AppMenu />
          <AppTrayIcon />
          <SigninWindow />
          {(isDesktopOS || isTablet) && <DesktopLayout />}
          {isPhone && <MobileLayout />}
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(MainWindow);
