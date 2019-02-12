/* @flow */
import { combineReducers } from 'redux';
import { reducers as apiReducers } from 'redux-api-call';
import counter from '../containers/counter.state';
import workspace from './workspace';
import window from './window';
import conversation from './conversation';

export default combineReducers({
  ...apiReducers,
  ...workspace,
  ...window,
  ...conversation,
  counter,
});
