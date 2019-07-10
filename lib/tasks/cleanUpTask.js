const path = require('path');
const shell = require('shelljs');
const { logger } = require('just-task');

module.exports = function cleanUpTask(config) {
  return () => {
    logger.info('Removing previously-generated build files and folders...');
    try {
      /*
       * The output directory structure is:
       * dist
       * |--index.html
       * |--static
       * |  |--// built assets...
       * webpackRecords.json
       *
       * The commands below remove the top-level 'dist' folder as well as the
       * webpackRecords.json before every production build. These paths are based on
       * configurations in webpackConfig. If you change webpackConfig paths, you
       * should change these removers as well.
       * */
      shell.rm('-rf', path.resolve(config.dirname, 'dist'));
      shell.rm('-rf', path.resolve(config.dirname, 'webpackRecords.json'));
    } catch (err) {
      throw new Error(
        `Error encountered when removing previous build folders: ${err}`,
      );
    }
  };
};
