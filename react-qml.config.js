const path = require('path');
const pkg = require('./package.json');
const SentryCliPlugin = require('@sentry/webpack-plugin');

const { NODE_ENV, TRAVIS_BRANCH } = process.env;

const appPlugins = [];

if (
  NODE_ENV === 'production' &&
  (TRAVIS_BRANCH === 'develop' || TRAVIS_BRANCH === 'master')
) {
  appPlugins.push(
    new SentryCliPlugin({
      include: './native/dist',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'react-qml.config.js'],
      release: pkg.version,
    })
  );
}

module.exports = ({ root, platform }, defaults) => ({
  context: path.resolve(root, 'src'),
  entry: ['./index.qml', `./index.${platform}.qml`, `./index.tsx`],
  output: {
    path: path.join(root, 'native/dist'),
    filename: `${platform}.bundle.js`,
    library: 'Bundle',
  },
  plugins: [...defaults.plugins, ...appPlugins],
});
