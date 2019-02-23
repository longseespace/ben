import { Column, ColumnLayout } from 'react-qml';
import { connect } from 'react-redux';
import { path } from 'lodash/fp';
import * as React from 'react';

import {
  selectTeam,
  selectedTeamIdSelector,
  teamInfoSelector,
} from '../state/team';
import { showLoginWindow } from '../state/loginWindow';
import AddAccountButton from '../components/AddAccountButton.qml';
import TeamListItem from '../components/TeamListItem';

const connectToRedux = connect(
  state => ({
    teamInfo: teamInfoSelector(state),
    selectedTeamId: selectedTeamIdSelector(state),
  }),
  {
    onAddAccount: showLoginWindow,
    onTeamSelected: selectTeam,
  }
);

const styles = {
  container: {
    width: 68,
    spacing: 0,
  },
  teamList: {
    topPadding: 16,
    spacing: 16,
  },
  teamButton: {
    width: 36,
    height: 36,
  },
  addButton: {
    preferredWidth: 36,
    preferredHeight: 36,
    alignment: Qt.AlignTop | Qt.AlignHCenter,
    marginTop: 16,
  },
};

const getIcon = path('icon.image_88');

// TODO: fix the ordering
class TeamList extends React.Component {
  render() {
    const {
      onAddAccount,
      onTeamSelected,
      selectedTeamId,
      teamInfo = {},
    } = this.props;
    const teamIds = Object.keys(teamInfo);
    return (
      <ColumnLayout style={styles.container}>
        <Column style={styles.teamList}>
          {teamIds.map((id, index) => (
            <TeamListItem
              key={id}
              index={index}
              selected={selectedTeamId === id}
              backgroundIcon={getIcon(teamInfo[id]) || ''}
              onSelect={() => onTeamSelected(id)}
              Drag={{
                active: true,
                dragType: 'Automatic',
                hotSpot: Qt.point(18, 18),
              }}
            />
          ))}
        </Column>
        <AddAccountButton
          key="add-account"
          style={styles.addButton}
          onClicked={onAddAccount}
        />
      </ColumnLayout>
    );
  }
}

export default connectToRedux(TeamList);
