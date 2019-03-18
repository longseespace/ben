import { FluxStandardAction } from 'flux-standard-action';

declare const __DEV__: boolean;

// Keychain Service Name
export const KEYCHAIN_SERVICE_NAME = __DEV__ ? 'Ben-dev' : 'Ben';

export interface StringMap<T> {
  [key: string]: T;
}

// Slack API
export const API_ROOT = 'https://slack.com/api';

// any action
export type AnyAction = FluxStandardAction<any, void>;
export type StandardAction<T> = FluxStandardAction<T, void>;
