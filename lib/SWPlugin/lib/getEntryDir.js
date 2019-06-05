const path = require('path');

/**
 * Obtain the path of the entry file (or files for multi-page applications).
 * This lets us know where the original service worker JavaScript file is,
 * assuming it
 *
 * @param {string | Object | string[]} entry - The webpack compiler instance
 * @returns {string} - The absolute path to the webpack entry directory
 * */
function getEntryDir(entry) {
  // Entry can be a single path string. This is the most straightforward case
  if (typeof entry === 'string') {
    return path.resolve(entry, '..');
  }

  // Entry can also be an object containing one or more path strings. The first
  // path string is used to determine the input folder path
  if (typeof entry === 'object') {
    const entries = Object.values(entry);

    return path.resolve(entries[0], '..');
  }

  // If entry is an array, the first entry file is used to determine the input
  // folder path.
  if (Array.isArray(entry)) {
    return path.resolve(entry[0], '..');
  }
}

module.exports = getEntryDir;
