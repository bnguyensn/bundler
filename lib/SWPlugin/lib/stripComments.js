/**
 * Strip JavaScript comments from a given string
 *
 * @param {string} text - A string
 * @returns {string} - The given string, but with all JavaScript comments stripped out
 * */
function stripComments(text) {
  const regex = /\/\*(\s|\S)*?\*\/|\/\/.*?[\n|\r]|(\n+?|\r+?)/g;

  return text.replace(regex, '');
}

module.exports = stripComments;
