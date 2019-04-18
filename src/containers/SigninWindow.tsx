import { Window, QtQuickControls2 } from 'react-qml';
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
import { isMobileOS } from '../helpers';
const { RoundButton } = QtQuickControls2;

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
  goback: {
    x: 20,
    y: 30,
    fontFamily: 'Lato',
    fontSize: 30,
    width: 60,
    height: 60,
    radius: 60,
    color: '#666',
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
  pinRequired: boolean;
};

class SigninWindow extends React.Component<Props, State> {
  private windowRef = React.createRef<QQuickWindow>();

  state: State = {
    signinError: '',
    pinRequired: false,
    isProcessing: false,
  };

  onClosing = (ev: QQuickCloseEvent) => {
    ev.accepted = true;
    // reset state
    this.resetState();

    // finally close
    this.props.closeSigninWindow();
  };

  resetState = () => {
    this.setState({ signinError: '', pinRequired: false, isProcessing: false });
  };

  handleLogin = async (formData: SigninFormData) => {
    // reset error
    this.setState({ signinError: '', isProcessing: true });

    const { domain, email, password, pin } = formData;
    const resp = await signInWithPassword(domain, email, password, pin);
    if (!resp.ok) {
      const signinError = resp.error;
      this.setState({
        signinError,
        isProcessing: false,
        pinRequired:
          signinError === 'missing_pin' || signinError === 'invalid_pin',
      });
    } else {
      const { team, token } = resp;
      // first, add account to our secure storage
      this.props.addAccount({ teamId: team, token });

      // initWorkspace
      const selectNewlyAddedTeam = true;
      this.props.initWorkspace(team, token, selectNewlyAddedTeam);

      // reset error
      this.resetState();

      // close this window
      this.props.closeSigninWindow();
    }
  };

  componentDidMount() {
    const $window = this.windowRef.current;
    if ($window && this.props.settings.visible) {
      $window.requestActivate();
      $window.raise();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const $window = this.windowRef.current;
    if ($window && !prevProps.settings.visible && this.props.settings.visible) {
      $window.requestActivate();
      $window.raise();
    }
  }

  render() {
    const { signinError, isProcessing, pinRequired } = this.state;
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
        flags={Qt.Dialog}
      >
        <ErrorBoundary>
          <RoundButton
            text="←"
            style={styles.goback}
            visible={visible && isMobileOS}
            flat
            onClicked={this.props.closeSigninWindow}
          />
          {visible && (
            <LoginForm
              onSubmit={this.handleLogin}
              submissionError={signinError}
              isProcessing={isProcessing}
              pinRequired={pinRequired}
            />
          )}
        </ErrorBoundary>
      </Window>
    );
  }
}

export default connectToRedux(SigninWindow);
