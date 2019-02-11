/* @flow */
import { combineReducers } from 'redux';
import { reducers as apiReducers } from 'redux-api-call';
import counter from '../containers/counter.state';
import workspace from './workspace';
import window from './window';

export default combineReducers({
  ...apiReducers,
  ...workspace,
  ...window,
  counter,
});
