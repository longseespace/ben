import React from 'react';

import { Button, Label, Pane, ProgressBar } from './QtQuickControls';
import { Column, Image } from './QtQuick';
import { ColumnLayout, RowLayout } from './QtQuickLayout';
import TextField from './TextField';
import lockSvg from '../assets/lock.svg';

const openForgotPasswordPage = () => {
  Qt.openUrlExternally('https://admin.bodidata.com/forgot');
};

class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validationError: props.validationError,
    };

    this.emailRef = inst => {
      this.emailField = inst.qmlObject;
    };

    this.passwordRef = inst => {
      this.passwordField = inst.qmlObject;
    };

    this.updateEmail = email => {
      this.email = email;
    };

    this.updatePassword = password => {
      this.password = password;
    };

    this.submit = () => {
      if (!this.email || !this.password) {
        this.setState({
          validationError: 'Email and Password are required',
        });
        return;
      }
      this.setState({
        validationError: '',
      });
      this.props.onSubmit && this.props.onSubmit(this.email, this.password);
    };
  }

  render() {
    const { submissionError = '', isProcessing = false } = this.props;
    const { validationError = '' } = this.state;
    return (
      <Column>
        <Pane focus visible width={320} padding={0} Material={{ elevation: 1 }}>
          <ColumnLayout>
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
                visible={validationError && validationError.length > 0}
                text={validationError}
                color="red"
                Layout={{ fillWidth: true }}
                font={{
                  family: 'Roboto',
                }}
              />
              <TextField
                placeholderText={qsTr('Email')}
                Layout={{ fillWidth: true }}
                onTextEdited={this.updateEmail}
                font={{
                  family: 'Roboto',
                }}
                onReturnPressed={this.submit}
              />
              <TextField
                placeholderText={qsTr('Password')}
                Layout={{ fillWidth: true }}
                echoMode={2}
                onTextEdited={this.updatePassword}
                font={{
                  family: 'Roboto',
                }}
                onReturnPressed={this.submit}
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
            </ColumnLayout>
          </ColumnLayout>
        </Pane>

        <RowLayout width={320}>
          <Button
            onClicked={openForgotPasswordPage}
            text={qsTr('Forgot your password?')}
            flat
            Layout={{
              alignment: Qt.AlignCenter,
            }}
          />
        </RowLayout>
      </Column>
    );
  }
}

export default connectToRedux(SignInForm);
