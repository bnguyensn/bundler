const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigFn = require('../../configs/webpack.config');
const log = require('../log');

module.exports = function runDev(config) {
  log.info('Initiating development mode...');

  let webpackConfig, webpackDevServerConfig, compiler, server;

  log.info('Loading config files...');
  try {
    webpackConfig = webpackConfigFn(config);
    webpackDevServerConfig = Object.assign({}, webpackConfig.devServer);
  } catch (err) {
    const errMsg =
      'Error encountered when loading config files: ' + err.message;
    log.error(errMsg);
    throw new Error(errMsg);
  }

  log.info('Starting webpack-dev-server...');
  try {
    compiler = webpack(webpackConfig);
    server = new WebpackDevServer(compiler, webpackDevServerConfig);
  } catch (err) {
    const errMsg =
      'Error encountered when starting webpack-dev-server: ' + err.message;
    log.error(errMsg);
    throw new Error(errMsg);
  }

  try {
    server.listen(config.webpackDevServerPort, '127.0.0.1', () => {
      log.info(
        'Started webpack-dev-server on ' +
          `http://localhost:${config.webpackDevServerPort}`,
      );
    });
  } catch (err) {
    const errMsg =
      'Error encountered when webpack-dev-server tried to ' +
      ` listen on port ${config.webpackDevServerPort}`;
    log.error(errMsg);
    throw new Error(errMsg);
  }
};
