import { Rectangle, RowLayout, Window } from 'react-qml';
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
  getSelectedWorkspace,
  getMainWindowSettings,
} from '../reducers/selectors';
import { AccountsState } from '../reducers/accounts-reducer';
import { RootState } from '../reducers';
import TeamList from './TeamList';
import ChannelList from './ChannelList';
import { initWorkspace } from '../actions/workspace-actions';
import ChannelLoadingView from '../components/ChannelLoadingView';
import MessageLoadingView from '../components/MessageLoadingView';
import { SingleWorkspaceState } from '../reducers/workspaces-reducers';
import {
  closeMainWindow,
  openMainWindow,
  setWindowVisibility,
} from '../actions/window-actions';
import { SingleWindowState } from '../reducers/windows-reducers';
import MessageList from './MessageList';
import { isDesktop } from '../constants';

const connectToRedux = connect(
  (state: RootState) => ({
    accounts: getAccounts(state),
    selectedWorkspace: getSelectedWorkspace(state),
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
  content: { fill: 'parent' },
};

type Props = {
  accounts: AccountsState;
  selectedWorkspace: SingleWorkspaceState | undefined;
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
    Object.keys(this.props.accounts).forEach(id => {
      const account = this.props.accounts[id];
      this.props.initWorkspace(account.teamId, account.token, false);
    });
    Qt.application.stateChanged.connect(this.onAppStateChanged);

    const $window = this.windowRef.current;
    if ($window) {
      console.log($window.Screen.width);
    }
  }

  componentWillUnmount() {
    Qt.application.stateChanged.disconnect(this.onAppStateChanged);
  }

  render() {
    const { selectedWorkspace, settings } = this.props;
    const workspaceInitStatus = selectedWorkspace
      ? selectedWorkspace.initStatus
      : 'idle';
    return (
      <Window
        objectName="MainWindow"
        visible={settings.visible}
        visibility={settings.visibility}
        onVisibilityChanged={this.onVisibilityChanged}
        onClosing={this.onClosing}
        style={isDesktop ? styles.desktop : styles.mobile}
        title={settings.title}
        flags={Qt.Window | Qt.WindowFullscreenButtonHint}
        ref={this.windowRef}
      >
        <ErrorBoundary>
          <AppMenu />
          <AppTrayIcon />
          <SigninWindow />
          <RowLayout anchors={styles.content} spacing={0}>
            <Rectangle
              Layout={{
                fillHeight: true,
                preferredWidth: 68,
              }}
              color="#191F26"
            >
              <TeamList />
            </Rectangle>
            <Rectangle
              width={220}
              Layout={{
                fillHeight: true,
              }}
              color="#323E4C"
            >
              {workspaceInitStatus === 'started' ? (
                <ChannelLoadingView />
              ) : (
                workspaceInitStatus === 'success' && <ChannelList />
              )}
            </Rectangle>
            <Rectangle
              Layout={{
                fillWidth: true,
                fillHeight: true,
              }}
              color="#FFFFFF"
            >
              {workspaceInitStatus === 'started' ? (
                <MessageLoadingView />
              ) : (
                workspaceInitStatus === 'success' && <MessageList />
              )}
            </Rectangle>
          </RowLayout>
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(MainWindow);
