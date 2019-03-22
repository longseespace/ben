import React from 'react';
import { FontLoader as NativeFontLoader } from 'react-qml';
import { QQuickFontLoader } from 'react-qml/dist/components/QtQuick';

type Props = {
  onStatusChanged?: ($loader: QQuickFontLoader) => void;
} & { [key: string]: any };

class FontLoader extends React.Component<Props> {
  private loaderRef = React.createRef<QQuickFontLoader>();

  handleStatusChanged = () => {
    const $loader = this.loaderRef.current;
    const { onStatusChanged } = this.props;

    if ($loader && onStatusChanged) {
      onStatusChanged($loader);
    }
  };

  componentDidMount() {
    const $loader = this.loaderRef.current;
    const { onStatusChanged } = this.props;

    // TODO: find a better way
    // this is needed for hot reloading
    if ($loader && $loader.status === 1 && onStatusChanged) {
      onStatusChanged($loader);
    }
  }

  render() {
    const { onStatusChanged, ...otherProps } = this.props;
    return (
      <NativeFontLoader
        ref={this.loaderRef}
        onStatusChanged={this.handleStatusChanged}
        {...otherProps}
      />
    );
  }
}

export default FontLoader;
