import { Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { addAccount, initAccount } from '../state/account';
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
    onClose: hideLoginWindow,
    addAccount,
    initAccount,
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

  windowRef = React.createRef();

  state = {
    signinError: '',
    isProcessing: false,
  };

  onClosing = ev => {
    // we don't want default behavior
    // window visibility will be controlled by component's prop
    ev.accepted = false;

    // should dispatch close action here
    this.props.onClose();
  };

  async handleLogin(formData) {
    // reset error
    this.setState({ signinError: '', isProcessing: true });

    const { domain, email, password } = formData;
    const resp = await signInWithPassword(domain, email, password);
    if (!resp.ok) {
      this.setState({ signinError: resp.error, isProcessing: false });
    } else {
      // add account
      const { team, user, userEmail, token } = resp;
      this.props.addAccount({ team, user, userEmail, token });

      // init account
      // TODO: fix this
      this.props.initAccount({ token });

      // reset error
      this.setState({ signinError: '', isProcessing: false });

      // close this window
      this.props.onClose();
    }
  }

  render() {
    const { signinError, isProcessing } = this.state;
    const { visible = false } = this.props.config;
    return (
      <Window
        visible={visible}
        visibility={visible ? 'Windowed' : 'Hidden'}
        onClosing={this.onClosing}
        title="Login"
        style={styles.window}
        ref={this.windowRef}
        flags={Qt.Dialog}
      >
        <ErrorBoundary>
          <LoginForm
            onSubmit={this.handleLogin}
            submissionError={signinError}
            isProcessing={isProcessing}
          />
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(LoginWindow);
