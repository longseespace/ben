import React from 'react';

import RedBox from './RedBox';

// const PRODUCTION_MODE = process.env.NODE_ENV === 'production';

class Layout extends React.Component {
  state = {
    hasError: false,
    error: {},
    errorInfo: {},
  };

  componentDidCatch(error, errorInfo) {
    console.log('componentDidCatch');
    console.log(error);
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  render() {
    const { children } = this.props;
    const { hasError, error, errorInfo } = this.state;
    if (hasError) {
      // if (PRODUCTION_MODE) {
      //   return (
      //     <Rectangle {...fillWindow}>
      //       <ErrorDialogContainer />
      //     </Rectangle>
      //   );
      // }

      return <RedBox error={error} errorInfo={errorInfo} />;
    }
    return React.Children.only(children);
  }
}

export default Layout;
