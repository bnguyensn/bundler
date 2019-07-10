const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigFn = require('../../configs/webpack.config');
const { logger } = require('just-task');

module.exports = function devTask(config) {
  return () => {
    logger.info('Initiating development mode...');

    let webpackConfig, webpackDevServerConfig, compiler, server;

    logger.info('Loading config files...');
    try {
      webpackConfig = webpackConfigFn(config);
      webpackDevServerConfig = Object.assign({}, webpackConfig.devServer);
    } catch (err) {
      throw new Error(
        'Error encountered when loading config files: ' + err.message,
      );
    }

    logger.info('Starting webpack-dev-server...');
    try {
      compiler = webpack(webpackConfig);
      server = new WebpackDevServer(compiler, webpackDevServerConfig);
    } catch (err) {
      throw new Error(
        'Error encountered when starting webpack-dev-server: ' + err.message,
      );
    }

    try {
      server.listen(config.webpackDevServerPort, '127.0.0.1', () => {
        logger.info(
          'Started webpack-dev-server on ' +
            `http://localhost:${config.webpackDevServerPort}`,
        );
      });
    } catch (err) {
      throw new Error(
        'Error encountered when webpack-dev-server tried to listen on port ' +
          config.webpackDevServerPort,
      );
    }
  };
};
