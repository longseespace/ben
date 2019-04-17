import React from 'react';
import { RowLayout, Rectangle } from 'react-qml';
import TeamList from './TeamList';
import ChannelLoadingView from '../components/ChannelLoadingView';
import ChannelList from './ChannelList';
import MessageLoadingView from '../components/MessageLoadingView';
import MessageList from './MessageList';
import { connect } from 'react-redux';
import { RootState } from '../reducers';
import { getSelectedWorkspace } from '../reducers/selectors';
import { SingleWorkspaceState } from '../reducers/workspaces-reducers';

const connectToRedux = connect(
  (state: RootState) => ({
    selectedWorkspace: getSelectedWorkspace(state),
  }),
  {}
);

type Props = {
  selectedWorkspace: SingleWorkspaceState | undefined;
};

class DesktopLayout extends React.PureComponent<Props> {
  render() {
    const { selectedWorkspace } = this.props;

    const workspaceInitStatus = selectedWorkspace
      ? selectedWorkspace.initStatus
      : 'idle';

    return (
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
          {workspaceInitStatus === 'started' ? (
            <MessageLoadingView />
          ) : (
            workspaceInitStatus === 'success' && <MessageList />
          )}
        </Rectangle>
      </RowLayout>
    );
  }
}

export default connectToRedux(DesktopLayout);
