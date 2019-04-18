import { ColumnLayout, Image, QtQuickControls2, Text } from 'react-qml';
import React from 'react';
import isEmail from 'validator/lib/isEmail';

const { Button } = QtQuickControls2;
import TextField from './TextField';
import lockSvg from '../assets/lock.svg';

const styles = {
  noPasswordStored: {
    fontFamily: 'Lato',
    fontSize: 12,
    marginBottom: 16,
  },
};

export type SigninFormData = {
  domain: string;
  email: string;
  password: string;
  pin?: string;
};

type Props = {
  submissionError?: string;
  isProcessing?: boolean;
  pinRequired?: boolean;
  onSubmit?: (formData: SigninFormData) => void;
};

type State = {
  validationErrorMessage: string;
};

class LoginForm extends React.Component<Props, State> {
  state: State = {
    validationErrorMessage: '',
  };

  private domainRef = React.createRef<TextField>();
  private emailRef = React.createRef<TextField>();
  private passwordRef = React.createRef<TextField>();
  private pinRef = React.createRef<TextField>();

  submit = () => {
    const $domainInput = this.domainRef.current;
    const $emailInput = this.emailRef.current;
    const $passwordInput = this.passwordRef.current;
    const $pinInput = this.pinRef.current;

    if (!$domainInput || !$emailInput || !$passwordInput || !$pinInput) {
      // weird
      return false;
    }

    const domain = $domainInput.value;
    const email = $emailInput.value;
    const password = $passwordInput.value;
    const pin = $pinInput.value;

    if (!domain || !email || !password) {
      this.setState({
        validationErrorMessage: 'All fields are required',
      });
      return false;
    }

    if (this.props.pinRequired && !pin) {
      this.setState({
        validationErrorMessage: 'Authentication Code is required',
      });
      return false;
    }

    if (!isEmail(email)) {
      this.setState({
        validationErrorMessage: 'Invalid email address',
      });
      return false;
    }

    this.setState({
      validationErrorMessage: '',
    });

    if (this.props.onSubmit) {
      console.log('onSubmit');
      this.props.onSubmit({ domain, email, password, pin });
    }
  };

  render() {
    const {
      submissionError = '',
      isProcessing = false,
      pinRequired,
    } = this.props;
    const { validationErrorMessage = '' } = this.state;

    const missingPin = submissionError === 'missing_pin';

    const hasValidationError = validationErrorMessage.length > 0;
    const hasSubmissionError = submissionError.length > 0 && !missingPin;

    return (
      <ColumnLayout anchors={{ fill: 'parent' }}>
        <ColumnLayout
          Layout={{
            leftMargin: 32,
            topMargin: 32,
            rightMargin: 32,
            bottomMargin: 26,
            maximumWidth: 320,
            alignment: Qt.AlignVCenter | Qt.AlignHCenter,
          }}
          spacing={16}
        >
          <Image
            Layout={{ fillWidth: true, row: 1 }}
            source={lockSvg}
            fillMode="PreserveAspectFit"
            sourceSize={{
              width: 32,
              height: 32,
            }}
          />
          <Text
            visible={!hasValidationError && hasSubmissionError}
            text={submissionError}
            color="red"
            Layout={{ fillWidth: true, row: 2 }}
          />
          <Text
            visible={!hasSubmissionError}
            text={validationErrorMessage}
            color="red"
            Layout={{ fillWidth: true, row: 3 }}
          />
          <TextField
            placeholderText={qsTr('Team')}
            Layout={{ fillWidth: true, row: 4 }}
            font={{ family: 'Lato' }}
            ref={this.domainRef}
            inputMethodHints={
              Qt.ImhNoAutoUppercase |
              Qt.ImhPreferLowercase |
              Qt.ImhNoPredictiveText
            }
            verticalAlignment="AlignVCenter"
            onSubmitEditing={this.submit}
            readOnly={isProcessing}
            visible={!pinRequired}
          />
          <TextField
            placeholderText={qsTr('Email')}
            ref={this.emailRef}
            font={{ family: 'Lato' }}
            inputMethodHints={
              Qt.ImhNoAutoUppercase |
              Qt.ImhNoPredictiveText |
              Qt.ImhEmailCharactersOnly
            }
            Layout={{ fillWidth: true, row: 5 }}
            verticalAlignment="AlignVCenter"
            onSubmitEditing={this.submit}
            readOnly={isProcessing}
            visible={!pinRequired}
          />
          <TextField
            placeholderText={qsTr('Password')}
            ref={this.passwordRef}
            font={{ family: 'Lato' }}
            verticalAlignment="AlignVCenter"
            Layout={{ fillWidth: true, row: 6 }}
            echoMode="Password"
            onSubmitEditing={this.submit}
            readOnly={isProcessing}
            visible={!pinRequired}
          />
          <TextField
            placeholderText={qsTr('Authentication Code')}
            ref={this.pinRef}
            font={{ family: 'Lato' }}
            verticalAlignment="AlignVCenter"
            Layout={{ fillWidth: true, row: 6 }}
            onSubmitEditing={this.submit}
            readOnly={isProcessing}
            visible={pinRequired}
          />
          <Text
            text={qsTr('Ben does not store your password')}
            Layout={{ fillWidth: true, row: 3 }}
            style={styles.noPasswordStored}
          />
          <Button
            Layout={{ fillWidth: true, row: 7 }}
            highlighted
            font={{ family: 'Lato' }}
            text={isProcessing ? qsTr('Signing In...') : qsTr('Sign In')}
            onClicked={this.submit}
            enabled={!isProcessing}
          />
        </ColumnLayout>
      </ColumnLayout>
    );
  }
}

export default LoginForm;
