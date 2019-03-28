import {
  ListView as NativeListView,
  ObjectModel,
  QtQuickControls2,
  Item,
  Column,
} from 'react-qml';
const { ScrollBar } = QtQuickControls2;
import React from 'react';
import {
  QQuickListView,
  QQuickFlickable_BoundsBehavior,
  QQuickFlickable_BoundsMovement,
  QQmlObjectModel,
  QQuickItemView_PositionMode,
} from 'react-qml/dist/components/QtQuick';
import {
  QQuickScrollBar,
  QQuickScrollBarAttached,
} from 'react-qml/dist/components/QtQuickControls2';

export type Section = {
  title: string;
  data: Array<any>;
};

type Props = {
  sections: Array<Section>;
  keyExtractor?: (value: any, index?: number) => string;
  renderItem: (item: any, index: number, section: Section) => any;
  renderSectionHeader?: (section: Section) => any;
  renderSectionFooter?: (section: Section) => any;
  initialScrollIndex?: number;
  extraData?: any;
} & { [key: string]: any };

type WithScrollBar = {
  ScrollBar: QQuickScrollBarAttached;
};

class SectionList extends React.PureComponent<Props> {
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

    const { initialScrollIndex = -1 } = this.props;
    if ($listView && initialScrollIndex >= 0) {
      $listView.positionViewAtIndex(
        initialScrollIndex,
        QQuickItemView_PositionMode.Visible
      );
    }
  }

  defaultKeyExtractor = (item: any, index: number) => {
    return item.hasOwnProperty('key') ? item.key : index;
  };

  renderInner = () => {
    const {
      sections,
      renderSectionHeader,
      renderSectionFooter,
      renderItem,
    } = this.props;
    return sections.map(section => (
      <Column key={section.title}>
        {renderSectionHeader && renderSectionHeader(section)}
        {section.data.map((item, index) => renderItem(item, index, section))}
        {renderSectionFooter && renderSectionFooter(section)}
      </Column>
    ));
  };

  render() {
    const {
      sections,
      keyExtractor = this.defaultKeyExtractor,
      extraData,
      initialScrollIndex,
      renderItem,
      renderSectionHeader,
      ...otherProps
    } = this.props;

    return (
      <NativeListView ref={this.listViewRef} {...otherProps}>
        <ObjectModel ref={this.modelRef}>{this.renderInner()}</ObjectModel>
        <ScrollBar ref={this.vScrollBarRef} />
        <ScrollBar ref={this.hScrollBarRef} />
      </NativeListView>
    );
  }
}

export default SectionList;
