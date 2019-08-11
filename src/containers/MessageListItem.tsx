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
  singleMessage: {
    fillWidth: true,
    alignment: Qt.AlignTop | Qt.AlignLeft,
    topMargin: 6,
    leftMargin: 68,
    rightMargin: 16,
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
  shouldRenderUserInfo?: boolean;
};

const getUserName = (user: User) =>
  user.profile.display_name ? user.profile.display_name : user.name;

class MessageListItem extends React.Component<Props> {
  componentDidMount() {
    const { allUsers, userId, fetchUser, shouldRenderUserInfo } = this.props;
    if (allUsers && fetchUser && shouldRenderUserInfo) {
      const user = allUsers[userId] as User;
      if (!user) {
        fetchUser(userId);
      }
    }
  }

  renderWithUserInfo = () => {
    const { message, allUsers, userId } = this.props;
    const user = allUsers && (allUsers[userId] as User);
    return (
      <React.Fragment>
        <Item Layout={styles.avatarColumn}>
          {user && (
            <Image source={user.profile.image_72} style={styles.avatar} />
          )}
        </Item>
        <Column Layout={styles.messageColumn}>
          <Text text={user ? getUserName(user) : ''} style={styles.user} />
          <Text
            text={message}
            anchors={fullWidth}
            wrapMode="WordWrap"
            style={styles.message}
          />
        </Column>
      </React.Fragment>
    );
  };

  renderNoUserInfo = () => {
    const { message } = this.props;
    return (
      <Text
        text={message}
        wrapMode="WordWrap"
        style={styles.message}
        Layout={styles.singleMessage}
      />
    );
  };

  render() {
    const { shouldRenderUserInfo } = this.props;

    return (
      <RowLayout spacing={0} anchors={fullWidth}>
        {shouldRenderUserInfo
          ? this.renderWithUserInfo()
          : this.renderNoUserInfo()}
      </RowLayout>
    );
  }
}

export default MessageListItem;
