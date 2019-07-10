const path = require('path');
const jest = require('jest');

module.exports = function testTask() {
  return () => {
    const jestConfigPath = path.resolve(
      __dirname,
      '../../configs/jest.config.js',
    );
    const jestConfig = require(jestConfigPath);

    jest.run([`--config=${JSON.stringify(jestConfig)}`]);
  };
};
