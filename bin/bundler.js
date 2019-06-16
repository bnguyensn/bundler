#!/usr/bin/env node

// ======================================== //
// ========== SET UP ENVIRONMENT ========== //
// ======================================== //

// Core packages
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');

// webpack
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigFn = require('../index');

// User config variables specified via package.json
const userDirname = path.resolve(process.cwd());
const defaultUserConfig = require('../lib/defaultUserConfig/package.json');
const userConfig = Object.assign(
  defaultUserConfig,
  require(path.resolve(userDirname, 'package.json'))['@bnguyensn/bundler'] ||
    {},
);

// Mode (development or production)
const mode = process.argv[2];

const config = {
  // Not configurable via package.json
  dirname: userDirname,
  mode: mode === 'prod' ? 'production' : 'development',

  // Configurable via package.json
  entryPath: userConfig.entryPath,
  htmlWebpackPluginTemplatePath:
    userConfig.htmlWebpackPluginTemplatePath,
  htmlWebpackPluginFaviconPath: userConfig.htmlWebpackPluginFaviconPath,
  pwaManifestTemplate: userConfig.pwaManifestTemplatePath
    ? require(path.resolve(userDirname, userConfig.pwaManifestTemplatePath))
    : {},
  serviceWorkerFilePath: userConfig.serviceWorkerFilePath,
  webpackDevServerPort: userConfig.webpackDevServerPort,
};

const webpackConfig = webpackConfigFn(config);

// ======================================= //
// ========== START THE PROGRAM ========== //
// ======================================= //

console.log('');
console.log(chalk.blue('Running bundler...'));
console.log(`Mode: ${chalk.blue(mode)}`);
console.log(`Current directory: ${chalk.blue(userDirname)}`);
console.log('');

const compiler = webpack(webpackConfig);

if (mode === 'prod') {
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

  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    console.log(stats.toString({ colors: true }));
  });
} else {
  const webpackDevServerConfig = Object.assign({}, webpackConfig.devServer);

  const server = new WebpackDevServer(compiler, webpackDevServerConfig);

  server.listen(config.webpackDevServerPort, '127.0.0.1', () => {
    console.log(
      chalk.greenBright(
        `Starting webpack-dev-server on http://localhost:${config.webpackDevServerPort}`,
      ),
    );
  });
}
