function createWebsocketProxy(webSocketServer, path) {
  return {
    onConnection(handler) {
      webSocketServer.on('connection', (socket, req) => {
        if (req.url.indexOf(path) === 0) {
          handler(socket);
        }
      });
    },
  };
}

module.exports = createWebsocketProxy;
