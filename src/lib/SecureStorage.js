// TODO: move this to `react-qml`

const SERVICE_NAME = __DEV__ ? 'Ben-dev' : 'Ben';
const Keychain = RQ.keychain();

async function getItem(key) {
  if (typeof key !== 'string') {
    return Promise.reject('Key must be a string');
  }
  return new Promise((resolve, reject) => {
    Keychain.readPassword(SERVICE_NAME, key, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

async function setItem(key, value) {
  if (typeof key !== 'string') {
    return Promise.reject('Key must be a string');
  }
  if (typeof value !== 'string') {
    return Promise.reject('Value must be a string');
  }
  return new Promise((resolve, reject) => {
    Keychain.writePassword(SERVICE_NAME, key, value, error => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}
async function removeItem(key) {
  if (typeof key !== 'string') {
    return Promise.reject('Key must be a string');
  }
  return new Promise((resolve, reject) => {
    Keychain.deletePassword(SERVICE_NAME, key, error => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

const SecureStore = {
  getItem,
  setItem,
  removeItem,
};

export default SecureStore;
