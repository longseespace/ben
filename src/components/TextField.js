import React from 'react';

import TextField from './TextField.qml';

class TextFieldWrapper extends React.Component {
  inputRef = React.createRef();
  value = '';

  constructor(props) {
    super(props);
    this.value = props.value || '';
  }

  notifyTextEdited = () => {
    const { onTextEdited } = this.props;
    const $textfield = this.inputRef.current;
    if ($textfield && onTextEdited) {
      this.value = $textfield.text;
      onTextEdited(this.value);
    }
  };

  onPressed = ev => {
    if (this.props.onPressed) {
      this.props.onPressed(ev);
    }
  };

  onReleased = ev => {
    // update value first
    const $textfield = this.inputRef.current;
    if ($textfield) {
      this.value = $textfield.text;
    }

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
