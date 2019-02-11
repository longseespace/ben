import { Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { addWorkspace } from '../state/workspace';
import { hideWindow, signinWindowVisibilitySelector } from '../state/window';
import { signInWithPassword } from '../lib/slack';
import ErrorBoundary from '../components/ErrorBoundary';
import SignInForm from '../components/SignInForm';

const connectToRedux = connect(
  state => ({
    visible: signinWindowVisibilitySelector(state),
  }),
  {
    onClose: () => hideWindow('signin'),
    onSignInSuccess: addWorkspace,
  }
);

const styles = {
  window: {
    width: 400,
    height: 440,
    color: '#f5f5f5',
  },
};

class SignInWindow extends React.Component {
  windowRef = React.createRef();

  state = {
    signinError: '',
    isProcessing: false,
  };

  constructor(props) {
    super(props);

    this.handleSignIn = this.handleSignIn.bind(this);
  }

  onClosing = ev => {
    // we don't want default behavior
    // window visibility will be controlled by component's prop
    ev.accepted = false;

    // should dispatch close action here
    this.props.onClose();
  };

  async handleSignIn(formData) {
    this.setState({ signinError: '', isProcessing: true });
    const { domain, email, password } = formData;
    const resp = await signInWithPassword(domain, email, password);
    if (!resp.ok) {
      this.setState({ signinError: resp.error, isProcessing: false });
    } else {
      // add workspace
      const { team, user, userEmail, token } = resp;
      this.props.onSignInSuccess(team, user, userEmail, token);

      // reset error
      this.setState({ signinError: '', isProcessing: false });

      // close this window
      this.props.onClose();
    }
  }

  render() {
    const { signinError, isProcessing } = this.state;
    const { visible = true } = this.props;
    return (
      <Window
        visible={visible}
        visibility={visible ? 'Windowed' : 'Hidden'}
        onClosing={this.onClosing}
        style={styles.window}
        ref={this.windowRef}
      >
        <ErrorBoundary>
          <SignInForm
            onSubmit={this.handleSignIn}
            submissionError={signinError}
            isProcessing={isProcessing}
          />
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(SignInWindow);
