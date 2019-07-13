const testScript = require('./test');
const devScript = require('./dev');
const prodScript = require('./prod');
const generateConfig = require('../generateConfig');
const log = require('../log');

module.exports = async function init(mode, srcPath) {
  switch (mode) {
    case 'test':
      // Initiate tests 🚨...
      return testScript();
    case 'dev':
      // Initiate dev webpack run 🛠️...
      return devScript(generateConfig('development', srcPath));
    case 'prod':
      // Initiate prod webpack build 🚀...
      return prodScript(generateConfig('production', srcPath));
    default:
      // Invalid command 🚫...
      log.error(
        `🚫 Invalid command '${mode}'. Only these commands are supported:`,
      );
      log.error('  test');
      log.error('  dev');
      log.error('  prod');
      throw new Error();
  }
};
