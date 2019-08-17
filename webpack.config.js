const path = require('path');
const webpack = require('webpack');
const StringReplacePlugin = require('string-replace-webpack-plugin');

const assetsPattern = /\.(aac|aiff|bmp|caf|gif|html|jpeg|jpg|m4a|m4v|mov|mp3|mp4|mpeg|mpg|obj|otf|pdf|png|psd|svg|ttf|wav|webm|webp)$/;

const rewireModuleIdPatcher = StringReplacePlugin.replace({
  replacements: [
    {
      pattern: '_RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;',
      replacement: () => {
        return '_RewireModuleId__ = globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;';
      },
    },
  ],
});

const generatorFunctionConstructorPatcher = StringReplacePlugin.replace({
  replacements: [
    {
      pattern: /GeneratorFunctionPrototype\.constructor = GeneratorFunction;/gi,
      replacement: () => {
        return `Object.defineProperty(GeneratorFunctionPrototype, 'constructor', { value: GeneratorFunction });`;
      },
    },
  ],
});

const rxjsConstructorPatcher = StringReplacePlugin.replace({
  replacements: [
    {
      pattern: /this\.constructor = d;/gi,
      replacement: () => {
        return `Object.defineProperty(this, 'constructor', { value: d });`;
      },
    },
  ],
});

const errorNamePatcher = StringReplacePlugin.replace({
  replacements: [
    {
      pattern: /error\.name = 'Invariant Violation';/gi,
      replacement: () => {
        return `Object.defineProperty(error, 'name', { value: 'Invariant Violation' });`;
      },
    },
    {
      pattern: /err\.name = 'Invariant Violation';/gi,
      replacement: () => {
        return `Object.defineProperty(err, 'name', { value: 'Invariant Violation' });`;
      },
    },
  ],
});

function injectPolyfillIntoEntry(userEntry, polyfillPath) {
  if (typeof userEntry === 'string') {
    return [polyfillPath, userEntry];
  }
  if (Array.isArray(userEntry)) {
    return [polyfillPath, ...userEntry];
  }
  if (typeof userEntry === 'object') {
    const chunkNames = Object.keys(userEntry);
    return chunkNames.reduce((entryObj, name) => {
      // $FlowFixMe
      const chunk = userEntry[name];
      if (typeof chunk === 'string') {
        entryObj[name] = [polyfillPath, chunk];
        return entryObj;
      } else if (Array.isArray(chunk)) {
        entryObj[name] = [polyfillPath, ...chunk];
        return entryObj;
      }
      return chunk;
    }, {});
  }
  return userEntry;
}

module.exports = (env, argv) => {
  const { platform = 'osx', port = 8081, mode } = argv;

  const dev = mode !== 'production';

  const devServerHost = process.env.DEV_SERVER_HOST || 'localhost';

  const defaultEntry = [
    './index.qml',
    `./index.${platform}.qml`,
    `./index.tsx`,
  ];
  const polyfillPath = require.resolve('./webpack/polyfillEnvironment.js');

  return {
    context: path.resolve(__dirname, 'src'),
    entry: injectPolyfillIntoEntry(defaultEntry, polyfillPath),
    output: {
      path: path.join(__dirname, 'native/dist'),
      filename: `${platform}.bundle.js`,
      library: 'Bundle',
    },

    node: {
      setImmediate: false,
      global: true,
    },

    devtool: false,

    devServer: {
      contentBase: path.join(__dirname, 'native/dist'),
      compress: true,
      port: port,
    },

    module: {
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.(ts|js)x?$/,
          loader: require.resolve('babel-loader'),
          exclude: /node_modules/,
        },
        {
          test: /\.qml$/,
          use: [
            {
              loader: require.resolve('./webpack/qmlLoader'),
              options: {
                publicPath: '/',
                name: () => {
                  if (dev) {
                    return '[path][name].[ext]?[hash]';
                  }
                  return '[path][name].[ext]';
                },
              },
            },
          ],
        },
        {
          test: assetsPattern,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                publicPath: '/',
                name: () => {
                  if (dev) {
                    return '[path][name].[ext]?[hash]';
                  }
                  return '[path][name].[ext]';
                },
              },
            },
          ],
        },
        {
          test: /runtime\.js$/,
          loader: generatorFunctionConstructorPatcher,
        },
        {
          test: /rxjs(\/|\\).*\.js$/,
          loader: rxjsConstructorPatcher,
        },
        {
          test: /.js$/,
          loader: errorNamePatcher,
        },
        {
          test: /connected-react-router.*\.js$/,
          loader: rewireModuleIdPatcher,
        },
      ],
    },

    plugins: [
      new StringReplacePlugin(),
      new webpack.DefinePlugin({
        /**
         * Various libraries like React rely on `process.env.NODE_ENV`
         * to distinguish between production and development
         */
        'process.env.NODE_ENV': dev ? '"development"' : '"production"',
        'process.env.DEV_SERVER_HOST': JSON.stringify(devServerHost),
        'process.env.DEV_SERVER_ORIGIN': JSON.stringify(
          `ws://${devServerHost}:${port}`
        ),
        'process.env.__REACT_DEVTOOLS_HOST__':
          process.env.__REACT_DEVTOOLS_HOST__ || JSON.stringify(devServerHost),
        'process.env.__REACT_DEVTOOLS_PORT__':
          process.env.__REACT_DEVTOOLS_PORT__,
        __DEV__: dev,
      }),
    ],

    resolve: {
      mainFields: ['browser', 'main'],
      extensions: [
        `.${platform}.js`,
        `.${platform}.ts`,
        '.js',
        '.ts',
        `.${platform}.jsx`,
        `.${platform}.tsx`,
        '.jsx',
        '.tsx',
      ],
    },

    optimization: {
      minimize: !dev,
      namedModules: true,
      concatenateModules: true,
    },

    target: 'webworker',
  };
};
