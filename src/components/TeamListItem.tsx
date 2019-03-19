import {
  Item,
  MouseArea,
  Rectangle,
  Shortcut,
  Text,
  DropArea,
} from 'react-qml';
import React from 'react';
import TeamButton from './TeamButton.qml';
import {
  QQuickItem,
  QQuickMouseArea,
  QQuickDragAttached,
  QQuickDropEvent,
} from 'react-qml/dist/components/QtQuick';

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

type Props = {
  index: number;
  name: string;
  id: string;
  onSelected?: Function;
  selected?: boolean;
  backgroundIcon?: string;
  style?: any;
  onDragStarted?: Function;
  onDragFinished?: Function;
  onDropAreaEntered?: Function;
};

type Draggable = {
  Drag: QQuickDragAttached;
};

class TeamListItem extends React.Component<Props> {
  private controlRef = React.createRef<QQuickItem & Draggable>();
  private mouseAreaRef = React.createRef<QQuickMouseArea>();

  componentDidMount() {
    const $control = this.controlRef.current;
    const $mouseArea = this.mouseAreaRef.current;

    if ($control && $mouseArea) {
      $control.Drag.dragType = 'None';
      // $control.Drag.supportedActions = Qt.MoveAction;
      // $control.Drag.proposedAction = Qt.MoveAction;
      $control.Drag.mimeData = {
        'text/plain': this.props.name,
      };

      $control.Drag.dragStarted.connect(this.onDragStarted);
      $control.Drag.dragFinished.connect(this.onDragFinished);
    }
  }

  onDragStarted = () => {
    const $control = this.controlRef.current;
    if ($control) {
      $control.scale = 1.2;
      $control.z = 2;
    }

    if (this.props.onDragStarted) {
      this.props.onDragStarted(this.props.id);
    }
  };

  onDragFinished = () => {
    const $control = this.controlRef.current;
    if ($control) {
      $control.scale = 1;
      $control.z = 1;
      $control.Drag.drop();
    }

    if (this.props.onDragFinished) {
      this.props.onDragFinished(this.props.id);
    }
  };

  onPressAndHold = () => {
    const $control = this.controlRef.current;

    if ($control) {
      $control.Drag.active = true;
      $control.Drag.startDrag(Qt.MoveAction);
    }
  };

  onDropAreaEntered = (ev: QQuickDropEvent) => {
    if (this.props.onDropAreaEntered) {
      this.props.onDropAreaEntered(this.props.id, this.props.index, ev);
    }
  };

  onDropped = (ev: QQuickDropEvent) => {
    ev.accept(Qt.MoveAction);
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
      onDropAreaEntered, // eslint-disable-line
      name, // eslint-disable-line
      id, // eslint-disable-line
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
            smoothed: false,
          }}
          onPressAndHold={this.onPressAndHold}
        />
        <DropArea
          anchors={{ fill: 'parent' }}
          onEntered={this.onDropAreaEntered}
          onDropped={this.onDropped}
        />
      </Item>
    );
  }
}

export default TeamListItem;
