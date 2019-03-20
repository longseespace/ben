import { Column, Rectangle, RowLayout, Text } from 'react-qml';
import { connect } from 'react-redux';
import React from 'react';

import FontIcon from '../components/FontIcon';
import { getSelectedTeamName, getCurrentUser } from '../reducers/selectors';
import { RootState } from '../reducers';
import { User } from '../actions/team-actions';

const connectToRedux = connect(
  (state: RootState) => ({
    teamName: getSelectedTeamName(state),
    user: getCurrentUser(state),
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

type Props = {
  teamName: string;
  user: User | null;
};

class ChannelListHeader extends React.Component<Props> {
  render() {
    const { teamName, user } = this.props;
    const userName = user ? user.name : '';
    const userActive = Boolean(user && user.manual_presence === 'active');

    return (
      <Rectangle style={styles.header}>
        <RowLayout anchors={{ fill: 'parent' }} spacing={0}>
          <Column Layout={{ leftMargin: 16, fillWidth: true }} spacing={0}>
            <Text text={teamName} style={styles.headerText} />
            <RowLayout style={styles.userPresenceContainer}>
              <FontIcon
                name="circle"
                size={9}
                color={userActive ? '#a6e576' : '#ccc'}
                solid={userActive}
                style={styles.userPresenceIndicator}
              />
              <Text text={userName} style={styles.userPresenceText} />
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
