import {
  ListView as NativeListView,
  ListModel,
  QtQuickControls2,
} from 'react-qml';
const { ScrollBar } = QtQuickControls2;
import React from 'react';
import {
  QQuickListView,
  QQmlListModel,
} from 'react-qml/dist/components/QtQuick';
import { QQmlComponent } from 'react-qml/dist/components/QtQml';
import {
  QQuickScrollBar,
  QQuickScrollBarAttached,
} from 'react-qml/dist/components/QtQuickControls2';

type Props = {
  data: Array<any>;
  keyExtractor?: (value: any, index?: number) => any;
  selectedItem?: string;
  sectionProperty?: string;
  HeaderComponent?: any;
  DelegateComponent?: any;
  HighlightComponent?: any;
  SectionDelegateComponent?: any;
} & { [key: string]: any };

type WithScrollBar = {
  ScrollBar: QQuickScrollBarAttached;
};

class ListView extends React.PureComponent<Props> {
  private listViewRef = React.createRef<QQuickListView & WithScrollBar>();
  private modelRef = React.createRef<QQmlListModel>();
  private delegateRef = React.createRef<QQmlComponent>();
  private headerRef = React.createRef<QQmlComponent>();
  private highlightRef = React.createRef<QQmlComponent>();
  private sectionDelegateRef = React.createRef<QQmlComponent>();
  private vScrollBarRef = React.createRef<QQuickScrollBar>();
  private hScrollBarRef = React.createRef<QQuickScrollBar>();

  doNotNotifyIndexChange = false;

  calculateCurrentIndex = () => {
    const {
      data = [],
      keyExtractor = this.defaultKeyExtractor, // eslint-disable-line
      selectedItem, // eslint-disable-line
    } = this.props;

    if (!selectedItem) {
      return -1;
    }

    const ids = data.map(keyExtractor);
    return ids.indexOf(selectedItem);
  };

  updateModel = () => {
    const $model = this.modelRef.current;
    const $listView = this.listViewRef.current;
    if (!$model || !$listView) {
      return;
    }

    this.doNotNotifyIndexChange = true;

    // not best for performance, but it's ok for now
    const { data } = this.props;
    $model.clear();
    data.forEach(item => $model.append(item));

    const currentIndex = this.calculateCurrentIndex();
    $listView.currentIndex = currentIndex;

    this.doNotNotifyIndexChange = false;
  };

  componentDidMount() {
    const $listView = this.listViewRef.current;
    const $model = this.modelRef.current;
    const $delegate = this.delegateRef.current;
    const $header = this.headerRef.current;
    const $highlight = this.highlightRef.current;
    const $sectionDelegate = this.sectionDelegateRef.current;
    const $vScrollBar = this.vScrollBarRef.current;
    const $hScrollBar = this.hScrollBarRef.current;

    if ($listView) {
      $listView.model = $model;

      $listView.delegate = $delegate;
      $listView.header = $header;
      $listView.highlight = $highlight;
      $listView.section.delegate = $sectionDelegate;
      $listView.ScrollBar.vertical = $vScrollBar;
      $listView.ScrollBar.horizontal = $hScrollBar;

      if (this.props.sectionProperty) {
        $listView.section.property = this.props.sectionProperty;
      }

      this.updateModel();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const $listView = this.listViewRef.current;
    const $delegate = this.delegateRef.current;
    const $header = this.headerRef.current;
    const $highlight = this.highlightRef.current;
    const $sectionDelegate = this.sectionDelegateRef.current;

    if ($listView) {
      if (prevProps.HeaderComponent !== this.props.HeaderComponent) {
        $listView.header = $header;
      }
      if (prevProps.DelegateComponent !== this.props.DelegateComponent) {
        $listView.delegate = $delegate;
      }
      if (prevProps.HighlightComponent !== this.props.HighlightComponent) {
        $listView.highlight = $highlight;
      }
      if (
        prevProps.SectionDelegateComponent !==
        this.props.SectionDelegateComponent
      ) {
        $listView.section.delegate = $sectionDelegate;
      }
    }

    // TODO: revise this
    if (this.props.data !== prevProps.data) {
      this.updateModel();
    }
  }

  onCurrentIndexChanged = () => {
    if (this.doNotNotifyIndexChange) {
      return;
    }

    const $listView = this.listViewRef.current;

    if ($listView) {
      const index = $listView.currentIndex;
      if (index === undefined || index === -1) {
        return;
      }

      const item = this.props.data[index];

      // TODO: more thought on this, do we really need to make this controlled
      // reset currentIndex back to -1
      // to make this component controlled
      // this.doNotNotifyIndexChange = true;
      // $listView.currentIndex = -1;
      // this.doNotNotifyIndexChange = false;

      this.props.onItemClicked(item);
    }
  };

  defaultKeyExtractor = (item: any, index: number) => {
    return item.hasOwnProperty('key') ? item.key : index;
  };

  render() {
    const {
      HeaderComponent,
      HighlightComponent,
      DelegateComponent,
      SectionDelegateComponent,
      onCurrentIndexChanged, // eslint-disable-line
      onItemClicked, // eslint-disable-line
      data, // eslint-disable-line
      sectionProperty, // eslint-disable-line
      highlightMoveVelocity = -1,
      keyExtractor = this.defaultKeyExtractor, // eslint-disable-line
      selectedItem, // eslint-disable-line
      ...otherProps
    } = this.props;

    const currentIndex = this.calculateCurrentIndex();

    return (
      <NativeListView
        ref={this.listViewRef}
        onCurrentIndexChanged={this.onCurrentIndexChanged}
        currentIndex={currentIndex}
        highlightMoveVelocity={highlightMoveVelocity}
        {...otherProps}
      >
        {HeaderComponent && <HeaderComponent ref={this.headerRef} />}
        {HighlightComponent && <HighlightComponent ref={this.highlightRef} />}
        {SectionDelegateComponent && (
          <SectionDelegateComponent ref={this.sectionDelegateRef} />
        )}
        <ListModel ref={this.modelRef} />
        <DelegateComponent ref={this.delegateRef} />
        <ScrollBar ref={this.vScrollBarRef} />
        <ScrollBar ref={this.hScrollBarRef} />
      </NativeListView>
    );
  }
}

export default ListView;
