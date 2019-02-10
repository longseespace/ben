import { Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import AddAccountButton from '../components/AddAccountButton.qml';
import ErrorBoundary from '../components/ErrorBoundary';
import SignInForm from '../components/SignInForm';

const connectToRedux = connect(
  state => ({
    value: state.counter,
  }),
  {
    onIncrement: () => ({ type: 'INCREMENT' }),
    onDecrement: () => ({ type: 'DECREMENT' }),
  }
);

const styles = {
  window: {
    width: 400,
    height: 440,
    color: '#f5f5f5',
  },
};

class SignInWindow extends React.PureComponent {
  onClosing = ev => {
    // we don't want default behavior
    // window visibility will be controlled by component's prop
    ev.accepted = false;

    // should dispatch close action here
  };

  handleSignIn = formData => {
    const { workspace, email, password } = formData;
    console.log('submit', workspace, email, password);
  };

  render() {
    const { visible = true } = this.props;
    return (
      <Window
        visible={visible}
        onClosing={this.onClosing}
        style={styles.window}
      >
        <ErrorBoundary>
          <SignInForm onSubmit={this.handleSignIn} />
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(SignInWindow);
