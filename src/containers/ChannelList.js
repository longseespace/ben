import { Rectangle, Text, ColumnLayout } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { conversationListSelector } from '../state/conversation';
import { selectedTeamSelector } from '../state/team';
import ChannelDelegate from '../components/ChannelDelegate.qml';
import ChannelHighlight from '../components/ChannelHighlight.qml';
import ListView from '../components/ListView';
import SectionDelegate from '../components/SectionDelegate.qml';

const connectToRedux = connect(
  state => ({
    selectedTeam: selectedTeamSelector(state),
    conversationList: conversationListSelector(state),
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
    const { conversationList = [], selectedTeam = {} } = this.props;
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
            font={{ pointSize: 18, weight: 'Bold' }}
            style={styles.headerText}
          />
        </Rectangle>
        <ListView
          data={conversationList}
          sectionProperty="section"
          DelegateComponent={ChannelDelegate}
          HighlightComponent={ChannelHighlight}
          SectionDelegateComponent={SectionDelegate}
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
