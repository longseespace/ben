declare namespace ReactQML {
  // global RQ object
  export interface RQ {
    keychain(): RQKeychain;
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
