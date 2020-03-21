/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 *
 */

const processUpdate = require('webpack-hot-middleware/process-update');

function normalizeOptions({ path, quiet, overlay, reload, name }) {
  const shouldLog = !quiet;
  const options = {
    path,
    overlay: true,
    reload: false,
    name: '',
    logger: {
      shouldLog,

      log(...args) {
        if (shouldLog) {
          console.log(...args);
        }
      },

      warn(...args) {
        if (shouldLog) {
          console.warn(...args);
        }
      },

      error(...args) {
        if (shouldLog) {
          console.error(...args);
        }
      },
    },
  };

  if (overlay) {
    options.overlay = overlay !== 'false';
  }

  if (reload) {
    options.reload = reload !== 'false';
  }

  if (name) {
    options.name = name;
  }

  return options;
}

function processPayload(payload, { logger, reporter, ...opts }) {
  switch (payload.action) {
    case 'building':
      logger.log(
        `[HMR] Bundle ${payload.name ? `'${payload.name}' ` : ''}rebuilding`
      );
      break;

    case 'built':
      logger.log(
        `[HMR] Bundle ${payload.name ? `'${payload.name}' ` : ''}rebuilt in ${
          payload.time
        }ms`
      );
    // fall through

    case 'sync':
      if (payload.name && opts.name && payload.name !== opts.name) {
        return;
      }

      if (payload.errors.length > 0 && reporter) {
        reporter.problems('errors', payload);
      } else if (payload.warnings.length > 0 && reporter) {
        reporter.problems('warnings', payload);
      } else if (reporter) {
        reporter.cleanProblemsCache();
        reporter.success();
      }

      processUpdate(payload.hash, payload.modules, {
        ...opts,
        log: logger.shouldLog,
        warn: logger.shouldLog,
        error: logger.shouldLog,
      });
      break;

    default:
      logger.warn(`[HMR] Invalid action ${payload.action}`);
  }
}
/**
 * Custom HMR client with WebSocket support instead of EventSource as `webpack-hot-middleware`
 */

module.exports = function connect(options) {
  const { logger, ...opts } = normalizeOptions(options);
  const ws = new global.WebSocket(`${opts.path}?platform=${opts.platform}`);

  ws.onopen = () => {
    logger.log('[HMR] Client connected');
  };

  ws.onerror = error => {
    logger.error(
      `[HMR] Client could not connect to the server ${opts.path}`,
      error
    );
  };

  ws.onmessage = message => {
    if (typeof message.data !== 'string') {
      throw new Error(`[HMR] Data from websocker#onmessage must be a string`);
    }

    const payload = JSON.parse(message.data);

    try {
      processPayload(payload, {
        logger,
        ...opts,
      });
    } catch (error) {
      logger.warn(`[HMR] Invalid message: ${payload}`, error);
    }
  };
};
