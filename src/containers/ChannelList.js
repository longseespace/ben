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
import { selfSelector } from '../state/user';
import ChannelDelegate from '../components/ChannelDelegate.qml';
import ChannelHighlight from '../components/ChannelHighlight.qml';
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
    color: '#ccc',
    fontSize: 20,
    fontFamily: 'Font Awesome 5 Free',
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
    fontFamily: 'Font Awesome 5 Free',
    fontSize: 9,
  },
  userPresenceIndicator__inactive: {
    color: '#ccc',
    fontWeight: 'normal',
  },
  userPresenceIndicator__active: {
    color: '#a6e576',
    fontWeight: 'bold',
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
        <Rectangle style={styles.header}>
          <RowLayout anchors={{ fill: 'parent' }} spacing={0}>
            <Column Layout={{ leftMargin: 16, fillWidth: true }} spacing={0}>
              <Text text={selectedTeam.name} style={styles.headerText} />
              <RowLayout style={styles.userPresenceContainer}>
                <Text
                  visible={user_available}
                  text={`\uf111`}
                  style={[
                    styles.userPresenceIndicator,
                    user_active
                      ? styles.userPresenceIndicator__active
                      : styles.userPresenceIndicator__inactive,
                  ]}
                />
                <Text
                  visible={user_available}
                  text={me.name}
                  style={styles.userPresenceText}
                />
              </RowLayout>
            </Column>
            <Text text={`\uf0f3`} style={styles.notificationStatus} />
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
