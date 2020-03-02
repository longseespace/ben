const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const createConfig = require('../../webpack.config.js');
const config = createConfig({}, { mode: 'development' });
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// Serve the files on port 8081.
app.listen(8081, function() {
  console.log('Development server ready on port 8081\n');
});
