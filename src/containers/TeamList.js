import { connect } from 'react-redux';
import { path } from 'lodash/fp';
import * as React from 'react';

import { Column, ColumnLayout } from 'react-qml';

import { showWindow } from '../state/window';
import {
  teamInfoSelector,
  teamListSelector,
} from '../state/team';

// import ListView from '../components/ListView.qml';
import TeamButton from '../components/TeamButton.qml';
import AddAccountButton from '../components/AddAccountButton.qml';

const showLoginWindow = () => showWindow('login');

const connectToRedux = connect(
  state => ({
    teamList: teamListSelector(state),
    teamInfo: teamInfoSelector(state),
  }),
  {
    onAddAccount: showLoginWindow,
  }
);

const styles = {
  container: {
    spacing: 0,
    width: 68,
  },
  item: {
    width: 36,
    height: 36,
  },
};

const getIcon = path('icon.image_88');

// TODO: fix the ordering
class TeamList extends React.Component {
  render() {
    const { onAddAccount, teamList = {}, teamInfo = {} } = this.props;
    const teamIds = Object.keys(teamList);
    return (
      <ColumnLayout style={styles.container}>
        <Column
          Layout={{ fillWidth: true, topMargin: teamIds.length > 0 ? 24 : 0 }}
          spacing={24}
        >
          {teamIds.map(id => (
            <TeamButton
              key={id}
              onClicked={onAddAccount}
              style={styles.item}
              backgroundIcon={getIcon(teamInfo[id]) || ''}
              anchors={{ horizontalCenter: 'parent.horizontalCenter' }}
            />
          ))}
        </Column>
        <AddAccountButton
          key="add-account"
          style={styles.item}
          onClicked={onAddAccount}
          Layout={{
            preferredWidth: 36,
            preferredHeight: 36,
            alignment: Qt.AlignTop | Qt.AlignHCenter,
            topMargin: 24,
          }}
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(TeamList);