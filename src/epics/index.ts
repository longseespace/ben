import { combineEpics } from 'redux-observable';
import {
  pingEpic,
  setWindowTitleWhenSelectTeamEpic,
  showNotificationEpic,
} from './app-epics';
import { userPresenceSubEpic } from './user-epics';

export default combineEpics(
  pingEpic,
  userPresenceSubEpic,
  setWindowTitleWhenSelectTeamEpic,
  showNotificationEpic
);
