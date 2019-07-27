import { ColumnLayout } from 'react-qml';
import React from 'react';

import MessageListFooter from './MessageListFooter';
import MessageListHeader from './MessageListHeader';
import { connect } from 'react-redux';
import { RootState } from '../reducers';
import FlatList from '../components/FlatList';
import { Message } from '../actions/message-actions';
import { MessageViewState } from '../reducers/messages-reducers';
import { getCurrentMessageState, getAllUsers } from '../reducers/selectors';
import MessageListItem from './MessageListItem';
import UserActions from '../actions/user-actions';
import { UsersState } from '../reducers/users-reducers';

const connectToRedux = connect(
  (state: RootState) => ({
    allUsers: getAllUsers(state),
    messageViewState: getCurrentMessageState(state),
  }),
  {
    fetchUser: UserActions.fetchStart,
  }
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
  allUsers: UsersState;
  fetchUser: Function;
};

class MessageList extends React.PureComponent<Props> {
  keyExtractor = (item: Message) => item.ts;

  renderItem = (item: Message) => (
    <MessageListItem
      userId={item.user}
      allUsers={this.props.allUsers}
      fetchUser={this.props.fetchUser}
      message={item.text}
      ts={item.ts}
      key={item.ts}
      shouldRenderUserInfo={item.shouldRenderUserInfo}
    />
  );

  render() {
    const { messageViewState, allUsers } = this.props;
    const messageList = messageViewState ? messageViewState.messages : [];
    const extraData = allUsers;

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
