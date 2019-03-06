import { get } from 'lodash';

import { Rectangle, RowLayout, Text } from 'react-qml';
import { connect } from 'react-redux';
import React from 'react';

import { selectedConversationSelector } from '../state/conversation';
import { selectedTeamSelector } from '../state/team';
import { selfSelector } from '../state/self';
import FontIcon from '../components/FontIcon';

const connectToRedux = connect(
  state => ({
    selectedTeam: selectedTeamSelector(state),
    selectedConversation: selectedConversationSelector(state),
    me: selfSelector(state),
  }),
  {}
);

const styles = {
  header: {
    color: '#fff',
    z: 1, // higher stack order
    preferredHeight: 70,
    fillWidth: true,
    alignment: Qt.AlignTop,
  },
  headerBorderBottom: {
    color: '#ccc',
    height: 1,
    y: 71,
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Lato',
    marginLeft: 16,
    fillWidth: true,
  },
  moreButton: {
    rightMargin: 16,
  },
};

// anchors
const fillParent = { fill: 'parent' };
const fullWidth = { left: 'parent.left', right: 'parent.right' };

class MessageListHeader extends React.Component {
  render() {
    const convoName = get(this.props, 'selectedConversation.name', '');

    return (
      <Rectangle style={styles.header}>
        <RowLayout anchors={fillParent} spacing={0}>
          <Text text={convoName} style={styles.headerText} />
          <FontIcon
            name="ellipsis-v"
            size={16}
            color="#333"
            solid
            style={styles.moreButton}
          />
        </RowLayout>
        <Rectangle style={styles.headerBorderBottom} anchors={fullWidth} />
      </Rectangle>
    );
  }
}

export default connectToRedux(MessageListHeader);
