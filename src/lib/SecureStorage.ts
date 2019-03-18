// TODO: move this to `react-qml`
const Keychain = RQ.keychain();

class SecureStorage {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  getItem(key: string) {
    if (typeof key !== 'string') {
      return Promise.reject('Key must be a string');
    }

    const serviceName = this.serviceName;
    return new Promise((resolve, reject) => {
      Keychain.readPassword(serviceName, key, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  }

  setItem(key: string, value: string) {
    if (typeof key !== 'string') {
      return Promise.reject('Key must be a string');
    }
    if (typeof value !== 'string') {
      return Promise.reject('Value must be a string');
    }

    const serviceName = this.serviceName;
    return new Promise((resolve, reject) => {
      Keychain.writePassword(serviceName, key, value, error => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
  }

  removeItem(key: string) {
    if (typeof key !== 'string') {
      return Promise.reject('Key must be a string');
    }

    const serviceName = this.serviceName;
    return new Promise((resolve, reject) => {
      Keychain.deletePassword(serviceName, key, error => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
  }
}

export default SecureStorage;
