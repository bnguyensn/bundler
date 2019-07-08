/**
 * This re-exports the babel-jest transformer. We do this to to help locate our
 * babel config file.
 * */

const path = require('path');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  configFile: path.resolve(__dirname, 'babel.config.js'),
});
