import { Window } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { signInWithPassword } from '../lib/slack';
import ErrorBoundary from '../components/ErrorBoundary';
import LoginForm, { SigninFormData } from '../components/LoginForm';
import { getSigninWindowSettings } from '../reducers/selectors';
import { selectTeam } from '../actions/app-teams-actions';
import { closeSigninWindow } from '../actions/window-actions';
import { RootState } from '../reducers';
import { SingleWindowState } from '../reducers/windows-reducers';
import { QQuickWindow } from 'react-qml/dist/components/QtQuickWindow';
import { initWorkspace } from '../actions/workspace-actions';
import { addAccount } from '../actions/account-actions';
import { QQuickCloseEvent } from 'react-qml/dist/components/QtQuick';

const connectToRedux = connect(
  (state: RootState) => ({
    settings: getSigninWindowSettings(state),
  }),
  {
    closeSigninWindow,
    selectTeam,
    initWorkspace,
    addAccount,
  }
);

const windowWidth = 320;
const windowHeight = 420;

const styles = {
  window: {
    width: windowWidth,
    height: windowHeight,
    color: '#f5f5f5',
  },
};

type Props = {
  closeSigninWindow: Function;
  selectTeam: Function;
  initWorkspace: Function;
  addAccount: Function;
  settings: SingleWindowState;
};

type State = {
  signinError: string;
  isProcessing: boolean;
};

class SigninWindow extends React.Component<Props, State> {
  private windowRef = React.createRef<QQuickWindow>();

  state: State = {
    signinError: '',
    isProcessing: false,
  };

  onClosing = (ev: QQuickCloseEvent) => {
    ev.accepted = true;
    this.props.closeSigninWindow();
  };

  handleLogin = async (formData: SigninFormData) => {
    // reset error
    this.setState({ signinError: '', isProcessing: true });

    const { domain, email, password } = formData;
    const resp = await signInWithPassword(domain, email, password);
    if (!resp.ok) {
      this.setState({ signinError: resp.error, isProcessing: false });
    } else {
      const { team, token } = resp;
      // first, add account to our secure storage
      this.props.addAccount({ teamId: team, token });

      // initWorkspace
      const selectNewlyAddedTeam = true;
      this.props.initWorkspace(team, token, selectNewlyAddedTeam);

      // reset error
      this.setState({ signinError: '', isProcessing: false });

      // close this window
      this.props.closeSigninWindow();
    }
  };

  componentDidUpdate(prevProps: Props) {
    const $window = this.windowRef.current;
    if ($window && !prevProps.settings.visible && this.props.settings.visible) {
      $window.requestActivate();
      $window.raise();
    }
  }

  render() {
    const { signinError, isProcessing } = this.state;
    const { visible = false } = this.props.settings;

    return (
      <Window
        ref={this.windowRef}
        visible={visible}
        onClosing={this.onClosing}
        title={qsTr('Sign In')}
        style={styles.window}
        maximumWidth={windowWidth}
        maximumHeight={windowHeight}
        minimumWidth={windowWidth}
        minimumHeight={windowHeight}
        flags={Qt.Dialog | Qt.Tool}
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

export default connectToRedux(SigninWindow);
