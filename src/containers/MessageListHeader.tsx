import { Rectangle, RowLayout, Text } from 'react-qml';
import { connect } from 'react-redux';
import React from 'react';

import FontAwesome from '../components/FontAwesome';
import { getSelectedConversation } from '../reducers/selectors';
import { RootState } from '../reducers';
import { Conversation } from '../actions/conversation-actions';

const connectToRedux = connect(
  (state: RootState) => ({
    selectedConversation: getSelectedConversation(state),
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
    y: 70,
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

type Props = {
  selectedConversation: Conversation | null | undefined;
};

class MessageListHeader extends React.Component<Props> {
  render() {
    const convoName = this.props.selectedConversation
      ? this.props.selectedConversation.name
      : '';

    return (
      <Rectangle style={styles.header}>
        <RowLayout anchors={fillParent} spacing={0}>
          <Text text={convoName} style={styles.headerText} />
          <FontAwesome
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
