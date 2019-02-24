import { Column, ColumnLayout, Rectangle, RowLayout, Text } from 'react-qml';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash/fp';
import * as React from 'react';

import {
  conversationListSelector,
  selectConversation,
  selectedConversationIdSelector,
} from '../state/conversation';
import { selectedTeamSelector } from '../state/team';
import { selfSelector } from '../state/self';
import ChannelDelegate from '../components/ChannelDelegate.qml';
import ChannelHighlight from '../components/ChannelHighlight.qml';
import FontIcon from '../components/FontIcon';
import ListView from '../components/ListView';
import SectionDelegate from '../components/SectionDelegate.qml';

const connectToRedux = connect(
  state => ({
    selectedTeam: selectedTeamSelector(state),
    conversationList: conversationListSelector(state),
    selectedConversationId: selectedConversationIdSelector(state),
    me: selfSelector(state),
  }),
  {
    selectConversation,
  }
);

const styles = {
  container: {
    spacing: 0,
  },
  header: {
    color: '#323E4C',
    z: 1, // higher stack order
    preferredHeight: 70,
    fillWidth: true,
    alignment: Qt.AlignTop,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Lato',
  },
  notificationStatus: {
    rightMargin: 16,
    preferredWidth: 20,
  },
  userPresenceContainer: {
    width: 200,
    height: 17,
  },
  userPresenceIndicator: {
    topMargin: 1,
    preferredWidth: 9,
  },
  userPresenceText: {
    fontSize: 14,
    fontFamily: 'Lato',
    color: '#ccc',
    fillWidth: true,
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
    const {
      conversationList = [],
      selectedTeam = {},
      me = {},
      selectedConversationId,
    } = this.props;
    const user_active = me.manual_presence === 'active';
    const user_available = !isEmpty(me);

    return (
      <ColumnLayout anchors={{ fill: 'parent' }} style={styles.container}>
        <Rectangle style={styles.header} visible={user_available}>
          <RowLayout anchors={{ fill: 'parent' }} spacing={0}>
            <Column Layout={{ leftMargin: 16, fillWidth: true }} spacing={0}>
              <Text text={selectedTeam.name} style={styles.headerText} />
              <RowLayout style={styles.userPresenceContainer}>
                <FontIcon
                  name="circle"
                  size={9}
                  color={user_active ? '#a6e576' : '#ccc'}
                  solid={user_active}
                  style={styles.userPresenceIndicator}
                />
                <Text text={me.name} style={styles.userPresenceText} />
              </RowLayout>
            </Column>
            <FontIcon
              name="bell"
              size={20}
              color="#ccc"
              style={styles.notificationStatus}
            />
          </RowLayout>
        </Rectangle>
        <ListView
          data={conversationList}
          keyExtractor={this.keyExtractor}
          selectedItem={selectedConversationId}
          onItemClicked={this.onItemClicked}
          sectionProperty="section"
          DelegateComponent={ChannelDelegate}
          HighlightComponent={ChannelHighlight}
          SectionDelegateComponent={SectionDelegate}
          Layout={styles.listLayout}
          focus
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(ChannelList);
