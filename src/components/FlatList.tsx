import {
  ListView as NativeListView,
  ObjectModel,
  QtQuickControls2,
} from 'react-qml';
const { ScrollBar } = QtQuickControls2;
import React from 'react';
import {
  QQuickListView,
  QQuickFlickable_BoundsBehavior,
  QQuickFlickable_BoundsMovement,
  QQmlObjectModel,
} from 'react-qml/dist/components/QtQuick';
import {
  QQuickScrollBar,
  QQuickScrollBarAttached,
} from 'react-qml/dist/components/QtQuickControls2';

type Props = {
  data: Array<any>;
  keyExtractor?: (value: any, index?: number) => any;
  renderItem: (item: any) => any;
  initialViewAt?: 'beginning' | 'end';
} & { [key: string]: any };

type WithScrollBar = {
  ScrollBar: QQuickScrollBarAttached;
};

class FlatList extends React.PureComponent<Props> {
  private listViewRef = React.createRef<QQuickListView & WithScrollBar>();
  private modelRef = React.createRef<QQmlObjectModel>();
  private vScrollBarRef = React.createRef<QQuickScrollBar>();
  private hScrollBarRef = React.createRef<QQuickScrollBar>();

  static StopAtBounds = QQuickFlickable_BoundsBehavior.StopAtBounds;
  static DragOverBounds = QQuickFlickable_BoundsBehavior.DragOverBounds;
  static OvershootBounds = QQuickFlickable_BoundsBehavior.OvershootBounds;
  static DragAndOvershootBounds =
    QQuickFlickable_BoundsBehavior.DragAndOvershootBounds;
  static FollowBoundsBehavior =
    QQuickFlickable_BoundsMovement.FollowBoundsBehavior;

  componentDidMount() {
    const $listView = this.listViewRef.current;
    const $model = this.modelRef.current;
    const $vScrollBar = this.vScrollBarRef.current;
    const $hScrollBar = this.hScrollBarRef.current;

    if ($listView) {
      $listView.model = $model;

      $listView.ScrollBar.vertical = $vScrollBar;
      $listView.ScrollBar.horizontal = $hScrollBar;
    }
  }

  defaultKeyExtractor = (item: any, index: number) => {
    return item.hasOwnProperty('key') ? item.key : index;
  };

  render() {
    const {
      data, // eslint-disable-line
      highlightMoveVelocity = -1,
      keyExtractor = this.defaultKeyExtractor, // eslint-disable-line
      initialViewAt, // eslint-disable-line
      extraData, // eslint-disable-line
      renderItem,
      ...otherProps
    } = this.props;

    return (
      <NativeListView
        ref={this.listViewRef}
        highlightMoveVelocity={highlightMoveVelocity}
        {...otherProps}
      >
        <ObjectModel ref={this.modelRef}>{data.map(renderItem)}</ObjectModel>
        <ScrollBar ref={this.vScrollBarRef} />
        <ScrollBar ref={this.hScrollBarRef} />
      </NativeListView>
    );
  }
}

export default FlatList;
