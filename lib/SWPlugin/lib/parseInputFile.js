const stripComments = require('./stripComments');
const injectAssetURLs = require('./injectPrecacheManifest');

/**
 * Read and parse the original service worker JavaScript file into a string so
 * webpack can emit.
 *
 * @param {Compiler} compiler - A webpack Compiler instance
 * @param {string} inputFilePath - Path to the original service worker
 * JavaScript file
 * @param {object[]} precacheManifest - An array of precache manifest objects.
 * Each object should have an 'url' key containing a built asset URL
 * @returns {Promise<string|Error>} - A promise that resolves to the string
 * representation of the original service worker JavaScript file
 * */
function parseInputFile(compiler, inputFilePath, precacheManifest) {
  // The function used to read the original service worker JavaScript file is
  // set to webpack's readFile. This is to ensure compatibility with webpack
  // dev server's in-memory file system.
  const readFileFn = compiler.inputFileSystem.readFile.bind(
    compiler.inputFileSystem,
  );

  return new Promise((resolve, reject) => {
    readFileFn(inputFilePath, (err, content) => {
      if (err) {
        reject(err);
      }

      const parsedContent = injectAssetURLs(
        stripComments(content.toString()),
        precacheManifest,
      );

      resolve(parsedContent);
    });
  });
}

module.exports = parseInputFile;
