import { ColumnLayout } from 'react-qml';
import React from 'react';

import MessageListFooter from './MessageListFooter';
import MessageListHeader from './MessageListHeader';
import { connect } from 'react-redux';
import { RootState } from '../reducers';
import FlatList from '../components/FlatList';
import { Message } from '../actions/message-actions';
import { MessageViewState } from '../reducers/messages-reducers';
import { getCurrentMessageState } from '../reducers/selectors';
import MessageListItem from './MessageListItem';

const connectToRedux = connect(
  (state: RootState) => ({
    messageViewState: getCurrentMessageState(state),
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
  messageViewState: MessageViewState | undefined | null;
};

class MessageList extends React.PureComponent<Props> {
  keyExtractor = (item: Message) => item.ts;

  renderItem = (item: Message) => (
    <MessageListItem userId={item.user} message={item.text} ts={item.ts} />
  );

  render() {
    const { messageViewState } = this.props;
    const messageList = messageViewState ? messageViewState.messages : [];
    const extraData = {};

    return (
      <ColumnLayout anchors={fillParent} style={styles.container}>
        <MessageListHeader />
        <FlatList
          data={messageList}
          extraData={extraData}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          style={styles.listLayout}
        />
        <MessageListFooter />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(MessageList);
