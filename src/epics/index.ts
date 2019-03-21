import { combineEpics } from 'redux-observable';
import { pingEpic } from './app-epics';

export default combineEpics(pingEpic);
