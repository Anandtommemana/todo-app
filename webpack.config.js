const path = require('path');

module.exports = {
  mode: 'development', // Use 'production' for minified output when deploying
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map', // Helps with debugging by mapping errors to original source files
};