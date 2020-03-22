/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 */
const { Observable } = require('rxjs/Rx');

/**
 * Send updates on bundle rebuilds, so that HMR client can donwload update and process it.
 */
function hotMiddleware(
  compiler,
  haulProxy,
  opts = {
    debug: false,
  }
) {
  const logger = {
    log(...args) {
      if (opts.debug) {
        console.log('[Hot middleware]', ...args);
      }
    },
  };

  const createLog = (...msgs) => {
    return () => logger.log(...msgs);
  };

  const compilerEvent$ = createCompilerEventStream(compiler);
  const haulConnections$ = createConnectionStream(haulProxy, 'haul');
  compilerEvent$
    .withLatestFrom(
      haulConnections$.do(createLog('Haul client connected')),
      mergeCompilerEventWithConnection
    )
    .map(event => ({
      body: event.body,
      platform: event.platform,
      target: event.target,
      sockets: event[event.target].filter(
        socket =>
          socket.readyState === socket.OPEN &&
          (event.platform === 'all' ||
            socket.upgradeReq.url.includes(`platform=${event.platform}`))
      ),
    }))
    .skipWhile(({ sockets }) => !sockets.length)
    .subscribe(
      event => {
        const { target, sockets, body, platform } = event;
        sockets.forEach(socket => {
          logger.log(
            `Sending message '${body.action || body.type}'${
              body.hash ? `with hash '${body.hash}'` : ''
            } to ${target}:${platform} client`
          );
          socket.send(JSON.stringify(body), error => {
            if (error) {
              logger.log(
                `Sending message ${body.action ||
                  body.type} to ${target}:${platform} client failed`,
                error
              );
              socket.close();
            }
          });
        });
      },
      error => {
        logger.log('Fatal error', error);
      }
    );
}

function createConnectionStream(wsProxy, id) {
  return Observable.create(observer => {
    wsProxy.onConnection(socket => {
      observer.next(socket);
    });
  })
    .scan((acc, socket) => [...acc, socket], [])
    .map(sockets => ({
      [id]: sockets,
    }));
}

function createCompilerEventStream(compiler) {
  return Observable.create(observer => {
    compiler.hooks.invalid.tap('HotMiddleware', () => {
      observer.next({
        target: 'haul',
        platform: 'all',
        body: {
          type: 'update-start',
        },
      });
      observer.next({
        target: 'haul',
        platform: 'all',
        body: {
          action: 'building',
        },
      });
    });
    compiler.hooks.done.tap('HotMiddleware', stats => {
      observer.next({
        target: 'haul',
        platform: 'all',
        body: {
          type: 'update-done',
        },
      });
      getStatsPayload(stats).forEach(payload => {
        observer.next({
          target: 'haul',
          platform: payload.name || 'all',
          body: {
            action: 'built',
            ...payload,
          },
        });
      });
    });
  });
}

function mergeCompilerEventWithConnection(base, connections) {
  return { ...base, ...connections };
}

function getStatsPayload(stats) {
  // For multi-compiler, stats will be an object with a 'children' array of stats
  const bundles = extractBundles(
    stats.toJson({
      errorDetails: false,
    })
  );
  return bundles.map(bundleStats => {
    return {
      name: bundleStats.name,
      time: bundleStats.time,
      hash: bundleStats.hash,
      warnings: bundleStats.warnings || [],
      errors: bundleStats.errors || [],
      modules: buildModuleMap(bundleStats.modules),
    };
  });
}

function extractBundles(stats) {
  // Stats has modules, single bundle
  if (stats.modules) return [stats]; // Stats has children, multiple bundles

  if (stats.children && stats.children.length) return stats.children; // Not sure, assume single

  return [stats];
}

function buildModuleMap(modules) {
  const map = {};
  modules.forEach(module => {
    map[module.id] = module.name;
  });
  return map;
}

module.exports = hotMiddleware;
