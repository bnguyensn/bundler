const path = require('path');
const parseInputFile = require('./lib/parseInputFile');
const generateAsset = require('./lib/generateAsset');

function SWPlugin(options) {
  this.options = Object.assign(
    {
      serviceWorkerInputFilePath: '',
    },
    options || {},
  );
}

SWPlugin.prototype.apply = function(compiler) {
  const webpackOutputPublicPath = compiler.options.output.publicPath;
  const inputFilePath = this.options.serviceWorkerInputFilePath;
  const inputFilePathParsed = path.parse(inputFilePath);
  const outputFileName = `${inputFilePathParsed.name}${inputFilePathParsed.ext}`;
  const outputFilePath = path.join(webpackOutputPublicPath, outputFileName);

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
    const assetURLs = stats.assets.map(asset =>
      path.join(webpackOutputPublicPath, asset.name),
    );
    const precacheManifest = assetURLs.map(url => ({
      url,
    }));

    // =============== //
    // FILE GENERATION //
    // =============== //
    // Generate the service worker JavaScript file and put it next to index.html
    // in the output directory.

    return new Promise((resolve, reject) => {
      parseInputFile(compiler, inputFilePath, precacheManifest).then(
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
