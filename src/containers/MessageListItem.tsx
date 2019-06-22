import React from 'react';
import { Text, Column, RowLayout, Item, Image } from 'react-qml';
import { User } from '../actions/team-actions';

const styles = {
  user: {
    fontSize: 16,
    fontFamily: 'Lato',
    fontWeight: 'bold',
    align: 'left',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Lato',
  },
  avatarColumn: {
    preferredWidth: 52,
    preferredHeight: 36,
    alignment: Qt.AlignTop,
    topMargin: 8,
    leftMargin: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    radius: 4,
  },
  messageColumn: {
    fillWidth: true,
    topMargin: 6,
    rightMargin: 16,
    alignment: Qt.AlignTop | Qt.AlignLeft,
  },
};

const fullWidth = {
  left: 'parent.left',
  right: 'parent.right',
};

type AllUsersType = {
  [key: string]: User;
};

type Props = {
  userId: string;
  user?: User;
  message: string;
  ts: string | number;
  allUsers?: AllUsersType;
  fetchUser?: Function;
};

class MessageListItem extends React.Component<Props> {
  componentDidMount() {
    const { allUsers, userId, fetchUser } = this.props;
    if (allUsers && fetchUser) {
      const user = allUsers[userId] as User;
      if (!user) {
        fetchUser(userId);
      }
    }
  }

  render() {
    const { message, allUsers, userId } = this.props;

    const user = allUsers && (allUsers[userId] as User);

    return (
      <RowLayout spacing={0} anchors={fullWidth}>
        <Item Layout={styles.avatarColumn} color="#eee">
          {user && (
            <Image source={user.profile.image_72} style={styles.avatar} />
          )}
        </Item>
        <Column Layout={styles.messageColumn} color="#333">
          <Text
            text={user ? user.profile.display_name : ''}
            style={styles.user}
          />
          <Text
            text={message}
            anchors={fullWidth}
            wrapMode="WordWrap"
            style={styles.message}
          />
        </Column>
      </RowLayout>
    );
  }
}

export default MessageListItem;
