import { Column, ColumnLayout, NumberAnimation, Transition } from 'react-qml';
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

const addTransition = (
  <Transition>
    <NumberAnimation property="scale" from={0.8} to={1} duration={100} />
  </Transition>
);

// TODO: fix the ordering
class TeamList extends React.Component {
  state = {
    dragging: false,
  };

  onItemDragStarted = key => {
    console.log('onItemDragStarted', key);
    this.setState({ dragging: true });
  };

  onItemDragFinished = key => {
    console.log('onItemDragFinished', key);
    this.setState({ dragging: false });
  };

  render() {
    const {
      onAddAccount,
      onTeamSelected,
      selectedTeamId,
      teamInfo = {},
    } = this.props;
    const { dragging } = this.state;
    const teamIds = Object.keys(teamInfo);
    return (
      <ColumnLayout style={styles.container}>
        <Column add={addTransition} style={styles.teamList}>
          {teamIds.map((id, index) => (
            <TeamListItem
              key={id}
              index={index}
              selected={selectedTeamId === id}
              backgroundIcon={getIcon(teamInfo[id]) || ''}
              onSelected={() => onTeamSelected(id)}
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
      </ColumnLayout>
    );
  }
}

export default connectToRedux(TeamList);
