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
  initialScrollPosition?: ScrollPosition;
  extraData?: any;
} & { [key: string]: any };

type WithScrollBar = {
  ScrollBar: QQuickScrollBarAttached;
};

export type ScrollPosition = {
  itemIndex: number;
  sectionIndex: number;
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

    const { initialScrollPosition } = this.props;
    if (initialScrollPosition) {
      this.scrollToLocation(initialScrollPosition);
    }
  }

  scrollToLocation = (position: ScrollPosition) => {
    const $listView = this.listViewRef.current;
    if ($listView) {
      const { sections } = this.props;
      const { sectionIndex, itemIndex } = position;
      const totalItemsBefore = sections
        .slice(0, sectionIndex)
        .reduce((acc, section) => acc + section.data.length, 0);
      const actualIndex = totalItemsBefore + itemIndex;

      $listView.positionViewAtIndex(
        actualIndex,
        QQuickItemView_PositionMode.Center
      );
    }
  };

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
      <React.Fragment key={section.title}>
        {renderSectionHeader && renderSectionHeader(section)}
        {section.data.map((item, index) => renderItem(item, index, section))}
        {renderSectionFooter && renderSectionFooter(section)}
      </React.Fragment>
    ));
  };

  render() {
    const {
      sections,
      keyExtractor = this.defaultKeyExtractor,
      extraData,
      initialScrollPosition,
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
