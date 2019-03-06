import { ColumnLayout } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  conversationListSelector,
  selectConversation,
  selectedConversationIdSelector,
} from '../state/conversation';
import ChannelDelegate from '../components/ChannelDelegate.qml';
import ChannelHighlight from '../components/ChannelHighlight.qml';
import ChannelListHeader from './ChannelListHeader';
import ListView from '../components/ListView';
import SectionDelegate from '../components/SectionDelegate.qml';

const connectToRedux = connect(
  state => ({
    conversationList: conversationListSelector(state),
    selectedConversationId: selectedConversationIdSelector(state),
  }),
  {
    selectConversation,
  }
);

const styles = {
  container: {
    spacing: 0,
  },
  listLayout: {
    fillHeight: true,
    fillWidth: true,
    alignment: Qt.AlignTop,
  },
};

class ChannelList extends React.PureComponent {
  onItemClicked = item => {
    console.log('onItemClicked', item.name);
    this.props.selectConversation(item.id);
  };

  keyExtractor = item => item.id;

  render() {
    const { conversationList = [], selectedConversationId } = this.props;

    return (
      <ColumnLayout anchors={{ fill: 'parent' }} style={styles.container}>
        <ChannelListHeader />
        <ListView
          data={conversationList}
          keyExtractor={this.keyExtractor}
          selectedItem={selectedConversationId}
          onItemClicked={this.onItemClicked}
          sectionProperty="section"
          DelegateComponent={ChannelDelegate}
          HighlightComponent={ChannelHighlight}
          SectionDelegateComponent={SectionDelegate}
          style={styles.listLayout}
          focus
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(ChannelList);
