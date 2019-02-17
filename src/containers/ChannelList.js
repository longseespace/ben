import { ColumnLayout, Rectangle, RowLayout, Text } from 'react-qml';
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
  },
  notificationStatus: {
    color: '#ccc',
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
          <RowLayout anchors={{ fill: 'parent' }}>
            <Text
              text={selectedTeam.name}
              font={{ pointSize: 20, weight: 'Bold', family: 'Lato' }}
              style={styles.headerText}
              Layout={{ leftMargin: 16, fillWidth: true }}
            />
            <Text
              text={`\uf0f3`}
              font={{
                pointSize: 20,
                family: 'Font Awesome 5 Free',
              }}
              style={styles.notificationStatus}
              Layout={{ rightMargin: 16, preferredWidth: 20 }}
            />
          </RowLayout>
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
