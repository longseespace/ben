import { AsyncStorage } from 'react-qml';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import { KEYCHAIN_SERVICE_NAME } from '../constants';

import accountsReducer from './accounts-reducer';
import appTeamsReducer from './app-teams-reducers';
import windowsReducer from './windows-reducers';
import teamsReducer from './teams-reducers';
import workspacesReducer from './workspaces-reducers';
import conversationsReducer from './conversations-reducers';
import presencesReducer from './presences-reducers';
import messagesReducer from './messages-reducers';
import usersReducer from './users-reducers';

import SecureStorage from '../lib/SecureStorage';
const secureStorage = new SecureStorage(KEYCHAIN_SERVICE_NAME);

// persist storage
const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['accounts', 'workspacesReducer'],
  whitelist: ['appTeams', 'teams', 'conversations', 'users'],
};

// secure storage
const accountPersistConfig = {
  key: 'accounts',
  storage: secureStorage,
};

const reducers = combineReducers({
  accounts: persistReducer(accountPersistConfig, accountsReducer),
  appTeams: appTeamsReducer,
  windows: windowsReducer,
  teams: teamsReducer,
  workspaces: workspacesReducer,
  conversations: conversationsReducer,
  presences: presencesReducer,
  messages: messagesReducer,
  users: usersReducer,
});

const rootReducer = persistReducer(rootPersistConfig, reducers);

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
