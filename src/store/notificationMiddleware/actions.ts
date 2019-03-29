import { NOTIFICATIONS } from './constants';

export interface NotificationSender {
  showMessage(title: string, message: string, icon?: any, msecs?: number): void;
}

export type NotificationMessagePayload = {
  title: string;
  message: string;
  icon?: any;
  msecs?: number;
};

const registerSender = (sender: NotificationSender) => ({
  type: NOTIFICATIONS.REGISTER_SENDER,
  payload: sender,
});

const deregisterSender = () => ({
  type: NOTIFICATIONS.DEREGISTER_SENDER,
});

const showMessage = (
  title: string,
  message: string,
  icon?: any,
  msecs?: number
) => ({
  type: NOTIFICATIONS.SHOW_MESSAGE,
  payload: {
    title,
    message,
    icon,
    msecs,
  },
});

const NotificationActions = {
  registerSender,
  deregisterSender,
  showMessage,
};

export default NotificationActions;
