import { QQuickWindow } from 'react-qml/dist/components/QtQuickWindow';

declare namespace ReactQML {
  // global RQ object
  export interface RQ {
    keychain(): RQKeychain;
    setBadgeLabelText(text: string): void;
    hideTitleBar(window?: QQuickWindow): void;
  }

  // RQKeychain
  export interface RQKeychainError {
    name: string;
    message: string;
  }

  export type RQKeychainCallback<T> = (
    error: RQKeychainError | boolean,
    result: T
  ) => void;

  export interface RQKeychain {
    setInsecureFallback(insecureFallback: boolean): void;
    readPassword(
      service: string,
      account: string,
      callback?: RQKeychainCallback<string>
    ): void;
    writePassword(
      service: string,
      account: string,
      value: string,
      callback?: RQKeychainCallback<undefined>
    ): void;
    deletePassword(
      service: string,
      account: string,
      callback?: RQKeychainCallback<undefined>
    ): void;
  }
}
