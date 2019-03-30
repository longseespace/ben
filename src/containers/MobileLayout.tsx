import React from 'react';
import { RowLayout, Rectangle, QtQuickControls2 } from 'react-qml';
const { Drawer } = QtQuickControls2;
import TeamList from './TeamList';
import ChannelLoadingView from '../components/ChannelLoadingView';
import ChannelList from './ChannelList';
import MessageLoadingView from '../components/MessageLoadingView';
import MessageList from './MessageList';
import { connect } from 'react-redux';
import { RootState } from '../reducers';
import { getSelectedWorkspace } from '../reducers/selectors';
import { SingleWorkspaceState } from '../reducers/workspaces-reducers';
import { QQuickDrawer } from 'react-qml/dist/components/QtQuickControls2';
import { MainScreen } from '../helpers';

const connectToRedux = connect(
  (state: RootState) => ({
    selectedWorkspace: getSelectedWorkspace(state),
  }),
  {}
);

type Props = {
  selectedWorkspace: SingleWorkspaceState | undefined;
};

type State = {
  screenHeight: number;
};

class MobileLayout extends React.PureComponent<Props, State> {
  private drawerRef = React.createRef<QQuickDrawer>();

  state = {
    screenHeight: MainScreen.height,
  };

  constructor(props: Props) {
    super(props);

    MainScreen.desktopGeometryChanged.connect(this.onDesktopGeometryChanged);
  }

  componentWillUnmount() {
    MainScreen.desktopGeometryChanged.disconnect(this.onDesktopGeometryChanged);
  }

  onDesktopGeometryChanged = () => {
    this.setState({
      screenHeight: MainScreen.height,
    });
  };

  render() {
    const { selectedWorkspace } = this.props;
    const { screenHeight } = this.state;

    const workspaceInitStatus = selectedWorkspace
      ? selectedWorkspace.initStatus
      : 'idle';

    return (
      <React.Fragment>
        <Drawer width={288} height={screenHeight}>
          <RowLayout width={288} height={screenHeight} spacing={0}>
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
              Layout={{
                fillHeight: true,
                preferredWidth: 220,
              }}
              color="#323E4C"
            >
              {workspaceInitStatus === 'started' ? (
                <ChannelLoadingView />
              ) : (
                workspaceInitStatus === 'success' && <ChannelList />
              )}
            </Rectangle>
          </RowLayout>
        </Drawer>
        <Rectangle anchors={{ fill: 'parent' }} color="#FFFFFF">
          {workspaceInitStatus === 'started' ? (
            <MessageLoadingView />
          ) : (
            workspaceInitStatus === 'success' && <MessageList />
          )}
        </Rectangle>
      </React.Fragment>
    );
  }
}

export default connectToRedux(MobileLayout);
