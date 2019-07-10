const { logger } = require('just-task');

module.exports = function initTask() {
  return () => {
    logger.info('Started the build process');
  };
};
