
const jest = require('jest');
const path = require('path');
const jestConfigPath = path.resolve(__dirname, '../../configs/jest.config.js');
const jestConfig = require(jestConfigPath);
const log = require('../log');

module.exports = async function runTest() {
  log.info('Initiating tests 🚨...');

  await jest.run([`--config=${JSON.stringify(jestConfig)}`]);
};
