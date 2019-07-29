const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const webpackConfigFn = require('../../configs/webpack.config');
const log = require('../log');

function runCleanUp(config) {
  log.info('Removing previously-generated build files and folders...');

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
     * webpackRecords.json before every production build. These paths are based
     * on configurations in webpackConfig. If you change webpackConfig paths,
     * you should change these removers as well.
     */
    shell.rm('-rf', path.resolve(config.dirname, 'dist'));
    shell.rm('-rf', path.resolve(config.dirname, 'webpackRecords.json'));
  } catch (err) {
    const errMsg =
      'Error encountered when removing previous build folders: ' + err;
    log.error(errMsg);
    throw new Error(errMsg);
  }
}

function webpackCompilationPromise(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

async function runWebpackProdBuild(config) {
  log.info('Initiating production build 🚀...');

  let webpackConfig, compiler;

  log.info('Loading config files 🚀...');
  try {
    webpackConfig = webpackConfigFn(config);
  } catch (err) {
    const errMsg =
      'Error encountered when loading config files: ' + err.message;
    log.error(errMsg);
    throw new Error(errMsg);
  }

  log.info('Bundling assets 🚀...');
  try {
    compiler = webpack(webpackConfig);
    const compilerStats = await webpackCompilationPromise(compiler);

    if (compilerStats instanceof Error) {
      throw compilerStats;
    }

    if (compilerStats.hasErrors()) {
      throw compilerStats.toString({
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
      });
    }

    log.info('All assets bundled! Details:');
    console.log(compilerStats.toString({ colors: true }));
  } catch (err) {
    const errMsg =
      'Error encountered when bundling assets: ' +
      (err.stack || err) +
      err.details;
    log.error(errMsg);
    throw new Error(errMsg);
  }
}

module.exports = async function runProd(config) {
  runCleanUp(config);
  await runWebpackProdBuild(config);
};
