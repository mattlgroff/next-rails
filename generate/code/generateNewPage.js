const ejs = require('ejs');
const path = require('path');

function generateNewPage(singularModelName, pluralModelName) {
  const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);
  const PascalSingularModelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);
  const PascalPluralModelName = pluralModelName.charAt(0).toUpperCase() + pluralModelName.slice(1);

  // Use a Promise to make the function asynchronous
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/newPage.ejs'),
      { singularModelName, pluralModelName, modelName, PascalPluralModelName, PascalSingularModelName },
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

module.exports = generateNewPage;
