import React from 'react';

import { RedBox } from 'react-qml';

// const PRODUCTION_MODE = process.env.NODE_ENV === 'production';

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

class ErrorBoundary extends React.Component<{}, State> {
  readonly state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('componentDidCatch');
    console.error(error);
    console.trace();
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  render() {
    const { children } = this.props;
    const { hasError, error, errorInfo } = this.state;
    if (hasError && error && errorInfo) {
      // if (PRODUCTION_MODE) {
      //   return (
      //     <Rectangle {...fillWindow}>
      //       <ErrorDialogContainer />
      //     </Rectangle>
      //   );
      // }

      return <RedBox error={error} errorInfo={errorInfo} enableStacktrace />;
    }
    return children;
  }
}

export default ErrorBoundary;
