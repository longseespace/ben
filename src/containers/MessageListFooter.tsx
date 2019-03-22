import { Rectangle, QtQuickControls2 } from 'react-qml';

const { TextArea, ScrollView } = QtQuickControls2;
import { connect } from 'react-redux';
import React from 'react';
import { RootState } from '../reducers';
import { getSelectedConversation } from '../reducers/selectors';
import { Conversation } from '../actions/conversations-actions';
import { QQuickTextArea } from 'react-qml/dist/components/QtQuickControls2';

const connectToRedux = connect(
  (state: RootState) => ({
    selectedConversation: getSelectedConversation(state),
  }),
  {}
);

const inputPadding = 16;
const inputLineHeight = 20;
const wtf = 24;

const styles = {
  container: {
    color: '#fff',
    z: 2, // higher stack order
    minimumHeight: wtf + inputLineHeight + inputPadding,
    fillWidth: true,
    alignment: Qt.AlignBottom,
  },
  inputWrapper: {
    radius: 6,
  },
  inputBorder: {
    width: 2,
    color: '#666',
  },
  textarea: {
    fontFamily: 'Lato',
    fontSize: 16,
    padding: 12,
  },
};

// anchors
const fillParent = { fill: 'parent' };

type Props = {
  selectedConversation: Conversation | null | undefined;
  maxLineNum?: number;
};

const inputAnchors = {
  fill: 'parent',
  leftMargin: inputPadding,
  rightMargin: inputPadding,
  bottomMargin: inputPadding,
};

class MessageListFooter extends React.Component<Props> {
  private textareaRef = React.createRef<QQuickTextArea>();

  state = {
    height: inputLineHeight + inputPadding,
  };

  onLineCountChanged = () => {
    const $textarea = this.textareaRef.current;
    if ($textarea) {
      const lineCount = Math.min(
        $textarea.lineCount,
        this.props.maxLineNum || 8
      );
      const newHeight = wtf + inputPadding + inputLineHeight * lineCount;
      this.setState({
        height: newHeight,
      });
    }
  };

  render() {
    const convoName = this.props.selectedConversation
      ? this.props.selectedConversation.name
      : '';

    return (
      <Rectangle
        style={styles.container}
        Layout={{ preferredHeight: this.state.height }}
      >
        <Rectangle
          style={styles.inputWrapper}
          border={styles.inputBorder}
          anchors={inputAnchors}
        >
          <ScrollView anchors={fillParent}>
            <TextArea
              ref={this.textareaRef}
              style={styles.textarea}
              placeholderText={qsTr('Message %1').arg(convoName)}
              textFormat="PlainText"
              wrapMode="WordWrap"
              onLineCountChanged={this.onLineCountChanged}
              selectByMouse
            />
          </ScrollView>
        </Rectangle>
      </Rectangle>
    );
  }
}

export default connectToRedux(MessageListFooter);
