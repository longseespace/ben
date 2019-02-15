import { combineReducers } from 'redux';
import { reducers as apiReducers } from 'redux-api-call';
import team from '../state/team';
import window from '../state/window';
import conversation from '../state/conversation';

export default combineReducers({
  ...apiReducers,
  ...team,
  ...window,
  ...conversation,
});
