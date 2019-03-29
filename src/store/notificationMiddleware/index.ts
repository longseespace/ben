import { FluxStandardAction } from 'flux-standard-action';
import { NOTIFICATIONS } from './constants';
import { NotificationSender, NotificationMessagePayload } from './actions';
import { MiddlewareAPI, Dispatch } from 'redux';

export type DNAction = FluxStandardAction<any, any>;

let notificationSender: NotificationSender | null = null;

// middleware
const middleware = (api: MiddlewareAPI) => (next: Dispatch) => async (
  action: DNAction
) => {
  if (action.type === NOTIFICATIONS.REGISTER_SENDER) {
    const sender = action.payload as NotificationSender;
    notificationSender = sender;
  }

  if (action.type === NOTIFICATIONS.DEREGISTER_SENDER) {
    notificationSender = null;
  }

  if (action.type === NOTIFICATIONS.SHOW_MESSAGE && notificationSender) {
    const {
      title,
      message,
      icon,
      msecs,
    } = action.payload as NotificationMessagePayload;
    notificationSender.showMessage(title, message, icon, msecs);
  }

  return next(action);
};

export default middleware;
