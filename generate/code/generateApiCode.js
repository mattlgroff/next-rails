const ejs = require('ejs');
const path = require('path');

async function generateApiCode(singularModelName, pluralModelName) {
  const data = {
    singularModelName,
    pluralModelName,
    capitalizedSingularModelName: singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1),
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/apiCode.ejs'),
      data,
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

module.exports = generateApiCode;