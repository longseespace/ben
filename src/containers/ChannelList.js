import { Rectangle, Text, ColumnLayout } from 'react-qml';
import { connect } from 'react-redux';
import { filter, isEmpty, map } from 'lodash/fp';
import * as React from 'react';

import {
  channelListSelector,
  groupListSelector,
  imListSelector,
} from '../state/conversation';
import { selectedTeamIdSelector, selectedTeamSelector } from '../state/team';
import ChannelDelegate from '../components/ChannelDelegate.qml';
import ChannelHighlight from '../components/ChannelHighlight.qml';
import ListView from '../components/ListView';
import SectionDelegate from '../components/SectionDelegate.qml';

const addSection = section => map(item => ({ ...item, section }));
const filterOpen = filter(item => item.is_open || item.is_member);

const conversationListSelector = state => {
  const selectedTeamId = selectedTeamIdSelector(state);
  if (isEmpty(selectedTeamId)) {
    return [];
  }
  const channelList = addSection('Channels')(
    channelListSelector(state)[selectedTeamId]
  );
  const groupList = addSection('Channels')(
    groupListSelector(state)[selectedTeamId]
  );
  const imList = addSection('Direct Messages')(
    imListSelector(state)[selectedTeamId]
  );
  return filterOpen([...channelList, ...groupList, ...imList]);
};

const connectToRedux = connect(
  state => ({
    selectedTeam: selectedTeamSelector(state),
    conversationList: conversationListSelector(state),
    channelList: channelListSelector(state),
    groupList: groupListSelector(state),
    imList: imListSelector(state),
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
            font={{ pointSize: 18, family: 'Roboto', weight: 'Bold' }}
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
