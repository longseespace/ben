import { FluxStandardAction } from 'flux-standard-action';
import { NOTIFICATIONS } from './constants';
import { NotificationSender, NotificationMessagePayload } from './actions';
import { MiddlewareAPI, Dispatch, AnyAction } from 'redux';

export type DNAction = FluxStandardAction<any, any>;

let notificationSender: NotificationSender | null | undefined;
let notificationClickActions: Array<AnyAction> | null | undefined;

// middleware
const middleware = (api: MiddlewareAPI) => (next: Dispatch) => async (
  action: DNAction
) => {
  function handleMessageClicked() {
    if (notificationClickActions) {
      notificationClickActions.forEach(api.dispatch);
    }
  }

  if (action.type === NOTIFICATIONS.REGISTER_SENDER) {
    const sender = action.payload as NotificationSender;
    notificationSender = sender;
    notificationSender.messageClicked.connect(handleMessageClicked);
  }

  if (action.type === NOTIFICATIONS.DEREGISTER_SENDER && notificationSender) {
    notificationSender.messageClicked.disconnect(handleMessageClicked);
    notificationSender = null;
  }

  if (action.type === NOTIFICATIONS.SHOW_MESSAGE && notificationSender) {
    const {
      title,
      message,
      icon,
      msecs,
      clickActions,
    } = action.payload as NotificationMessagePayload;
    if (clickActions) {
      if (!Array.isArray(clickActions)) {
        notificationClickActions = [clickActions];
      } else {
        notificationClickActions = clickActions;
      }
    }
    notificationSender.showMessage(title, message, icon, msecs);
  }

  return next(action);
};

export default middleware;
