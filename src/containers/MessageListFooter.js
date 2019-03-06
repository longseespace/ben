import { Rectangle, QtQuickControls2 } from 'react-qml';
import { get } from 'lodash';

const { TextArea, ScrollView } = QtQuickControls2;
import { connect } from 'react-redux';
import React from 'react';

import { selectedConversationSelector } from '../state/conversation';
import { selectedTeamSelector } from '../state/team';
import { selfSelector } from '../state/self';

const connectToRedux = connect(
  state => ({
    selectedTeam: selectedTeamSelector(state),
    selectedConversation: selectedConversationSelector(state),
    me: selfSelector(state),
  }),
  {}
);

const styles = {
  container: {
    color: '#fff',
    z: 1, // higher stack order
    minimumHeight: 44,
    fillWidth: true,
    alignment: Qt.AlignTop,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    radius: 6,
  },
  footerBorder: {
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

class MessageListFooter extends React.Component {
  textareaRef = React.createRef();

  state = {
    height: 44,
  };

  onLineCountChanged = () => {
    const $textarea = this.textareaRef.current;
    const lineCount = $textarea.lineCount;
    const newHeight = 24 + 20 * lineCount;
    this.setState({
      height: newHeight,
    });
  };

  render() {
    const convoName = get(this.props, 'selectedConversation.name', '');

    return (
      <Rectangle
        style={styles.container}
        Layout={{ preferredHeight: this.state.height }}
        border={styles.footerBorder}
      >
        <ScrollView anchors={fillParent}>
          <TextArea
            ref={this.textareaRef}
            style={styles.textarea}
            placeholderText={qsTr('Message %1').arg(convoName)}
            textFormat="PlainText"
            wrapMode="WordWrap"
            onLineCountChanged={this.onLineCountChanged}
          />
        </ScrollView>
      </Rectangle>
    );
  }
}

export default connectToRedux(MessageListFooter);
