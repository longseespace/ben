import { ColumnLayout, Text, Column } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import ChannelListHeader from './ChannelListHeader';
import FlatList from '../components/FlatList';
import {
  getConverstionList,
  getSelectedConversationId,
  getAllUserPresences,
} from '../reducers/selectors';
import { selectConversation } from '../actions/app-teams-actions';
import { RootState } from '../reducers';
import { Conversation } from '../actions/conversations-actions';
import ChannelListItem from '../components/ChannelListItem';
import { PresencesState } from '../reducers/presences-reducers';

const connectToRedux = connect(
  (state: RootState) => ({
    conversationList: getConverstionList(state),
    selectedConversationId: getSelectedConversationId(state) || '',
    allUserPresences: getAllUserPresences(state),
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
  allUserPresences: PresencesState;
};

class ChannelList extends React.Component<Props> {
  onItemClicked = (item: Conversation) => {
    console.log('onItemClicked', item.name);
    this.props.selectConversation(item.id);
  };

  keyExtractor = (item: Conversation) => item.id;

  renderItem = (item: Conversation) => (
    <ChannelListItem
      key={item.id}
      selected={item.id === this.props.selectedConversationId}
      model={item}
      onClicked={this.onItemClicked}
      userActive={
        item.user_id === 'USLACKBOT' ||
        this.props.allUserPresences[item.user_id] === 'active'
      }
    />
  );

  componentDidUpdate() {
    console.timeEnd('SELECT_TEAM');
  }

  render() {
    const {
      conversationList = [],
      selectedConversationId,
      allUserPresences,
    } = this.props;

    const extraData = {
      selectedItemId: selectedConversationId,
      allUserPresences,
    };

    const selectedIndex = conversationList.findIndex(
      c => c.id === selectedConversationId
    );

    return (
      <ColumnLayout anchors={{ fill: 'parent' }} style={styles.container}>
        <ChannelListHeader />
        <FlatList
          data={conversationList}
          extraData={extraData}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          style={styles.listLayout}
          initialScrollIndex={selectedIndex}
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(ChannelList);
