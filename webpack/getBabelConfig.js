const fs = require('fs');
const path = require('path');

const DEFAULT_BABELRC = {
  presets: [
    [
      '@babel/env',
      {
        targets: 'since 2016',
        exclude: ['transform-regenerator'],
      },
    ],
    '@babel/typescript',
    '@babel/react',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    'lodash',
  ],
};

export default function getBabelConfig(cwd) {
  let babelrc;

  const file = path.join(cwd, '.babelrc');

  if (fs.existsSync(file)) {
    babelrc = { extends: file };
  } else {
    babelrc = DEFAULT_BABELRC;
  }

  // TODO: add react-hot-reload support

  return babelrc;
}
