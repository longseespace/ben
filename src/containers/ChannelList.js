import {
  Column,
  ColumnLayout,
  Rectangle,
  Row,
  RowLayout,
  Text,
} from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { conversationListSelector } from '../state/conversation';
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
  {}
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
  userPresenceText: {
    color: '#ccc',
  },
};

class ChannelList extends React.Component {
  render() {
    const { conversationList = [], selectedTeam = {}, me = {} } = this.props;
    const user_active = me.manual_presence === 'active';
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
              <RowLayout>
                <Text
                  text={`\uf111`}
                  color={user_active ? '#a6e576' : '#ccc'}
                  font={{
                    pointSize: 9,
                    family: 'Font Awesome 5 Free',
                    weight: user_active ? 'Bold' : 'Normal',
                  }}
                  Layout={{
                    topMargin: 1,
                  }}
                />
                <Text
                  text={me.name}
                  font={{ pointSize: 14, family: 'Lato' }}
                  style={styles.userPresenceText}
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
          sectionProperty="section"
          DelegateComponent={ChannelDelegate}
          HighlightComponent={ChannelHighlight}
          SectionDelegateComponent={SectionDelegate}
          Layout={{
            fillHeight: true,
            fillWidth: true,
            alignment: Qt.AlignTop,
          }}
          focus
          highlightMoveVelocity={-1}
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(ChannelList);
