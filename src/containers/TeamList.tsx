import { Column, QtQuickControls2 } from 'react-qml';

const { ScrollView } = QtQuickControls2;
import { connect } from 'react-redux';
import * as React from 'react';

import AddAccountButton from '../components/AddAccountButton.qml';
import TeamListItem from '../components/TeamListItem';
import { openSigninWindow } from '../actions/window-actions';
import { selectTeam, setTeamSorted } from '../actions/app-teams-actions';
import {
  getSelectedTeamId,
  getSortedTeams,
  getSortedTeamIds,
  getTeamsUnreads,
  getTeamsBadgeCounts,
} from '../reducers/selectors';
import { RootState } from '../reducers';
import { Team } from '../actions/team-actions';
import { StringMap } from '../constants';

const connectToRedux = connect(
  (state: RootState) => ({
    teamIds: getSortedTeamIds(state),
    teamList: getSortedTeams(state),
    selectedTeamId: getSelectedTeamId(state),
    teamsUnreads: getTeamsUnreads(state),
    teamsBadgeCounts: getTeamsBadgeCounts(state),
  }),
  {
    onAddAccount: openSigninWindow,
    onTeamSelected: selectTeam,
    setTeamSorted,
  }
);

const styles = {
  container: {
    width: 68,
    spacing: 16,
    topPadding: 16,
    bottomPadding: 16,
  },
  teamList: {
    spacing: 16,
  },
  teamButton: {
    width: 36,
    height: 36,
  },
  addButton: {
    width: 36,
    height: 36,
    x: 16,
    y: 16,
  },
};

const fillParent = { fill: 'parent' };

type Props = {
  onAddAccount: Function;
  onTeamSelected: Function;
  setTeamSorted: Function;
  selectedTeamId: string | null;
  teamList: Array<Team>;
  teamIds: Array<string>;
  teamsUnreads: StringMap<boolean>;
  teamsBadgeCounts: StringMap<number>;
};

type State = {
  draggingKey: string | undefined;
};

class TeamList extends React.Component<Props, State> {
  state: State = {
    draggingKey: undefined,
  };

  onItemDragStarted = (key: string) => {
    this.setState({ draggingKey: key });
  };

  onItemDragFinished = (key: string) => {
    this.setState({ draggingKey: undefined });
  };

  onItemDropEntered = (key: string, index: number) => {
    // the dragging item just entered this DropArea (index)
    // we would want to move draggingItem to this index

    const { draggingKey } = this.state;
    if (draggingKey) {
      const { teamIds } = this.props;
      const draggingIndex = teamIds.indexOf(draggingKey);

      if (draggingIndex !== index) {
        const sortedTeamIds = [...teamIds];
        const draggingTeam = sortedTeamIds[draggingIndex];
        sortedTeamIds.splice(draggingIndex, 1);
        sortedTeamIds.splice(index, 0, draggingTeam);
        this.props.setTeamSorted(sortedTeamIds);
      }
    }
  };

  onItemSelected = (key: string) => {
    this.props.onTeamSelected(key);
  };

  componentDidUpdate() {
    // this is bad, i know
    // but until we can have redux-observable working property
    // this is the best way
    const { teamsBadgeCounts } = this.props;
    const totalCount = Object.keys(teamsBadgeCounts).reduce(
      (total, teamId) => total + teamsBadgeCounts[teamId],
      0
    );
    if (totalCount > 0) {
      RQ.setBadgeLabelText(String(totalCount));
    } else {
      RQ.setBadgeLabelText('');
    }
  }

  render() {
    const {
      onAddAccount,
      selectedTeamId,
      teamList = [],
      teamsUnreads,
      teamsBadgeCounts,
    } = this.props;
    const dragging = !!this.state.draggingKey;

    return (
      <ScrollView anchors={fillParent}>
        <Column style={styles.container}>
          <Column style={styles.teamList}>
            {teamList.map((team, index) => (
              <TeamListItem
                key={team.id}
                id={team.id}
                index={index}
                name={team.name}
                selected={selectedTeamId === team.id}
                hasUnreads={teamsUnreads[team.id]}
                badgeCount={teamsBadgeCounts[team.id]}
                backgroundIcon={team.icon.image_88 || ''}
                onSelected={this.onItemSelected}
                onDragStarted={this.onItemDragStarted}
                onDragFinished={this.onItemDragFinished}
                onDropAreaEntered={this.onItemDropEntered}
              />
            ))}
          </Column>
          <AddAccountButton
            key="add-account"
            style={styles.addButton}
            onClicked={onAddAccount}
            visible={!dragging}
          />
        </Column>
      </ScrollView>
    );
  }
}

export default connectToRedux(TeamList);
