const http = require('http');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const createWebsocketProxy = require('./createWebsocketProxy');
const hotMiddleware = require('./hotMiddleware');

const WebSocketServer = require('ws').Server;

const app = express();
const createConfig = require('../../webpack.config.js');
const config = createConfig({}, { mode: 'development' });
const compiler = webpack(config);

const webpackMiddleware = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
});

const httpServer = http.createServer(app);
const webSocketServer = new WebSocketServer({ server: httpServer });

hotMiddleware(compiler, createWebsocketProxy(webSocketServer, '/hot'));

app.use(webpackMiddleware);

// Serve the files on port 8081.
httpServer.listen(8081, function() {
  console.log('Development server ready on port 8081\n');
});
