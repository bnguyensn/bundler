const { task, series, argv } = require('just-task');
const {
  initTask,
  devTask,
  cleanUpTask,
  buildTask,
  testTask,
} = require('./lib/tasks');
const generateConfig = require('./lib/generateConfig');

const { webpackMode, srcPath } = argv();
const config = generateConfig(webpackMode, srcPath);

// ********** Task definitions! ********** //

task('init', initTask());

task('dev', devTask(config));

task('cleanUp', cleanUpTask(config));

task('build', buildTask(config));

task('prod', series('cleanUp', 'build'));

task('test', testTask());
