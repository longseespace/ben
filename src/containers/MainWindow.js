import { Rectangle, RowLayout, Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import AppMenu from './AppMenu';
import ErrorBoundary from '../components/ErrorBoundary';
import WorkspaceList from './WorkspaceList';

const connectToRedux = connect(
  state => ({
    value: state.counter,
  }),
  {
    onIncrement: () => ({ type: 'INCREMENT' }),
    onDecrement: () => ({ type: 'DECREMENT' }),
  }
);

class MainWindow extends React.PureComponent {
  windowRef = React.createRef();

  onAppStateChanged = state => {
    const $window = this.windowRef.current;
    // on app activate, show the window (if already closed)
    if ($window && state === Qt.ApplicationActive) {
      $window.show();
    }
  };

  componentDidMount() {
    Qt.application.stateChanged.connect(this.onAppStateChanged);
  }

  componentWillUnmount() {
    Qt.application.stateChanged.disconnect(this.onAppStateChanged);
  }

  render() {
    return (
      <Window
        visible
        width={800}
        height={600}
        title="Tey"
        flags={Qt.Window | Qt.WindowFullscreenButtonHint}
        ref={this.windowRef}
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
