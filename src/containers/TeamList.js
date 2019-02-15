import { Column, ColumnLayout } from 'react-qml';
import { connect } from 'react-redux';
import { path } from 'lodash/fp';
import * as React from 'react';

import { selectTeam, teamInfoSelector } from '../state/team';
import { showLoginWindow } from '../state/loginWindow';
import AddAccountButton from '../components/AddAccountButton.qml';
import TeamButton from '../components/TeamButton.qml';

const connectToRedux = connect(
  state => ({
    teamInfo: teamInfoSelector(state),
  }),
  {
    onAddAccount: showLoginWindow,
    onTeamSelected: selectTeam,
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
    const { onAddAccount, onTeamSelected, teamInfo = {} } = this.props;
    const teamIds = Object.keys(teamInfo);
    return (
      <ColumnLayout style={styles.container}>
        <Column
          Layout={{ fillWidth: true, topMargin: teamIds.length > 0 ? 24 : 0 }}
          spacing={24}
        >
          {teamIds.map(id => (
            <TeamButton
              key={id}
              onClicked={() => onTeamSelected(id)}
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
