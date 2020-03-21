// if (!global.self) {
//   global.self = global; /* eslint-disable-line */
// }

if (!global.window) {
  global.window = global;
}

let inQmlContext = false;
try {
  inQmlContext =
    Qt && Qt.createComponent && typeof Qt.createComponent === 'function';
} catch (e) {
  // ignore
}

if (!inQmlContext) {
  const noop = () => {};
  global.Qt = {
    createComponent: noop,
    createQmlObject: noop,
  };
}

// if (!global.Map) {
//   try {
//     global.Map = Map;
//     global.Set = Set;
//     global.Symbol = Symbol;
//     global.WeakMap = WeakMap;
//     global.Object = Object;
//   } catch (e) {
//     console.warn('Unable to polyfill Map/Set/Symbol/WeakMap');
//   }
// }

require('./polyfills/timer')(global);
require('./polyfills/websocket')(global);
require('./polyfills/fetch')(global);
require('./polyfills/localStorage.js')(global);
require('./polyfills/importScriptsPolyfill');

// require('../../vendor/polyfills/console.js')(global);
// require('../../vendor/polyfills/timer.js')(global);
// require('../../vendor/polyfills/websocket.js')(global);
// require('../../vendor/polyfills/promise.js')(global);
// require('../../vendor/polyfills/fetch.js')(global);
// require('../../vendor/polyfills/localStorage.js')(global);
// require('../../vendor/polyfills/webdb.js')(global);
// require('../../vendor/polyfills/error-guard.js');
// require('../../vendor/polyfills/Number.es6.js');
// require('../../vendor/polyfills/String.prototype.es6.js');
// require('../../vendor/polyfills/Array.prototype.es6.js');
// require('../../vendor/polyfills/Array.es6.js');
// require('../../vendor/polyfills/Object.es7.js');
// require('../../vendor/polyfills/babelHelpers.js');

// require('./setupDevTools')(global);

// require('../hot/client/importScriptsPolyfill');

// if (process.env.NODE_ENV !== 'production') {
//   let protocol;
//   let origin;

//   // If remote debugger is attached, we have access to `window` object
//   // from which we can get `protocol` and `origin` of dev server.
//   // This is a prefered way in remote debugger, otherwise it would
//   // fail due to CSP errors because of making requests to eg `10.0.2.2`
//   // from `localhost`.
//   if (typeof window !== 'undefined' && window.location) {
//     protocol = window.location.protocol;
//     origin = window.location.host;
//   } else {
//     // In order to ensure hot client has a valid URL we need to get a valid origin
//     // from URL from which the bundle was loaded. When using iOS simulator/Android emulator
//     // or Android device it will be `localhost:<port>` but when using real iOS device
//     // it will be `<ip>.xip.io:<port>`.
//     // const { scriptURL } = NativeModules.SourceCode;
//     // if (scriptURL) {
//     //   [protocol, , origin] = scriptURL.split('/');
//     // }
//   }

//   if (protocol && origin) {
//     global.DEV_SERVER_ORIGIN = `${protocol}//${origin}`;

//     // Webpack's `publicPath` needs to be overwritten with `DEV_SERVER_ORIGIN` otherwise,
//     // it would still make requests to (usually) `localhost`.
//     __webpack_require__.p = `${global.DEV_SERVER_ORIGIN}/`; // eslint-disable-line no-undef
//   }
// }
