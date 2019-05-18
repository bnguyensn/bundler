#!/usr/bin/env node

const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const mode = process.argv[2];
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigFn = require('../config');

console.log(`Current directory: ${process.cwd()}`);
console.log(`Mode: ${mode}`);
console.log('**********');

const config = {
  dirname: path.resolve(process.cwd()),
  mode: mode === 'prod' ? 'production' : 'development',
  ENTRY_PATH: 'src/index.js',
  PROD_PATH: 'dist',
  PROD_ASSETS_PATH: 'dist/static',
  URL_LOADER_SIZE_LIMIT: 1024 * 10, // 10kb
  HTML_TEMPLATE_DEV_PATH: 'src/html-templates',
  HTML_TEMPLATE_PROD_PATH: 'src/html-templates/index_prod.html',
  DEV_SERVER_PORT: 8080,
};

const webpackConfig = webpackConfigFn(config);

const compiler = webpack(webpackConfig);

if (mode === 'prod') {
  shell.rm('-rf', path.resolve(config.dirname, config.PROD_PATH));

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

  server.listen(config.DEV_SERVER_PORT, '127.0.0.1', () => {
    console.log(
      chalk.greenBright(`Starting webpack-dev-server on http://localhost:8080`),
    );
  });
}
