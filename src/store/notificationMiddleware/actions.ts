import { NOTIFICATIONS } from './constants';
import { AnyAction } from 'redux';

type SignalHandler = () => void;
export interface QmlSignal {
  connect: (handler: SignalHandler) => void;
  disconnect: (handler: SignalHandler) => void;
}

export interface NotificationSender {
  showMessage(title: string, message: string, icon?: any, msecs?: number): void;
  messageClicked: QmlSignal;
}

export type NotificationMessagePayload = {
  title: string;
  message: string;
  icon?: any;
  msecs?: number;
  clickActions?: Array<AnyAction> | AnyAction;
};

const registerSender = (sender: NotificationSender) => ({
  type: NOTIFICATIONS.REGISTER_SENDER,
  payload: sender,
});

const deregisterSender = () => ({
  type: NOTIFICATIONS.DEREGISTER_SENDER,
});

const showMessage = (payload: NotificationMessagePayload) => ({
  type: NOTIFICATIONS.SHOW_MESSAGE,
  payload,
});

const NotificationActions = {
  registerSender,
  deregisterSender,
  showMessage,
};

export default NotificationActions;
