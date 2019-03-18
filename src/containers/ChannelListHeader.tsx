import { Column, Rectangle, RowLayout, Text } from 'react-qml';
import { connect } from 'react-redux';
import React from 'react';

import FontIcon from '../components/FontIcon';
import {
  getSelectedTeamName,
  getCurrentTeamUserName,
} from '../reducers/selectors';
import { RootState } from '../reducers';

const connectToRedux = connect(
  (state: RootState) => ({
    teamName: getSelectedTeamName(state),
    userName: getCurrentTeamUserName(state),
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
  userName: string;
};

class ChannelListHeader extends React.Component<Props> {
  render() {
    const { teamName, userName } = this.props;
    const user_active = false;

    return (
      <Rectangle style={styles.header}>
        <RowLayout anchors={{ fill: 'parent' }} spacing={0}>
          <Column Layout={{ leftMargin: 16, fillWidth: true }} spacing={0}>
            <Text text={teamName} style={styles.headerText} />
            <RowLayout style={styles.userPresenceContainer}>
              <FontIcon
                name="circle"
                size={9}
                color={user_active ? '#a6e576' : '#ccc'}
                solid={user_active}
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
