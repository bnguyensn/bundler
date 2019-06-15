const path = require('path');
const fs = require('fs');
const stripComments = require('../lib/stripComments');

const stripCommentsTestResult = `function abc() {  }`;

describe('SWPlugin test', () => {
  test('stripComments() strips all JavaScript comments', () => {
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
