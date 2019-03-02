import { Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { initWorkspace } from '../state/account';
import {
  hideLoginWindow,
  loginWindowConfigSelector,
} from '../state/loginWindow';
import { signInWithPassword } from '../lib/slack';
import ErrorBoundary from '../components/ErrorBoundary';
import LoginForm from '../components/LoginForm';

const connectToRedux = connect(
  state => ({
    config: loginWindowConfigSelector(state),
  }),
  {
    onClosing: hideLoginWindow,
    initWorkspace,
  }
);

const styles = {
  window: {
    width: 320,
    height: 420,
    color: '#f5f5f5',
  },
};

class LoginWindow extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  state = {
    signinError: '',
    isProcessing: false,
  };

  async handleLogin(formData) {
    // reset error
    this.setState({ signinError: '', isProcessing: true });

    const { domain, email, password } = formData;
    const resp = await signInWithPassword(domain, email, password);
    if (!resp.ok) {
      this.setState({ signinError: resp.error, isProcessing: false });
    } else {
      // initWorkspace
      const { team, user, userEmail, token } = resp;
      this.props.initWorkspace({ team, user, userEmail, token });

      // reset error
      this.setState({ signinError: '', isProcessing: false });

      // close this window
      this.props.onClosing();
    }
  }

  render() {
    const { signinError, isProcessing } = this.state;
    const { visible = false } = this.props.config;
    return (
      <Window
        visible={visible}
        onClosing={this.props.onClosing}
        title="Login"
        style={styles.window}
        flags={Qt.Dialog}
      >
        <ErrorBoundary>
          {visible && (
            <LoginForm
              onSubmit={this.handleLogin}
              submissionError={signinError}
              isProcessing={isProcessing}
            />
          )}
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(LoginWindow);
