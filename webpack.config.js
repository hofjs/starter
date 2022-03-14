const path = require('path');

const config = {
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  optimization: {
    moduleIds: 'named',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'www'),
    }
  }
};
module.exports = config;


