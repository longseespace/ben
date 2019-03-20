import { Rectangle, RowLayout, Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import AppMenu from './AppMenu';
import ErrorBoundary from '../components/ErrorBoundary';
import SigninWindow from './SigninWindow';
import { QQuickCloseEvent } from 'react-qml/dist/components/QtQuick';
import { QQuickWindow } from 'react-qml/dist/components/QtQuickWindow';
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
import { closeMainWindow, openMainWindow } from '../actions/window-actions';
import { SingleWindowState } from '../reducers/windows-reducers';

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
  }
);

// use localStorage since its API is sync
const windowX = localStorage.getItem('windowX') || 100;
const windowY = localStorage.getItem('windowY') || 100;
const windowWidth = localStorage.getItem('windowWidth') || 800;
const windowHeight = localStorage.getItem('windowHeight') || 600;

type Props = {
  accounts: AccountsState;
  selectedWorkspace: SingleWorkspaceState | undefined;
  settings: SingleWindowState;
  initWorkspace: Function;
  closeMainWindow: Function;
  openMainWindow: Function;
};

class MainWindow extends React.Component<Props> {
  private windowRef = React.createRef<QQuickWindow>();

  onClosing = (ev: QQuickCloseEvent) => {
    // persist window's geometry
    const $window = this.windowRef.current;
    if ($window) {
      localStorage.setItem('windowX', String($window.x));
      localStorage.setItem('windowY', String($window.y));
      localStorage.setItem('windowWidth', String($window.width));
      localStorage.setItem('windowHeight', String($window.height));
    }

    ev.accepted = true;
    this.props.closeMainWindow();
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
  }

  componentWillUnmount() {
    Qt.application.stateChanged.disconnect(this.onAppStateChanged);
  }

  render() {
    const { selectedWorkspace, settings } = this.props;
    const workspaceInitStatus = selectedWorkspace
      ? selectedWorkspace.initStatus
      : 'started';
    return (
      <Window
        objectName="MainWindow"
        visible={settings.visible}
        onClosing={this.onClosing}
        x={windowX}
        y={windowY}
        width={windowWidth}
        height={windowHeight}
        title="Ben"
        flags={Qt.Window | Qt.WindowFullscreenButtonHint}
        ref={this.windowRef}
      >
        <ErrorBoundary>
          <AppMenu />
          <SigninWindow />
          <RowLayout anchors={{ fill: 'parent' }} spacing={0}>
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
                <ChannelList />
              )}
            </Rectangle>
            <Rectangle
              Layout={{
                fillWidth: true,
                fillHeight: true,
              }}
              color="#FFFFFF"
            >
              {workspaceInitStatus === 'started' && <MessageLoadingView />}
            </Rectangle>
          </RowLayout>
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(MainWindow);
