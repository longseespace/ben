function importScripts(importPath) {
  return new Promise((resolve, reject) => {
    Qt.include(importPath, result => {
      if (result.status === 0) {
        return resolve();
      }
      if (result.status === 2) {
        return reject(new Error('Network error'));
      }
      if (result.status === 3) {
        return reject(new Error(result.exception));
      }
      return 'loading';
    });
  });
}
global.importScripts = global.importScripts || importScripts;
