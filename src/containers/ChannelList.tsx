import { ColumnLayout, Text, Column } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import ChannelListHeader from './ChannelListHeader';
import {
  getSelectedConversationId,
  getAllUserPresences,
  getConversationSectionList,
} from '../reducers/selectors';
import AppTeamsActions from '../actions/app-teams-actions';
import { RootState } from '../reducers';
import { Conversation } from '../actions/conversation-actions';
import ChannelListItem from '../components/ChannelListItem';
import { PresencesState } from '../reducers/presences-reducers';
import SectionList, { Section } from '../components/SectionList';
import ChannelListSection from '../components/ChannelListSection';

const connectToRedux = connect(
  (state: RootState) => ({
    conversationSectionList: getConversationSectionList(state),
    selectedConversationId: getSelectedConversationId(state) || '',
    allUserPresences: getAllUserPresences(state),
  }),
  {
    selectConversation: AppTeamsActions.selectConversation,
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
  conversationSectionList: Array<Section>;
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

  renderSectionHeader = (section: Section) => (
    <ChannelListSection key={`${section.title}-header`} title={section.title} />
  );

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
      conversationSectionList = [],
      selectedConversationId,
      allUserPresences,
    } = this.props;

    const extraData = {
      selectedItemId: selectedConversationId,
      allUserPresences,
    };

    let initialScrollPosition;
    const maybeChannelIndex = conversationSectionList[0].data.findIndex(
      c => c.id === selectedConversationId
    );
    const maybeDMIndex = conversationSectionList[1].data.findIndex(
      c => c.id === selectedConversationId
    );

    if (maybeChannelIndex > -1) {
      initialScrollPosition = {
        sectionIndex: 0,
        itemIndex: maybeChannelIndex,
      };
    } else if (maybeDMIndex > -1) {
      initialScrollPosition = {
        sectionIndex: 1,
        itemIndex: maybeDMIndex,
      };
    }

    return (
      <ColumnLayout anchors={{ fill: 'parent' }} style={styles.container}>
        <ChannelListHeader />
        <SectionList
          sections={conversationSectionList}
          extraData={extraData}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          style={styles.listLayout}
          initialScrollPosition={initialScrollPosition}
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(ChannelList);
