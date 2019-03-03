const path = require('path');

module.exports = ({ root, platform }) => ({
  context: path.resolve(root, 'src'),
  entry: [`./index.qml`, `./index.js`],
  output: {
    path: path.join(root, 'native/dist'),
    filename: `${platform}.bundle.js`,
    library: 'Bundle',
  },
});
