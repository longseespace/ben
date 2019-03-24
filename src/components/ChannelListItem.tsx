import React from 'react';
import Badge from './Badge.qml';
import { RowLayout, Text, Rectangle, MouseArea } from 'react-qml';

const styles = {
  container: {
    width: 220,
    height: 30,
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
  },
  hash: {
    fontSize: 16,
    fontFamily: 'Lato',
    color: '#fff',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Lato',
    color: '#fff',
    elide: 'ElideRight',
    fillWidth: true,
  },
  trap: {
    fill: 'parent',
    cursorShape: Qt.PointingHandCursor,
  },
};

type Props = {
  name: string;
  id: string;
  style?: any;
};

class ChannelListItem extends React.Component<Props> {
  state = {
    hovering: false,
  };

  onMouseEnter = () => {
    this.setState({ hovering: true });
  };

  onMouseLeave = () => {
    this.setState({ hovering: false });
  };

  render() {
    const {
      style, // eslint-disable-line
      name, // eslint-disable-line
      id, // eslint-disable-line
      ...otherProps
    } = this.props;

    const { hovering } = this.state;

    return (
      <Rectangle
        objectName={id}
        style={styles.container}
        color={hovering ? Qt.rgba(255, 255, 255, 0.1) : 'transparent'}
        {...otherProps}
      >
        <RowLayout anchors={styles.row}>
          <Text text="#" style={[styles.indicator, styles.hash]} />
          <Text text={name} style={styles.name} />
        </RowLayout>
        <MouseArea
          style={styles.trap}
          hoverEnabled
          onEntered={this.onMouseEnter}
          onExited={this.onMouseLeave}
        />
      </Rectangle>
    );
  }
}

export default ChannelListItem;
