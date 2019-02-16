import {
  ColumnLayout,
  GridLayout,
  Image,
  QtQuickControls2,
  Text,
} from 'react-qml';
import React from 'react';
import isEmail from 'validator/lib/isEmail';

const { Button } = QtQuickControls2;
import TextField from './TextField';
import lockSvg from '../assets/lock.svg';

const openForgotPasswordPage = () => {
  Qt.openUrlExternally(
    'https://get.slack.help/hc/en-us/articles/201909068-Manage-your-password#reset-your-password'
  );
};

class LoginForm extends React.Component {
  state = {
    validationErrorMessage: '',
  };

  domainRef = React.createRef();
  emailRef = React.createRef();
  passwordRef = React.createRef();

  submit = () => {
    const $domainInput = this.domainRef.current;
    const $emailInput = this.emailRef.current;
    const $passwordInput = this.passwordRef.current;

    if (!$domainInput || !$emailInput || !$passwordInput) {
      // weird
      return false;
    }

    const domain = $domainInput.value;
    const email = $emailInput.value;
    const password = $passwordInput.value;

    if (!domain || !email || !password) {
      this.setState({
        validationErrorMessage: 'All fields are required',
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
      this.props.onSubmit({ domain, email, password });
    }
  };

  render() {
    const { submissionError = '', isProcessing = false } = this.props;
    const { validationErrorMessage = '' } = this.state;

    const hasValidationError = validationErrorMessage.length > 0;
    const hasSubmissionError = submissionError.length > 0;
    return (
      <ColumnLayout anchors={{ fill: 'parent' }}>
        <ColumnLayout
          Layout={{
            leftMargin: 32,
            topMargin: 32,
            rightMargin: 32,
            bottomMargin: 26,
          }}
          columns={1}
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
            ref={this.domainRef}
            inputMethodHints={
              Qt.ImhNoAutoUppercase |
              Qt.ImhPreferLowercase |
              Qt.ImhNoPredictiveText
            }
            verticalAlignment="AlignVCenter"
            onSubmitEditing={this.submit}
            readOnly={isProcessing}
          />
          <TextField
            placeholderText={qsTr('Email')}
            ref={this.emailRef}
            inputMethodHints={
              Qt.ImhNoAutoUppercase |
              Qt.ImhNoPredictiveText |
              Qt.ImhEmailCharactersOnly
            }
            Layout={{ fillWidth: true, row: 5 }}
            verticalAlignment="AlignVCenter"
            onSubmitEditing={this.submit}
            readOnly={isProcessing}
          />
          <TextField
            placeholderText={qsTr('Password')}
            ref={this.passwordRef}
            verticalAlignment="AlignVCenter"
            Layout={{ fillWidth: true, row: 6 }}
            echoMode="Password"
            onSubmitEditing={this.submit}
            readOnly={isProcessing}
          />
          <Button
            Layout={{ fillWidth: true, row: 7 }}
            highlighted
            text={isProcessing ? qsTr('Logging in...') : qsTr('Login')}
            onClicked={this.submit}
            enabled={!isProcessing}
          />
          <Button
            onClicked={openForgotPasswordPage}
            text={qsTr('Forgot your password?')}
            flat
            Layout={{
              alignment: Qt.AlignCenter,
              row: 8,
            }}
          />
        </ColumnLayout>
      </ColumnLayout>
    );
  }
}

export default LoginForm;
