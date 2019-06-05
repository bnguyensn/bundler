/**
 * Generate a webpack asset. Under the hood this adds a key-value pair to
 * webpack's compilation.assets object, with key being the path to the asset
 * and value being an object with shape:
 * {
 *   source: () => string; // Stringified content of the asset
 *   size: () => number; // Length of the stringified content of the asset
 * }
 *
 * @param {Compilation} compilation - The webpack compilation instance
 * @param {string} assetPath - Path of the asset, including its name and
 * extension
 * @param {string} content - Stringified content of the asset
 * */
function generateAsset(compilation, assetPath, content) {
  compilation.assets[assetPath] = {
    source: () => content,
    size: () => content.length,
  };
}

module.exports = generateAsset;
