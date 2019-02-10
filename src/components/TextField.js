import React from 'react';

import { createQmlComponent } from 'react-qml';
import qmlSource from './TextField.qml';

const TextField = createQmlComponent(qmlSource, 'Tey.TextField');

class TextFieldWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.getRef = inst => {
      if (inst) {
        this.textField = inst.qmlObject;
      }
    };

    this.notifyTextEdited = () => {
      if (this.textField && this.props.onTextEdited) {
        const value = this.props.normalize
          ? this.props.normalize(this.textField.text)
          : this.textField.text;
        this.props.onTextEdited(value);
      }
    };
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onTextEdited, ref, normalize, ...otherProps } = this.props;
    return (
      <TextField
        ref={this.getRef}
        onTextEdited={this.notifyTextEdited}
        {...otherProps}
      />
    );
  }
}

export default TextFieldWrapper;
