/**
 * const log = require('log');
 *
 * log.info()
 * log.warn()
 * log.error()
 */

const chalk = require('chalk');
const { EOL } = require('os');

const base = '@bnguyensn/bundler: ';

function logInfo(msg) {
  console.log(chalk.greenBright(base + msg));
}

function logInfoEOL(msg) {
  console.log(chalk.greenBright(base + msg) + EOL);
}

function logWarn(msg) {
  console.log(chalk.yellowBright(base + msg));
}

function logWarnEOL(msg) {
  console.log(chalk.yellowBright(base + msg) + EOL);
}

function logError(msg) {
  console.log(chalk.redBright(base + msg));
}

function logErrorEOL(msg) {
  console.log(chalk.redBright(base + msg) + EOL);
}

module.exports = {
  info: logInfo,
  infoEOL: logInfoEOL,
  warn: logWarn,
  warnEOL: logWarnEOL,
  error: logError,
  errorEOL: logErrorEOL,
};
