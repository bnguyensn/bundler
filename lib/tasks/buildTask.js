const webpack = require('webpack');
const webpackConfigFn = require('../../configs/webpack.config');
const { logger } = require('just-task');

module.exports = function devTask(config) {
  return () => {
    logger.info('Initiating production build...');

    let webpackConfig, compiler;

    logger.info('Loading config files...');
    try {
      webpackConfig = webpackConfigFn(config);
    } catch (err) {
      throw new Error(
        'Error encountered when loading config files: ' + err.message,
      );
    }

    logger.info('Bundling assets...');
    try {
      compiler = webpack(webpackConfig);

      compiler.run((err, stats) => {
        if (err) {
          throw err;
        }

        logger.info(
          'All assets bundled. Details: ' + stats.toString({ colors: true }),
        );
      });
    } catch (err) {
      const errorMsg = (err.stack || err) + err.details;
      throw new Error('Error encountered when bundling assets: ' + errorMsg);
    }
  };
};
