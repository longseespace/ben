import { combineEpics } from 'redux-observable';
import { pingEpic } from './app-epics';
import { userPresenceSubEpic } from './user-epics';

export default combineEpics(pingEpic, userPresenceSubEpic);
