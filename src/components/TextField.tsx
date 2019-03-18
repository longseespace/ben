import React from 'react';

import TextField from './TextField.qml';
import { QQuickKeyEvent } from 'react-qml/dist/components/QtQuick';
import { QQuickTextField } from 'react-qml/dist/components/QtQuickControls2';

type Props = {
  onTextEdited?: Function;
  onPressed?: Function;
  onReleased?: Function;
  onSubmitEditing?: Function;
} & { [key: string]: any };

class TextFieldWrapper extends React.Component<Props> {
  private inputRef = React.createRef<QQuickTextField>();

  get value() {
    const $textfield = this.inputRef.current;
    if (!$textfield) {
      return '';
    }
    return $textfield.text;
  }

  notifyTextEdited = () => {
    const { onTextEdited } = this.props;
    const $textfield = this.inputRef.current;
    if ($textfield && onTextEdited) {
      onTextEdited($textfield.text);
    }
  };

  onPressed = (ev: QQuickKeyEvent) => {
    if (this.props.onPressed) {
      this.props.onPressed(ev);
    }
  };

  onReleased = (ev: QQuickKeyEvent) => {
    if (this.props.onReleased) {
      this.props.onReleased(ev);
    }

    const isEnterOrReturn = ev.key === Qt.Key_Enter || ev.key === Qt.Key_Return;
    // TODO: naming inconsitent?
    if (isEnterOrReturn && this.props.onSubmitEditing) {
      this.props.onSubmitEditing();
    }
  };

  render() {
    const {
      onTextEdited, // eslint-disable-line no-unused-vars
      onPressed, // eslint-disable-line no-unused-vars
      onReleased, // eslint-disable-line no-unused-vars
      onSubmitEditing, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;
    return (
      <TextField
        ref={this.inputRef}
        onTextEdited={this.notifyTextEdited}
        onPressed={this.onPressed}
        onReleased={this.onReleased}
        {...otherProps}
      />
    );
  }
}

export default TextFieldWrapper;
