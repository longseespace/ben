import { ColumnLayout } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import ChannelDelegate from '../components/ChannelDelegate.qml';
import ChannelHighlight from '../components/ChannelHighlight.qml';
import ChannelListHeader from './ChannelListHeader';
import ListView from '../components/ListView';
import SectionDelegate from '../components/SectionDelegate.qml';
import {
  getConverstionList,
  getSelectedConversationId,
} from '../reducers/selectors';
import { selectConversation } from '../actions/app-teams-actions';
import { RootState } from '../reducers';
import { Conversation } from '../actions/conversations-actions';

const connectToRedux = connect(
  (state: RootState) => ({
    conversationList: getConverstionList(state),
    selectedConversationId: getSelectedConversationId(state) || '',
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

type Props = {
  conversationList: Array<Conversation>;
  selectedConversationId: string;
  selectConversation: Function;
};

class ChannelList extends React.PureComponent<Props> {
  onItemClicked = (item: Conversation) => {
    console.log('onItemClicked', item.name);
    this.props.selectConversation(item.id);
  };

  keyExtractor = (item: Conversation) => item.id;

  render() {
    const { conversationList = [], selectedConversationId = '' } = this.props;

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
