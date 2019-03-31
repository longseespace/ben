import hoistStatics from 'hoist-non-react-statics';
import React from 'react';

/**
 * Allows two animation frames to complete to allow other components to update
 * and re-render before mounting and rendering an expensive `WrappedComponent`.
 */
type State = {
  shouldRender: boolean;
};
export default function deferComponentRender<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  class DeferredRenderWrapper extends React.Component<P, State> {
    constructor(props: P) {
      super(props);
      this.state = { shouldRender: false };
    }

    componentDidMount() {
      Qt.callLater(() => {
        Qt.callLater(() => this.setState({ shouldRender: true }));
      });
    }

    render() {
      return this.state.shouldRender ? (
        <WrappedComponent {...this.props} />
      ) : null;
    }
  }

  return hoistStatics(DeferredRenderWrapper, WrappedComponent);
}
