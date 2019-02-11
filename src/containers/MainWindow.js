import { Rectangle, RowLayout, Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  hideWindow,
  mainWindowVisibilitySelector,
  showWindow,
} from '../state/window';
import AppMenu from './AppMenu';
import ErrorBoundary from '../components/ErrorBoundary';
import WorkspaceList from './WorkspaceList';

const connectToRedux = connect(
  state => ({
    visible: mainWindowVisibilitySelector(state),
  }),
  {
    onClose: () => hideWindow('main'),
    onOpen: () => showWindow('main'),
  }
);

class MainWindow extends React.Component {
  windowRef = React.createRef();

  onClosing = ev => {
    // we don't want default behavior
    // window visibility will be controlled by component's prop
    ev.accepted = false;

    // should dispatch close action here
    this.props.onClose();
  };

  onAppStateChanged = state => {
    // on app activate, show the window (if already closed)
    const { visible, onOpen } = this.props;
    if (!visible && state === Qt.ApplicationActive) {
      onOpen();
    }
  };

  componentDidMount() {
    Qt.application.stateChanged.connect(this.onAppStateChanged);
  }

  componentWillUnmount() {
    Qt.application.stateChanged.disconnect(this.onAppStateChanged);
  }

  render() {
    const { visible } = this.props;
    return (
      <Window
        visible={visible}
        visibility={visible ? 'Windowed' : 'Hidden'}
        onClosing={this.onClosing}
        width={800}
        height={600}
        title="Tey"
        flags={Qt.Window | Qt.WindowFullscreenButtonHint}
      >
        <ErrorBoundary>
          <AppMenu />
          <RowLayout anchors={{ fill: 'parent' }} spacing={0}>
            <Rectangle
              width={68}
              Layout={{
                fillHeight: true,
              }}
              color="#191F26"
            >
              <WorkspaceList />
            </Rectangle>
            <Rectangle
              width={220}
              Layout={{
                fillHeight: true,
              }}
              color="#323E4C"
            />
            <Rectangle
              Layout={{
                fillWidth: true,
                fillHeight: true,
              }}
              color="#FFFFFF"
            />
          </RowLayout>
          {/* <SignInWindow
            visible={signinWindowVisible}
            onClosing={this.onSiginWindowClosing}
          /> */}
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(MainWindow);
