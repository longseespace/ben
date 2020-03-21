/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 *
 */

/**
 * When imported, this module will setup almost everything needed for HMR or provide an API
 * for setting it up manualy in case of more advanced projects.
 *
 * In production it will do nothing.
 */
if (!module.hot || process.env.NODE_ENV === 'production') {
  module.exports = {
    makeHot(rootFactory) {
      /**
       * Return the original rootFactory and be quiet.
       */
      return rootFactory;
    },

    redraw() {},

    tryUpdateSelf() {},

    callOnce(callback) {
      callback();
    },

    clearCacheFor() {},
  };
} else {
  // global.__HAUL_HMR__ = global.__HAUL_HMR__ || {};

  require('./hotClient.js')({
    path: `${process.env.DEV_SERVER_ORIGIN || ''}/hot`,
    overlay: false,
    platform: Qt.platform.os,
  });

  // module.exports = require('./hotApi');
}
