import { Column, ColumnLayout, Rectangle, RowLayout, Text } from 'react-qml';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash/fp';
import * as React from 'react';

import {
  conversationListSelector,
  selectConversation,
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
  },
  headerText: {
    color: 'white',
  },
  notificationStatus: {
    color: '#ccc',
  },
  userPresenceContainer: {
    width: 200,
    height: 17,
  },
  userPresenceText: {
    color: '#ccc',
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

  render() {
    const { conversationList = [], selectedTeam = {}, me = {} } = this.props;
    const user_active = me.manual_presence === 'active';
    const user_available = !isEmpty(me);

    return (
      <ColumnLayout anchors={{ fill: 'parent' }} style={styles.container}>
        <Rectangle
          style={styles.header}
          Layout={{
            preferredHeight: 70,
            fillWidth: true,
            alignment: Qt.AlignTop,
          }}
        >
          <RowLayout anchors={{ fill: 'parent' }} spacing={0}>
            <Column Layout={{ leftMargin: 16, fillWidth: true }} spacing={0}>
              <Text
                text={selectedTeam.name}
                font={{ pointSize: 20, weight: 'Bold', family: 'Lato' }}
                style={styles.headerText}
              />
              <RowLayout style={styles.userPresenceContainer}>
                <Text
                  visible={user_available}
                  text={`\uf111`}
                  color={user_active ? '#a6e576' : '#ccc'}
                  font={{
                    pointSize: 9,
                    family: 'Font Awesome 5 Free',
                    weight: user_active ? 'Bold' : 'Normal',
                  }}
                  Layout={{
                    topMargin: 1,
                    preferredWidth: 9,
                  }}
                />
                <Text
                  visible={user_available}
                  text={me.name}
                  font={{ pointSize: 14, family: 'Lato' }}
                  style={styles.userPresenceText}
                  Layout={{
                    fillWidth: true,
                  }}
                />
              </RowLayout>
            </Column>
            <Text
              text={`\uf0f3`}
              font={{
                pointSize: 20,
                family: 'Font Awesome 5 Free',
              }}
              style={styles.notificationStatus}
              Layout={{ rightMargin: 16, preferredWidth: 20 }}
            />
          </RowLayout>
        </Rectangle>
        <ListView
          data={conversationList}
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
