/**
 * Capitalizing string
 * @description Returns the same string but every first letter of every word is uppercase
 * @param {string} Sentence to convert
 * @returns {string} Capitalized sentence
 */
exports.capitalize = (str) => {
  if (typeof str !== 'string') return '';
  str = str.split(' ');

  for (var i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }

  return str.join(' ');
};
