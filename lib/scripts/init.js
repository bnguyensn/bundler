const testScript = require('./test');
const devScript = require('./dev');
const prodScript = require('./prod');
const generateConfig = require('../generateConfig');
const log = require('../log');

module.exports = async function init(mode, srcPath) {
  switch (mode) {
    case 'test':
      // Initiate tests 🚨...
      await testScript();
      break;
    case 'dev':
      // Initiate dev webpack run 🛠️...
      devScript(generateConfig('development', srcPath));
      break;
    case 'prod':
      // Initiate prod webpack build 🚀...
      prodScript(generateConfig('development', srcPath));
      break;
    default:
      // Invalid command 🚫...
      log.error(
        `Invalid command '${mode}'. Only these commands are supported:`,
      );
      log.error('  test');
      log.error('  dev');
      log.error('  prod');
  }
};
