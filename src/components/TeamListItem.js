import { Column, Item, MouseArea, Rectangle, Shortcut, Text } from 'react-qml';
import React from 'react';

import TeamButton from '../components/TeamButton.qml';

const styles = {
  container: {
    width: 68,
    height: 56,
  },
  selectedIndicator: {
    x: -4,
    width: 8,
    radius: 2,
    height: 36,
    color: Qt.rgba(255, 255, 255, 0.5),
  },
  button: {
    x: 16,
    width: 36,
    height: 36,
  },
  shortcutText: {
    y: 40,
    color: '#ccc',
    fontSize: 13,
    fontFamily: 'Lato',
    align: 'center',
  },
};

const TeamListItem = ({
  index,
  onSelect,
  selected,
  backgroundIcon,
  style, // eslint-disable-line
  ...otherProps
}) => (
  <Item style={styles.container} {...otherProps}>
    <Rectangle style={styles.selectedIndicator} visible={selected} />
    <TeamButton
      selected={selected}
      backgroundIcon={backgroundIcon}
      style={styles.button}
    />
    <Text
      visible={index < 9}
      text={`⌘${index + 1}`}
      style={styles.shortcutText}
      anchors={{ horizontalCenter: 'parent.horizontalCenter' }}
    />
    <Shortcut
      enabled={index < 9}
      sequence={`Ctrl+${index + 1}`}
      onActivated={onSelect}
    />
    <MouseArea
      anchors={{ fill: 'parent' }}
      onClicked={onSelect}
      cursorShape={Qt.PointingHandCursor}
    />
  </Item>
);

export default TeamListItem;
