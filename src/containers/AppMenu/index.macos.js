import { QtLabsPlatform } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { fetchTokensFromSlack } from '../../lib/slack';
import { initWorkspace } from '../../state/account';
import {
  selectTeam,
  selectedTeamIdSelector,
  teamInfoSelector,
} from '../../state/team';
import { showLoginWindow } from '../../state/loginWindow';

const { MenuBar, Menu, MenuItem, MenuSeparator } = QtLabsPlatform;

const collectGarbage = () => {
  gc();
};

const connectToRedux = connect(
  state => ({
    teamInfo: teamInfoSelector(state),
    selectedTeamId: selectedTeamIdSelector(state),
  }),
  {
    onAddAccount: showLoginWindow,
    onTeamSelected: selectTeam,
    initWorkspace,
  }
);

class AppMenu extends React.Component {
  constructor(props) {
    super(props);

    this.importFromSlack = this.importFromSlack.bind(this);
  }

  async importFromSlack() {
    // TODO:
    // ideally this should be within a dialog / custom view
    // so we can show progress / error
    try {
      const tokens = await fetchTokensFromSlack();

      for (const teamId in tokens) {
        if (tokens.hasOwnProperty(teamId)) {
          const item = tokens[teamId];
          this.props.initWorkspace({
            team: item.teamId,
            token: item.token,
          });
        }
      }
    } catch (er) {
      // TODO: show error dialog
      console.log('error fetching token');
      console.log(require('util').inspect(er, { depth: 1 }));
    }
  }

  render() {
    return (
      <MenuBar>
        <Menu title="Ben">
          <MenuItem text="About" role="AboutRole" />
          <MenuItem text="Preferences" role="PreferencesRole" />
          <MenuItem
            text="Collect Garbage"
            role="ApplicationSpecificRole"
            shortcut="Ctrl+Shift+G"
            onTriggered={collectGarbage}
          />
        </Menu>
        <Menu title="&File">
          <MenuItem text="Close Window" shortcut={StandardKey.Close} />
        </Menu>
        <Menu title="&Edit" type="EditMenu">
          <MenuItem text="Undo" shortcut={StandardKey.Undo} />
          <MenuItem text="Redo" shortcut={StandardKey.Redo} />
          <MenuSeparator />
          <MenuItem text="Cut" shortcut={StandardKey.Cut} />
          <MenuItem text="Copy" shortcut={StandardKey.Copy} />
          <MenuItem text="Paste" shortcut={StandardKey.Paste} />
          <MenuItem text="Paste and Match Style" shortcut="Ctrl+Shift+V" />
          <MenuItem text="Delete" shortcut={StandardKey.Delete} />
          <MenuItem text="Select All" shortcut={StandardKey.SelectAll} />
          <MenuSeparator />
          <MenuItem text="Find" shortcut={StandardKey.Find} />
        </Menu>
        <Menu title="&View">
          <MenuItem text="Zoom In" shortcut={StandardKey.ZoomIn} />
          <MenuItem text="Zoom Out" shortcut={StandardKey.ZoomOut} />
          <MenuItem text="Actual Size" shortcut="Ctrl+0" />
        </Menu>
        <Menu title="&History">
          <MenuItem text="Back" shortcut={StandardKey.Back} />
          <MenuItem text="Forward" shortcut={StandardKey.Forward} />
        </Menu>
        <Menu title="&Window">
          <MenuItem text="Minimize" shortcut="Ctrl+M" />
          <MenuItem text="Zoom" />
          <MenuSeparator />
          <MenuItem text="Bring All to Front" />
          <MenuSeparator />
          <MenuItem
            text={qsTr('Sign in to Another Workspace...')}
            onTriggered={this.props.onAddAccount}
          />
          <MenuItem
            text={qsTr('Import from Slack...')}
            onTriggered={this.importFromSlack}
          />
        </Menu>
        <Menu title="&Help">
          <MenuItem text="Keyboard Shortcuts" />
          <MenuItem text="Report Issue" />
          <MenuItem text="Search Issues" />
        </Menu>
      </MenuBar>
    );
  }
}

export default connectToRedux(AppMenu);
