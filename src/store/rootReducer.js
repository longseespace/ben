import { combineReducers } from 'redux';
import { reducers as apiReducers } from 'redux-api-call';
import account from '../state/account';
import team from '../state/team';
import loginWindow from '../state/loginWindow';

export default combineReducers({
  ...apiReducers,
  ...account,
  ...team,
  ...loginWindow,
});
