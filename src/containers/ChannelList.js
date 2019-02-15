import { Rectangle, Text, ColumnLayout } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { channelListSelector } from '../state/conversation';
import { selectedTeamSelector } from '../state/team';
import ChannelDelegate from '../components/ChannelDelegate.qml';
import ChannelHighlight from '../components/ChannelHighlight.qml';
import ListView from '../components/ListView';

const connectToRedux = connect(
  state => ({
    channelList: channelListSelector(state),
    selectedTeam: selectedTeamSelector(state),
  }),
  {}
);

const styles = {
  container: {
    spacing: 0,
  },
  header: {
    color: '#323E4C',
    z: 1, // higher stack order
  },
  headerText: {
    color: 'white',
    x: 16,
    y: 16,
  },
};

class ChannelList extends React.PureComponent {
  render() {
    const { channelList = [], selectedTeam = {} } = this.props;
    return (
      <ColumnLayout anchors={{ fill: 'parent' }} style={styles.container}>
        <Rectangle
          style={styles.header}
          Layout={{
            preferredHeight: 50,
            fillWidth: true,
            alignment: Qt.AlignTop,
          }}
        >
          <Text
            text={selectedTeam.name}
            font={{ pointSize: 18, family: 'Roboto', weight: 'Bold' }}
            style={styles.headerText}
          />
        </Rectangle>
        <ListView
          data={channelList}
          DelegateComponent={ChannelDelegate}
          HighlightComponent={ChannelHighlight}
          Layout={{
            fillHeight: true,
            fillWidth: true,
            alignment: Qt.AlignTop,
          }}
          focus
          highlightMoveVelocity={-1}
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(ChannelList);
