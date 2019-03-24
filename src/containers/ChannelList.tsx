import { ColumnLayout, Text, Column } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import ChannelListHeader from './ChannelListHeader';
import FlatList from '../components/FlatList';
import {
  getConverstionList,
  getSelectedConversationId,
} from '../reducers/selectors';
import { selectConversation } from '../actions/app-teams-actions';
import { RootState } from '../reducers';
import { Conversation } from '../actions/conversations-actions';
import ChannelListItem from '../components/ChannelListItem';

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
  listItem: {
    fontSize: 16,
    fontFamily: 'Lato',
    color: '#fff',
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

  renderItem = (item: Conversation) => (
    <ChannelListItem id={item.id} name={item.name} />
  );

  render() {
    const { conversationList = [] } = this.props;

    return (
      <ColumnLayout anchors={{ fill: 'parent' }} style={styles.container}>
        <ChannelListHeader />
        <FlatList
          data={conversationList}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          style={styles.listLayout}
          focus
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(ChannelList);
