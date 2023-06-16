const ejs = require('ejs');
const path = require('path');
const pluralize = require('pluralize');
const { toCamelCase, toPascalCase } = require('../../utils');

function generateNewPage(singularModelName, pluralModelName) {
  const pascalSingularModelName = toPascalCase(singularModelName);
  const pascalPluralModelName = pluralize(pascalSingularModelName);
  const camelCaseSingularModelName = toCamelCase(singularModelName);

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/newPage.ejs'),
      {
        singularModelName,
        pluralModelName,
        camelCaseSingularModelName,
        pascalSingularModelName,
        pascalPluralModelName,
      },
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

module.exports = generateNewPage;
