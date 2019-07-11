const jest = require('jest');
const path = require('path');
const jestConfigPath = path.resolve(__dirname, '../../configs/jest.config.js');
const jestConfig = require(jestConfigPath);
const log = require('../log');

module.exports = function runTest() {
  log.info('Initiating tests...');

  jest.run([`--config=${JSON.stringify(jestConfig)}`]);
};
