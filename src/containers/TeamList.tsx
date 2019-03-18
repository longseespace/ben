import {
  Column,
  NumberAnimation,
  QtQuickControls2,
  Transition,
} from 'react-qml';

const { ScrollView } = QtQuickControls2;
import { connect } from 'react-redux';
import * as React from 'react';

import AddAccountButton from '../components/AddAccountButton.qml';
import TeamListItem from '../components/TeamListItem';
import { openSigninWindow } from '../actions/window-actions';
import { selectTeam } from '../actions/app-teams-actions';
import { getSelectedTeamId, getSortedTeams } from '../reducers/selectors';
import { RootState } from '../reducers';
import { Team } from '../actions/team-actions';

const connectToRedux = connect(
  (state: RootState) => ({
    teamList: getSortedTeams(state),
    selectedTeamId: getSelectedTeamId(state),
  }),
  {
    onAddAccount: openSigninWindow,
    onTeamSelected: selectTeam,
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

const addTransition = (
  <Transition>
    <NumberAnimation property="scale" from={0.8} to={1} duration={100} />
  </Transition>
);

const fillParent = { fill: 'parent' };

type Props = {
  onAddAccount: Function;
  onTeamSelected: Function;
  selectedTeamId: string | null;
  teamList: Array<Team>;
};

type State = {
  dragging: boolean;
};

// TODO: fix the ordering
class TeamList extends React.Component<Props, State> {
  state: State = {
    dragging: false,
  };

  onItemDragStarted = (key: string) => {
    console.log('onItemDragStarted', key);
    this.setState({ dragging: true });
  };

  onItemDragFinished = (key: string) => {
    console.log('onItemDragFinished', key);
    this.setState({ dragging: false });
  };

  render() {
    const {
      onAddAccount,
      onTeamSelected,
      selectedTeamId,
      teamList = [],
    } = this.props;
    const { dragging } = this.state;
    return (
      <ScrollView anchors={fillParent}>
        <Column style={styles.container}>
          <Column add={addTransition} style={styles.teamList}>
            {teamList.map((team, index) => (
              <TeamListItem
                key={team.id}
                index={index}
                selected={selectedTeamId === team.id}
                backgroundIcon={team.icon.image_88 || ''}
                onSelected={() => onTeamSelected(team.id)}
                onDragStarted={this.onItemDragStarted}
                onDragFinished={this.onItemDragFinished}
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
