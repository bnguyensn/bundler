const path = require('path');
const fs = require('fs');
const stripComments = require('../lib/stripComments');

const stripCommentsTestResult = `function abc() {  }`;

describe('SWPlugin tests should pass', () => {
  test('stripComments() works as intended', () => {
    const testFilePath = path.resolve(__dirname, 'stripCommentsTestFile.js');

    const read = new Promise((resolve, reject) => {
      fs.readFile(testFilePath, 'utf8', (err, content) => {
        if (err) reject(err);

        resolve(stripComments(content));
      });
    });

    return read.then(content => expect(content).toBe(stripCommentsTestResult));
  });
});
