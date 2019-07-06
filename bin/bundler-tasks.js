#!/usr/bin/env node

// ======================================== //
// ========== SET UP ENVIRONMENT ========== //
// ======================================== //

// Core packages
const path = require('path');
const shell = require('shelljs');
const { task, series, parallel, logger, argv, option } = require('just-task');

// webpack
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigFn = require('../index');

// Runtime variables / user config variables specified via package.json
const userDirname = path.resolve(process.cwd());
const defaultUserConfig = require('../lib/defaultUserConfig/package.json');
const userConfig = Object.assign(
  defaultUserConfig,
  require(path.resolve(userDirname, 'package.json'))['@bnguyensn/bundler'] ||
    {},
);

// webpack mode (development or production)
const mode = argv()._[0];

const config = {
  // Not configurable via package.json
  dirname: userDirname,
  mode: mode === 'prod' ? 'production' : 'development',

  // Configurable via package.json
  entryPath: userConfig.entryPath,
  htmlWebpackPluginTemplatePath: userConfig.htmlWebpackPluginTemplatePath,
  htmlWebpackPluginFaviconPath: userConfig.htmlWebpackPluginFaviconPath,
  pwaManifestTemplate: userConfig.pwaManifestTemplatePath
    ? require(path.resolve(userDirname, userConfig.pwaManifestTemplatePath))
    : null,
  serviceWorkerFilePath: userConfig.serviceWorkerFilePath,
  webpackDevServerPort: userConfig.webpackDevServerPort,
  useTypeScript: userConfig.useTypeScript,
};

const webpackConfig = webpackConfigFn(config);

// ======================================= //
// ========== START THE PROGRAM ========== //
// ======================================= //

task('init', () => {
  logger.info('Started the build process');
});

task('cleanUp', () => {
  logger.info('Removing previous build folders');
  try {
    shell.rm('-rf', path.resolve(config.dirname, 'dist'));
    shell.rm('-rf', path.resolve(config.dirname, 'webpackRecords.json'));
  } catch (err) {
    throw new Error(
      `Error encountered when removing previous build folders: ${err}`,
    );
  }
});

task('dev', () => {
  logger.info('Starting the webpack development server');
  try {
  } catch (err) {
    throw new Error(
      `Error encountered when starting the webpack development server: ${err}`,
    );
  }
});

task('build', () => {
  logger.info('Building the application for production');
  try {
  } catch (err) {
    throw new Error(
      `Error encountered when building the application for production: ${err}`,
    );
  }
});
