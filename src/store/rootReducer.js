import { AsyncStorage } from 'react-qml';
import { reducers as apiReducers } from 'redux-api-call';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import { ACCOUNT_NAMESPACE } from '../state/constants';
import SecureStorage from '../lib/SecureStorage';
import account from '../state/account';
import conversation from '../state/conversation';
import loginWindow from '../state/loginWindow';
import message from '../state/message';
import self from '../state/self';
import team from '../state/team';

// persist storage
const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['account'],
  whitelist: ['team', 'conversation', 'self'],
};

const accountPersistConfig = {
  key: 'account',
  storage: SecureStorage,
};

const accountReducer = account[ACCOUNT_NAMESPACE];

const rootReducer = combineReducers({
  [ACCOUNT_NAMESPACE]: persistReducer(accountPersistConfig, accountReducer),
  ...apiReducers,
  ...team,
  ...loginWindow,
  ...conversation,
  ...self,
  ...message,
});

export default persistReducer(rootPersistConfig, rootReducer);
