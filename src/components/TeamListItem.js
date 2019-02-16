import { GridLayout, Shortcut, Text } from 'react-qml';
import React from 'react';

import TeamButton from '../components/TeamButton.qml';

const TeamListItem = ({
  index,
  onSelect,
  selected,
  backgroundIcon,
  ...otherProps
}) => (
  <GridLayout {...otherProps} spacing={5} columns={1}>
    <TeamButton
      selected={selected}
      onClicked={onSelect}
      backgroundIcon={backgroundIcon}
      Layout={{
        row: 1,
        preferredWidth: 36,
        preferredHeight: 36,
        alignment: Qt.AlignTop | Qt.AlignHCenter,
      }}
    />
    <Text
      visible={index < 9}
      text={`⌘${index + 1}`}
      color="#ccc"
      font={{
        pointSize: 13,
      }}
      horizontalAlignment="AlignHCenter"
      Layout={{
        row: 2,
        fillWidth: true,
        alignment: Qt.AlignTop | Qt.AlignHCenter,
      }}
    />
    <Shortcut
      enabled={index < 9}
      sequence={`Ctrl+${index + 1}`}
      onActivated={onSelect}
    />
  </GridLayout>
);

export default TeamListItem;
