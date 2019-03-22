import React from 'react';
import FontLoader from './FontLoader';

// this is to includes font in qrc
import faSolid from '../assets/fa-solid.ttf';
import faRegular from '../assets/fa-regular.ttf';
import latoRegular from '../assets/Lato-Regular.ttf';
import latoBold from '../assets/Lato-Bold.ttf';
import latoBlack from '../assets/Lato-Black.ttf';
import { QQuickFontLoader } from 'react-qml/dist/components/QtQuick';

class ResourcesLoader extends React.Component {
  state = {
    loaded: false,
  };

  private counter = 0;

  handleFontStatusChanged = ($loader: QQuickFontLoader) => {
    this.counter++;
    if (this.counter === 5) {
      this.setState({ loaded: true });
    }
  };

  render() {
    const { loaded } = this.state;
    return loaded ? (
      this.props.children
    ) : (
      <React.Fragment>
        <FontLoader
          onStatusChanged={this.handleFontStatusChanged}
          source={faSolid}
        />
        <FontLoader
          onStatusChanged={this.handleFontStatusChanged}
          source={faRegular}
        />
        <FontLoader
          onStatusChanged={this.handleFontStatusChanged}
          source={latoRegular}
        />
        <FontLoader
          onStatusChanged={this.handleFontStatusChanged}
          source={latoBold}
        />
        <FontLoader
          onStatusChanged={this.handleFontStatusChanged}
          source={latoBlack}
        />
      </React.Fragment>
    );
  }
}

export default ResourcesLoader;
