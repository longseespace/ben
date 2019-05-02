import React from 'react';
import { Text, Rectangle, Column, RowLayout, Item, Image } from 'react-qml';
import { connect } from 'react-redux';
import { RootState } from '../reducers';
import { getSelectedTeamToken } from '../reducers/selectors';
import slack from '../lib/slack';
import { inspect } from 'util';

const connectToRedux = connect(
  (state: RootState) => ({
    token: getSelectedTeamToken(state),
  }),
  {}
);

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

type Props = {
  token: string;
  userId: string;
  message: string;
  avatar?: string;
  ts: string | number;
};

type State = {
  loaded: boolean;
  displayName?: string;
  avatar?: string;
};

class MessageListItem extends React.Component<Props, State> {
  state: State = {
    loaded: false,
  };

  componentDidMount() {
    const { token, userId } = this.props;
    if (token) {
      slack
        .apiCall('users.profile.get', {
          token,
          user: userId,
        })
        .then((data: any) => {
          this.setState({
            loaded: true,
            displayName: data.profile.display_name,
            avatar: data.profile.image_72,
          });
        });
    }
  }

  render() {
    const { message, userId } = this.props;
    const { loaded, avatar, displayName } = this.state;

    return (
      loaded && (
        <RowLayout spacing={0} anchors={fullWidth}>
          <Item Layout={styles.avatarColumn} color="#eee">
            {avatar && <Image source={avatar} style={styles.avatar} />}
          </Item>
          <Column Layout={styles.messageColumn} color="#333">
            <Text text={displayName} style={styles.user} />
            <Text
              text={message}
              anchors={fullWidth}
              wrapMode="WordWrap"
              style={styles.message}
            />
          </Column>
        </RowLayout>
      )
    );
  }
}

export default connectToRedux(MessageListItem);
