import { combineEpics } from 'redux-observable';
import {
  pingEpic,
  setWindowTitleWhenSelectTeamEpic,
  showNotificationEpic,
} from './app-epics';
import { userPresenceSubEpic, fetchUserEpic } from './user-epics';
import {
  initMessageViewEpic,
  initMessageViewWhenSelectConversationEpic,
} from './message-epics';

export default combineEpics(
  pingEpic,
  userPresenceSubEpic,
  fetchUserEpic,
  setWindowTitleWhenSelectTeamEpic,
  showNotificationEpic,
  initMessageViewWhenSelectConversationEpic,
  initMessageViewEpic
);
