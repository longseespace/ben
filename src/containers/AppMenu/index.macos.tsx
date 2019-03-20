import { QtLabsPlatform, StandardKey } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import { fetchTokensFromSlack } from '../../lib/slack';
import {
  openSigninWindow,
  closeMainWindow,
  minimizeWindow,
  maximizeWindow,
  toggleMaximize,
} from '../../actions/window-actions';
import { initWorkspace } from '../../actions/workspace-actions';
import { addAccount } from '../../actions/account-actions';
import { RootState } from '../../reducers';
import { getMainWindowSettings } from '../../reducers/selectors';
import { SingleWindowState } from '../../reducers/windows-reducers';

const { MenuBar, Menu, MenuItem, MenuSeparator } = QtLabsPlatform;

const collectGarbage = () => {
  gc();
};

const connectToRedux = connect(
  (state: RootState) => ({
    mainWindowSettings: getMainWindowSettings(state),
  }),
  {
    onSigninClicked: openSigninWindow,
    initWorkspace,
    addAccount,
    closeMainWindow,
    minimizeMainWindow: () => minimizeWindow('main'),
    toggleMaximizeMainWindow: () => toggleMaximize('main'),
  }
);

type Props = {
  mainWindowSettings: SingleWindowState;
  onSigninClicked: Function;
  initWorkspace: Function;
  addAccount: Function;
  closeMainWindow: Function;
  minimizeMainWindow: Function;
  toggleMaximizeMainWindow: Function;
};

class AppMenu extends React.Component<Props> {
  importFromSlack = async () => {
    // TODO:
    // ideally this should be within a dialog / custom view
    // so we can show progress / error
    try {
      const tokens = await fetchTokensFromSlack();
      console.log('tokens');
      console.log(require('util').inspect(tokens, { depth: 1 }));

      for (const teamId in tokens) {
        if (tokens.hasOwnProperty(teamId)) {
          const item = tokens[teamId];
          // add account
          this.props.addAccount(item);
          // then init
          this.props.initWorkspace(item.teamId, item.token, false);
        }
      }
    } catch (er) {
      // TODO: show error dialog
      console.log('error fetching token');
      console.log(require('util').inspect(er, { depth: 1 }));
    }
  };

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
          <MenuItem
            text="Close Window"
            shortcut={StandardKey.Close}
            onTriggered={this.props.closeMainWindow}
          />
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
          <MenuItem
            text="Minimize"
            shortcut="Ctrl+M"
            onTriggered={this.props.minimizeMainWindow}
          />
          <MenuItem
            text="Zoom"
            onTriggered={this.props.toggleMaximizeMainWindow}
          />
          <MenuSeparator />
          <MenuItem text="Bring All to Front" />
          <MenuSeparator />
          <MenuItem
            text={qsTr('Sign in to Another Workspace...')}
            onTriggered={this.props.onSigninClicked}
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
