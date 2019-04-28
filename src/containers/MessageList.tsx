import { ColumnLayout } from 'react-qml';
import React from 'react';

import MessageListFooter from './MessageListFooter';
import MessageListHeader from './MessageListHeader';
import { connect } from 'react-redux';
import { RootState } from '../reducers';

const connectToRedux = connect(
  (state: RootState) => ({}),
  {}
);

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

type Props = {
  messageList: Array<any>;
};

class MessageList extends React.PureComponent<Props> {
  render() {
    return (
      <ColumnLayout anchors={fillParent} style={styles.container}>
        <MessageListHeader />
        <MessageListFooter />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(MessageList);
