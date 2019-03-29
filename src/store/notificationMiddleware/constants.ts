export type notificationType =
  | 'DN_REGISTER_SENDER'
  | 'DN_DEREGISTER_SENDER'
  | 'DN_SHOW_MESSAGE'
  | 'DN_MESSAGE_CLICKED';

export const NOTIFICATIONS = {
  REGISTER_SENDER: 'DN_REGISTER' as notificationType,
  DEREGISTER_SENDER: 'DN_DEREGISTER_SENDER' as notificationType,
  SHOW_MESSAGE: 'DN_SHOW_MESSAGE' as notificationType,
  MESSAGE_CLICKED: 'DN_MESSAGE_CLICKED' as notificationType,
};
