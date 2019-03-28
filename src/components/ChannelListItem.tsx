import React from 'react';
import Badge from './Badge.qml';
import { RowLayout, Text, Rectangle, MouseArea } from 'react-qml';
import { Conversation } from '../actions/conversations-actions';
import FontAwesome from './FontAwesome';

const styles = {
  container: {
    width: 220,
    height: 30,
    color: 'transparent',
  },
  containerSelected: {
    color: '#7098c4',
  },
  containerHovering: {
    color: Qt.rgba(255, 255, 255, 0.1),
  },
  row: {
    fill: 'parent',
    leftMargin: 16,
    rightMargin: 16,
    verticalCenter: 'parent.verticalCenter',
  },
  indicator: {
    preferredWidth: 10,
    maximumWidth: 10,
    topMargin: 2,
  },
  hash: {
    fontSize: 16,
    fontFamily: 'Lato',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Lato',
    elide: 'ElideRight',
    fillWidth: true,
    fontWeight: 'normal',
  },
  nameHasUnreads: {
    fontWeight: 900,
  },
  badge: {
    right: 'parent.right',
    verticalCenter: 'parent.verticalCenter',
    rightMargin: 16,
  },
};

type IconProps = {
  color: string;
  solid?: boolean;
};

const HashIcon = (props: IconProps) => (
  <Text text="#" style={[styles.indicator, styles.hash]} color={props.color} />
);

const PrivateIcon = (props: IconProps) => (
  <FontAwesome
    name="lock"
    size={10}
    color={props.color}
    solid
    style={styles.indicator}
  />
);

const DirectMessageIcon = (props: IconProps) => (
  <FontAwesome
    name="circle"
    size={10}
    color={props.color}
    solid={!!props.solid}
    style={styles.indicator}
  />
);

const GroupMessageIcon = (props: IconProps) => (
  <FontAwesome
    name="square"
    size={10}
    color={props.color}
    solid
    style={styles.indicator}
  />
);

type Props = {
  style?: any;
  model: Conversation;
  selected: boolean;
  userActive?: boolean;
  onClicked?: (model: Conversation) => void;
};

const fillParent = { fill: 'parent' };

class ChannelListItem extends React.Component<Props> {
  state = {
    hovering: false,
  };

  handleMouseEnter = () => {
    this.setState({ hovering: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovering: false });
  };

  handleClicked = () => {
    const { onClicked, model } = this.props;
    if (onClicked) {
      onClicked(model);
    }
  };

  render() {
    const {
      style, // eslint-disable-line
      onClicked, // eslint-disable-line
      model,
      selected,
      userActive = false,
      ...otherProps
    } = this.props;

    const { hovering } = this.state;
    const { id, name } = model;

    const isPublicChannel = !model.is_im && !model.is_mpim && !model.is_private;
    const isPrivateChannel = !model.is_im && !model.is_mpim && model.is_private;
    const iconColor = model.is_muted
      ? Qt.rgba(255, 255, 255, 0.3)
      : selected
      ? '#fff'
      : '#eee';
    const textColor = model.is_muted
      ? Qt.rgba(255, 255, 255, 0.3)
      : selected || model.has_unreads
      ? '#fff'
      : '#ddd';

    const nameStyles = model.has_unreads
      ? [styles.name, styles.nameHasUnreads]
      : styles.name;

    const containerStyles = [
      styles.container,
      hovering ? styles.containerHovering : {},
      selected ? styles.containerSelected : {},
    ];

    const unreadCount = Number(model.dm_count) + Number(model.mention_count);

    return (
      <Rectangle objectName={id} style={containerStyles} {...otherProps}>
        <Badge
          visible={unreadCount > 0}
          text={unreadCount}
          anchors={styles.badge}
        />
        <RowLayout anchors={styles.row}>
          {isPublicChannel && <HashIcon color={iconColor} />}
          {isPrivateChannel && <PrivateIcon color={iconColor} />}
          {model.is_im && (
            <DirectMessageIcon
              color={userActive ? '#a6e576' : iconColor}
              solid={userActive}
            />
          )}
          {model.is_mpim && <GroupMessageIcon color="#eee" />}
          <Text text={name} style={nameStyles} color={textColor} />
        </RowLayout>
        <MouseArea
          anchors={fillParent}
          hoverEnabled
          cursorShape={Qt.PointingHandCursor}
          onEntered={this.handleMouseEnter}
          onExited={this.handleMouseLeave}
          onClicked={this.handleClicked}
        />
      </Rectangle>
    );
  }
}

export default ChannelListItem;
