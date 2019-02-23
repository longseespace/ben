import { Item, MouseArea, Rectangle, Shortcut, Text } from 'react-qml';
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

class TeamListItem extends React.Component {
  controlRef = React.createRef();
  mouseAreaRef = React.createRef();

  startX: 0;
  startY: 0;

  // componentDidMount() {
  //   const $control = this.controlRef.current;
  //   const $mouseArea = this.mouseAreaRef.current;
  //
  //   $control.Drag.dragType = 'Automatic';
  //
  // }

  onPressedChanged = () => {
    const $control = this.controlRef.current;

    this.startX = $control.x;
    this.startY = $control.y;
  };

  onPressAndHold = () => {
    const $control = this.controlRef.current;
    const $mouseArea = this.mouseAreaRef.current;

    $mouseArea.drag.target = $control;

    $control.scale = 1.2;
    $control.z = 2;

    const { index, onDragStarted } = this.props;
    if (onDragStarted) {
      onDragStarted(index);
    }
  };

  onReleased = () => {
    const $control = this.controlRef.current;
    const $mouseArea = this.mouseAreaRef.current;

    if ($mouseArea.drag.target) {
      const { index, onDragFinished } = this.props;

      $mouseArea.drag.target = undefined;

      $control.scale = 1;
      $control.z = 1;

      // reset x,y
      $control.x = this.startX;
      $control.y = this.startY;

      if (onDragFinished) {
        onDragFinished(index);
      }
    }
  };

  onPositionChanged = ev => {
    // console.log('onPositionChanged', ev.x, ev.y);
  };

  render() {
    const {
      index,
      onSelected,
      selected,
      backgroundIcon,
      style, // eslint-disable-line
      onDragStarted, // eslint-disable-line
      onDragFinished, // eslint-disable-line
      ...otherProps
    } = this.props;

    return (
      <Item ref={this.controlRef} style={styles.container} {...otherProps}>
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
          onActivated={onSelected}
        />
        <MouseArea
          pressAndHoldInterval={300}
          anchors={{ fill: 'parent' }}
          onClicked={onSelected}
          cursorShape={Qt.PointingHandCursor}
          ref={this.mouseAreaRef}
          drag={{
            axis: 'YAxis',
          }}
          onPressedChanged={this.onPressedChanged}
          onPressAndHold={this.onPressAndHold}
          onReleased={this.onReleased}
          onPositionChanged={this.onPositionChanged}
        />
      </Item>
    );
  }
}

export default TeamListItem;
