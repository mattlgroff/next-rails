const ejs = require('ejs');
const path = require('path');

function generateEditPage(singularModelName, pluralModelName) {
  const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);
  const PascalSingularModelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/editPage.ejs'),
      { singularModelName, pluralModelName, modelName, PascalSingularModelName },
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

module.exports = generateEditPage;
