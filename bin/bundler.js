#!/usr/bin/env node

const path = require('path');
const dirname = path.resolve(process.cwd());
const userConfig = require(path.resolve(dirname, 'package.json'))[
  '@bnguyensn/bundler'
];
const shell = require('shelljs');
const chalk = require('chalk');
const mode = process.argv[2];
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigFn = require('../index');

const generalConfig = {
  // Not configurable via package.json
  dirname,
  mode: mode === 'prod' ? 'production' : 'development',
  url_loader_size_limit: 1024 * 10, // 10kb

  // Configurable via package.json
  entry_index: userConfig.entry || 'src/index.js',
  output_html_template_dev_path:
    userConfig.html_template_dev || 'src/html-templates',
  output_html_template_prod_path:
    userConfig.html_template_prod || 'src/html-templates/index_prod.html',
  dev_server_port: userConfig.dev_server_port || 8080,
};

const webpackConfig = webpackConfigFn(generalConfig);

console.log('');
console.log(chalk.blue('Running bundler...'));
console.log(`Mode: ${chalk.blue(mode)}`);
console.log(`Current directory: ${chalk.blue(dirname)}`);
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
  shell.rm('-rf', path.resolve(generalConfig.dirname, 'dist'));
  shell.rm('-rf', path.resolve(generalConfig.dirname, 'webpackRecords.json'));

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

  server.listen(generalConfig.dev_server_port, '127.0.0.1', () => {
    console.log(
      chalk.greenBright(`Starting webpack-dev-server on http://localhost:8080`),
    );
  });
}
