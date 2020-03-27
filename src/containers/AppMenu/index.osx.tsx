import NativeMenuBar from './MacMenuBar.qml';

import CrashHandler from '@react-qml/breakpad';
import { QtLabsPlatform, StandardKey } from 'react-qml';
import { connect } from 'react-redux';
import * as React from 'react';

import slack from '../../lib/slack';
import WindowActions from '../../actions/window-actions';
import WorkspaceActions from '../../actions/workspace-actions';
import AccountActions from '../../actions/account-actions';
import { RootState } from '../../reducers';

import { getMainWindowSettings } from '../../reducers/selectors';
import { SingleWindowState } from '../../reducers/windows-reducers';

const collectGarbage = () => {
  gc();
};

const connectToRedux = connect(
  (state: RootState) => ({
    mainWindowSettings: getMainWindowSettings(state),
  }),
  {
    onSigninClicked: WindowActions.openSigninWindow,
    initWorkspace: WorkspaceActions.initWorkspace,
    addAccount: AccountActions.addAccount,
    closeMainWindow: WindowActions.closeMainWindow,
    minimizeMainWindow: () => WindowActions.minimizeWindow('main'),
    toggleMaximizeMainWindow: () => WindowActions.toggleMaximize('main'),
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

function MacMenuBar(props: Props) {
  const { addAccount, initWorkspace } = props;
  const importFromSlack = async () => {
    // TODO:
    // ideally this should be within a dialog / custom view
    // so we can show progress / error
    try {
      const tokens = await slack.fetchTokensFromSlack();
      console.log('tokens');
      console.log(require('util').inspect(tokens, { depth: 1 }));

      for (const teamId in tokens) {
        if (tokens.hasOwnProperty(teamId)) {
          const item = tokens[teamId];
          // add account
          addAccount(item);
          // then init
          initWorkspace(item.teamId, item.token, false);
        }
      }
    } catch (er) {
      // TODO: show error dialog
      console.log('error fetching token');
      console.log(require('util').inspect(er, { depth: 1 }));
    }
  };

  return <NativeMenuBar />;
}

export default connectToRedux(MacMenuBar);
