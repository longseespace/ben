import { combineReducers } from 'redux';
import { reducers as apiReducers } from 'redux-api-call';
import team from './team';
import window from './window';
import conversation from './conversation';

export default combineReducers({
  ...apiReducers,
  ...team,
  ...window,
  ...conversation,
});
