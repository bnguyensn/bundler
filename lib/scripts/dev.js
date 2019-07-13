const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigFn = require('../../configs/webpack.config');
const log = require('../log');

function webpackCompilationPromise(compiler) {
  return new Promise((resolve, reject) => {
    compiler.hooks.done.tap('DoSomethingWhenDone', stats => resolve(stats));
    compiler.hooks.failed.tap('DoSomethingWhenFailed', err => reject(err));
  });
}

function webpackDevServerPromise(server, config) {
  return new Promise((resolve, reject) => {
    server.listen(config.webpackDevServerPort, '127.0.0.1', err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = async function runDev(config) {
  log.info('Initiating development mode 🛠...');

  let webpackConfig, webpackDevServerConfig, compiler, server;

  // ========== 1. Load config files ========== //

  log.info('Loading config files 🛠...');

  try {
    webpackConfig = webpackConfigFn(config);
    webpackDevServerConfig = Object.assign({}, webpackConfig.devServer);
  } catch (err) {
    const errMsg =
      'Error encountered when loading config files: ' + err.message;
    log.error(errMsg);
    throw new Error(errMsg);
  }

  // ========== 2. Start the dev server ========== //

  log.info('Starting webpack-dev-server 🛠...');

  try {
    compiler = webpack(webpackConfig);
    server = new WebpackDevServer(compiler, webpackDevServerConfig);

    await Promise.all([
      webpackCompilationPromise(compiler),
      webpackDevServerPromise(server, config),
    ]);

    log.info(
      'Started webpack-dev-server on ' +
      `http://localhost:${config.webpackDevServerPort}`,
    );
  } catch (err) {
    const errMsg =
      'Error encountered when starting webpack-dev-server: ' + err.message;
    log.error(errMsg);
    throw new Error(errMsg);
  }
};
