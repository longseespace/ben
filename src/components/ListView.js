import { ListView, ListModel } from 'react-qml';
import React from 'react';

class RQListView extends React.PureComponent {
  listViewRef = React.createRef();
  modelRef = React.createRef();
  delegateRef = React.createRef();
  headerRef = React.createRef();
  highlightRef = React.createRef();
  sectionDelegateRef = React.createRef();

  updateModel = () => {
    const $model = this.modelRef.current;
    if (!$model) {
      return;
    }

    // not best for performance, but it's ok for now
    const { data } = this.props;
    $model.clear();
    data.forEach(item => $model.append(item));
  };

  componentDidMount() {
    const $listView = this.listViewRef.current;
    const $model = this.modelRef.current;
    const $delegate = this.delegateRef.current;
    const $header = this.headerRef.current;
    const $highlight = this.highlightRef.current;
    const $sectionDelegate = this.sectionDelegateRef.current;

    if ($listView) {
      $listView.model = $model;
      $listView.delegate = $delegate;
      $listView.header = $header;
      $listView.highlight = $highlight;
      $listView.section.delegate = $sectionDelegate;

      if (this.props.sectionProperty) {
        $listView.section.property = this.props.sectionProperty;
      }

      this.updateModel();
    }
  }

  componentDidUpdate(prevProps) {
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

    if (prevProps.data !== this.props.data) {
      this.updateModel();
    }
  }

  render() {
    const {
      HeaderComponent,
      HighlightComponent,
      DelegateComponent,
      SectionDelegateComponent,
      data, // eslint-disable-line
      sectionProperty, // eslint-disable-line
      ...otherProps
    } = this.props;

    return (
      <ListView ref={this.listViewRef} {...otherProps}>
        {HeaderComponent && <HeaderComponent ref={this.headerRef} />}
        {HighlightComponent && <HighlightComponent ref={this.highlightRef} />}
        {SectionDelegateComponent && (
          <SectionDelegateComponent ref={this.sectionDelegateRef} />
        )}
        <ListModel ref={this.modelRef} />
        <DelegateComponent ref={this.delegateRef} />
      </ListView>
    );
  }
}

export default RQListView;
