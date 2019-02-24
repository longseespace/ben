import { combineReducers } from 'redux';
import { reducers as apiReducers } from 'redux-api-call';
import account from '../state/account';
import team from '../state/team';
import conversation from '../state/conversation';
import loginWindow from '../state/loginWindow';
import self from '../state/self';
import message from '../state/message';

export default combineReducers({
  ...apiReducers,
  ...account,
  ...team,
  ...loginWindow,
  ...conversation,
  ...self,
  ...message,
});
