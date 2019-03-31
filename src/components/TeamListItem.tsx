import {
  Item,
  MouseArea,
  Rectangle,
  Shortcut,
  Text,
  DropArea,
  QtLabsPlatform,
} from 'react-qml';
import React from 'react';
import TeamButton from './TeamButton.qml';
import Badge from './Badge.qml';
import {
  QQuickItem,
  QQuickMouseArea,
  QQuickDragAttached,
  QQuickDropEvent,
} from 'react-qml/dist/components/QtQuick';
import { QQuickMouseEvent } from 'react-qml/dist/components/QtQml';
import { isDesktopOS } from '../helpers';
import { QQuickPlatformMenu } from 'react-qml/dist/components/QtLabsPlatform';

const { Menu, MenuItem } = QtLabsPlatform;

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
  unreadIndicator: {
    x: -4,
    width: 8,
    radius: 2,
    height: 6,
    y: 15,
    color: Qt.rgba(255, 255, 255, 0.5),
  },
  badge: {
    x: 42,
    radius: 18,
    height: 18,
    color: '#cf375c',
    y: -8,
    z: 2,
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
  hasUnreads?: boolean;
  badgeCount?: number;
  backgroundIcon?: string;
  style?: any;
  onDragStarted?: Function;
  onDragFinished?: Function;
  onDropAreaEntered?: Function;
  onRemoved?: Function;
};

type Draggable = {
  Drag: QQuickDragAttached;
};

class TeamListItem extends React.Component<Props> {
  private controlRef = React.createRef<QQuickItem & Draggable>();
  private mouseAreaRef = React.createRef<QQuickMouseArea>();
  private menuRef = React.createRef<QQuickPlatformMenu>();

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

  onSelected = () => {
    if (this.props.onSelected) {
      this.props.onSelected(this.props.id);
    }
  };

  onClicked = (ev: QQuickMouseEvent) => {
    if (ev.button === Qt.LeftButton) {
      this.onSelected();
    } else if (ev.button === Qt.RightButton) {
      const $menu = this.menuRef.current;
      if ($menu) {
        $menu.open(0);
      }
    }
  };

  onRemoved = () => {
    if (this.props.onRemoved) {
      this.props.onRemoved(this.props.id);
    }
  };

  render() {
    const {
      index,
      onSelected,
      onRemoved,
      selected,
      hasUnreads,
      badgeCount = 0,
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
        <Rectangle
          style={styles.unreadIndicator}
          visible={!selected && hasUnreads}
        />
        <Badge
          text={badgeCount}
          style={styles.badge}
          visible={!selected && badgeCount > 0}
        />
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
          onActivated={this.onSelected}
        />
        <MouseArea
          pressAndHoldInterval={300}
          anchors={{ fill: 'parent' }}
          onClicked={this.onClicked}
          cursorShape={Qt.PointingHandCursor}
          acceptedButtons={Qt.LeftButton | Qt.RightButton}
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
        {isDesktopOS && (
          <Menu ref={this.menuRef}>
            <MenuItem
              text={qsTr('Remove %1').arg(name)}
              onTriggered={this.onRemoved}
            />
          </Menu>
        )}
      </Item>
    );
  }
}

export default TeamListItem;
