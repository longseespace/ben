import { ColumnLayout, Rectangle } from 'react-qml';
import React from 'react';

import MessageListFooter from './MessageListFooter';
import MessageListHeader from './MessageListHeader';

const fillParent = { fill: 'parent' };

const styles = {
  container: {
    spacing: 0,
  },
  listLayout: {
    fillWidth: true,
    fillHeight: true,
  },
};

class MessageList extends React.PureComponent {
  render() {
    return (
      <ColumnLayout anchors={fillParent} style={styles.container}>
        <MessageListHeader />
        <Rectangle style={styles.listLayout} />
        <MessageListFooter />
      </ColumnLayout>
    );
  }
}

export default MessageList;
