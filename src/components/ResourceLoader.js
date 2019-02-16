import { FontLoader } from 'react-qml';
import React from 'react';

// import faRegular from '@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf';
import faSolid from '@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf';

class ResourceLoader extends React.Component {
  fontLoaderRef = React.createRef();

  state = {
    loaded: false,
  };

  loadStart = 0;

  onFontStatusChanged = () => {
    const $loader = this.fontLoaderRef.current;
    if ($loader.status === 1) {
      // loaded
      this.setState({ loaded: true });
      console.log('loaded in ', Date.now() - this.loadStart);
    }
  };

  componentDidMount() {
    const $loader = this.fontLoaderRef.current;
    this.loadStart = Date.now();

    if ($loader) {
      $loader.statusChanged.connect(this.onFontStatusChanged);
    }
  }

  render() {
    const { loaded } = this.state;
    return (
      <React.Fragment>
        <FontLoader ref={this.fontLoaderRef} source={faSolid} />
        {loaded && this.props.children}
      </React.Fragment>
    );
  }
}

export default ResourceLoader;
