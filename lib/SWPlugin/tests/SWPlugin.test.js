const rewire = require('rewire');
const path = require('path');

const m = rewire('../SWPlugin.js');

const getInputFolderPath = m.__get__('getInputFolderPath');

describe('getInputFolderPath() should parse various types of path correctly', () => {
  // Case 1: entry is a single path string
  const mockCompiler1 = {
    options: {
      entry: path.resolve(__dirname),
    },
  };

  // Case 2: entry is an object containing one or more path strings
  const mockCompiler2 = {
    options: {
      entry: {
        index1: path.resolve(__dirname),
        index2: path.resolve(__dirname, '..'),
      },
    },
  };

  // Case 3: entry is an array containing one or more path strings
  const mockCompiler3 = {
    options: {
      entry: [path.resolve(__dirname), path.resolve(__dirname, '..')],
    },
  };
});
