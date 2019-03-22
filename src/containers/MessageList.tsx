import { ColumnLayout } from 'react-qml';
import React from 'react';

import MessageListFooter from './MessageListFooter';
import MessageListHeader from './MessageListHeader';
import { Message } from '../actions/timelines-actions';
import ListView from '../components/ListView';
import MessageDelegate from '../components/MessageDelegate.qml';
import { connect } from 'react-redux';
import { RootState } from '../reducers';
import { getMessageList } from '../reducers/selectors';

const connectToRedux = connect(
  (state: RootState) => ({
    messageList: getMessageList(state),
  }),
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
  messageList: Array<Message>;
};

class MessageList extends React.PureComponent<Props> {
  keyExtractor = (item: Message) => item.client_msg_id;

  render() {
    return (
      <ColumnLayout anchors={fillParent} style={styles.container}>
        <MessageListHeader />
        <ListView
          data={this.props.messageList}
          keyExtractor={this.keyExtractor}
          DelegateComponent={MessageDelegate}
          style={styles.listLayout}
          initialViewAt="end"
          boundsBehavior={ListView.StopAtBounds}
          boundsMovement={ListView.StopAtBounds}
          focus
          keyNavigationEnabled={false}
        />
        <MessageListFooter />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(MessageList);
