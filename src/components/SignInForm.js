import { QtQuickControls2, Image, ColumnLayout } from 'react-qml';
import React from 'react';
import isEmail from 'validator/lib/isEmail';

const { Button, Label, ProgressBar } = QtQuickControls2;
import TextField from './TextField';
import lockSvg from '../assets/lock.svg';

const openForgotPasswordPage = () => {
  Qt.openUrlExternally(
    'https://get.slack.help/hc/en-us/articles/201909068-Manage-your-password#reset-your-password'
  );
};

class SignInForm extends React.Component {
  state = {
    validationErrorMessage: '',
  };

  workspaceRef = React.createRef();
  emailRef = React.createRef();
  passwordRef = React.createRef();

  submit = () => {
    const $workspaceInput = this.workspaceRef.current;
    const $emailInput = this.emailRef.current;
    const $passwordInput = this.passwordRef.current;

    if (!$workspaceInput || !$emailInput || !$passwordInput) {
      // weird
      return false;
    }

    const workspace = $workspaceInput.value;
    const email = $emailInput.value;
    const password = $passwordInput.value;

    if (!workspace || !email || !password) {
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

    this.props.onSubmit && this.props.onSubmit({ workspace, email, password });
  };

  render() {
    const { submissionError = '', isProcessing = false } = this.props;
    const { validationErrorMessage = '' } = this.state;
    return (
      <ColumnLayout anchors={{ fill: 'parent' }}>
        <ProgressBar
          Layout={{ fillWidth: true }}
          indeterminate
          opacity={isProcessing ? 1 : 0}
        />
        <ColumnLayout
          Layout={{
            leftMargin: 32,
            topMargin: 32,
            rightMargin: 32,
            bottomMargin: 26,
          }}
          spacing={16}
        >
          <Image
            Layout={{ fillWidth: true }}
            source={lockSvg}
            fillMode="PreserveAspectFit"
            sourceSize={{
              width: 32,
              height: 32,
            }}
          />
          <Label
            visible={submissionError && submissionError.length > 0}
            text={submissionError}
            color="red"
            Layout={{ fillWidth: true }}
            font={{
              family: 'Roboto',
            }}
          />
          <Label
            text={validationErrorMessage}
            color="red"
            Layout={{ fillWidth: true }}
            font={{
              family: 'Roboto',
            }}
          />
          <TextField
            placeholderText={qsTr('Workspace')}
            Layout={{ fillWidth: true }}
            ref={this.workspaceRef}
            verticalAlignment="AlignVCenter"
            font={{
              family: 'Roboto',
            }}
            onSubmitEditing={this.submit}
          />
          <TextField
            placeholderText={qsTr('Email')}
            ref={this.emailRef}
            inputMethodHints={Qt.ImhEmailCharactersOnly}
            Layout={{ fillWidth: true }}
            verticalAlignment="AlignVCenter"
            font={{
              family: 'Roboto',
            }}
            onSubmitEditing={this.submit}
          />
          <TextField
            placeholderText={qsTr('Password')}
            ref={this.passwordRef}
            verticalAlignment="AlignVCenter"
            Layout={{ fillWidth: true }}
            echoMode="Password"
            font={{
              family: 'Roboto',
            }}
            onSubmitEditing={this.submit}
          />
          <Button
            Layout={{ fillWidth: true }}
            highlighted
            text={qsTr('Login')}
            onClicked={this.submit}
            font={{
              family: 'Roboto',
            }}
          />
          <Button
            onClicked={openForgotPasswordPage}
            text={qsTr('Forgot your password?')}
            flat
            Layout={{
              alignment: Qt.AlignCenter,
            }}
          />
        </ColumnLayout>
      </ColumnLayout>
    );
  }
}

export default SignInForm;
