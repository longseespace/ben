import { Column, Rectangle, RowLayout, Text } from 'react-qml';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash/fp';
import React from 'react';

import { selectedTeamSelector } from '../state/team';
import { selfSelector } from '../state/self';
import FontIcon from '../components/FontIcon';

const connectToRedux = connect(
  state => ({
    selectedTeam: selectedTeamSelector(state),
    me: selfSelector(state),
  }),
  {}
);

const styles = {
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
};

class ChannelListHeader extends React.Component {
  render() {
    const { selectedTeam = {}, me = { name: '' } } = this.props;

    const user_active = me.manual_presence === 'active';
    const user_available = !isEmpty(me);

    return (
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
    );
  }
}

export default connectToRedux(ChannelListHeader);
