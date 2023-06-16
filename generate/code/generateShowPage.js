const ejs = require('ejs');
const path = require('path');
const pluralize = require('pluralize');
const { toCamelCase, toPascalCase } = require('../../utils');

function generateShowPage(singularModelName, pluralModelName) {
  const pascalSingularModelName = toPascalCase(singularModelName);
  const pascalPluralModelName = pluralize(pascalSingularModelName);
  const camelCaseSingularModelName = toCamelCase(singularModelName);

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/showPage.ejs'),
      {
        singularModelName,
        pluralModelName,
        pascalSingularModelName,
        camelCaseSingularModelName,
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

module.exports = generateShowPage;
