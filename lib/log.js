const chalk = require('chalk');

function logInfo(msg) {
  console.log(chalk.greenBright(msg));
}

function logWarn(msg) {
  console.log(chalk.yellowBright(msg));
}

function logError(msg) {
  console.log(chalk.redBright(msg));
}

module.exports = {
  info: logInfo,
  warn: logWarn,
  error: logError,
};
