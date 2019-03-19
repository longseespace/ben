import { Rectangle, RowLayout, Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import AppMenu from './AppMenu';
import ErrorBoundary from '../components/ErrorBoundary';
import SigninWindow from './SigninWindow';
import { QQuickCloseEvent } from 'react-qml/dist/components/QtQuick';
import { QQuickWindow } from 'react-qml/dist/components/QtQuickWindow';
import { getAccounts } from '../reducers/selectors';
import { AccountsState } from '../reducers/accounts-reducer';
import { RootState } from '../reducers';
import TeamList from './TeamList';
import ChannelList from './ChannelList';
import { initWorkspace } from '../actions/workspace-actions';

const connectToRedux = connect(
  (state: RootState) => ({
    accounts: getAccounts(state),
  }),
  {
    initWorkspace,
  }
);

// use localStorage since its API is sync
const windowX = localStorage.getItem('windowX') || 100;
const windowY = localStorage.getItem('windowY') || 100;
const windowWidth = localStorage.getItem('windowWidth') || 800;
const windowHeight = localStorage.getItem('windowHeight') || 600;

type Props = {
  accounts: AccountsState;
  initWorkspace: Function;
};

type State = {
  visible: boolean;
};

class MainWindow extends React.Component<Props, State> {
  private windowRef = React.createRef<QQuickWindow>();

  state: State = {
    visible: true,
  };

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
    this.setState({ visible: false });
  };

  onAppStateChanged = (state: any) => {
    // on app activate, show the window (if already closed)
    const $window = this.windowRef.current;
    if ($window && !$window.visible && state === Qt.ApplicationActive) {
      this.setState({ visible: true });
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
    const { visible } = this.state;
    return (
      <Window
        objectName="MainWindow"
        visible={visible}
        visibility={visible ? 'Windowed' : 'Hidden'}
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
              <ChannelList />
            </Rectangle>
            <Rectangle
              Layout={{
                fillWidth: true,
                fillHeight: true,
              }}
              color="#FFFFFF"
            >
              {/* <MessageList /> */}
            </Rectangle>
          </RowLayout>
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(MainWindow);
