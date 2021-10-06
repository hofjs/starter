const path = require('path');

const config = {
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  optimization: {
    moduleIds: 'named',
  }
};
module.exports = config;


