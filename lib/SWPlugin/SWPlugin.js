const path = require('path');
const getEntryDir = require('./lib/getEntryDir');
const parseInputFile = require('./lib/parseInputFile');
const generateAsset = require('./lib/generateAsset');

function SWPlugin(options) {
  this.options = Object.assign(
    {
      inputFileDir: '',
      inputFileName: 'service-worker.js',
      outputFilePath: 'service-worker.js',
    },
    options || {},
  );
}

SWPlugin.prototype.apply = function(compiler) {
  const webpackEntry = compiler.options.entry;

  const inputFilePath = this.options.inputFileDir
    ? path.join(this.options.inputFileDir, this.options.inputFileName)
    : path.resolve(getEntryDir(webpackEntry), this.options.inputFileName);

  const outputFilePath = this.options.outputFilePath;

  // The emit hook is executed right before emitting assets to the output
  // directory.
  // https://webpack.js.org/api/compiler-hooks#emit
  compiler.hooks.emit.tapPromise('SWPlugin', compilation => {
    // ========================= //
    // OBTAIN BUILT ASSETS' URLS //
    // ========================= //

    // stats is an object containing build data
    // https://webpack.js.org/api/stats#structure
    const stats = compilation.getStats().toJson();

    // assets is an array of built asset objects.
    // With this, we now have the URLs of all built assets.
    // https://webpack.js.org/api/stats#asset-objects
    const assetURLs = stats.assets.map(asset => asset.name);

    // =============== //
    // FILE GENERATION //
    // =============== //

    // Generate the service worker JavaScript file and put it next to index.html
    // in the output directory.

    return new Promise((resolve, reject) => {
      parseInputFile(compiler, inputFilePath).then(
        fileContent => {
          generateAsset(compilation, outputFilePath, fileContent);
          resolve();
        },
        err => {
          reject(err);
        },
      );
    });
  });
};

module.exports = SWPlugin;
