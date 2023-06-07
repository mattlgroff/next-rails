const ejs = require('ejs');
const path = require('path');
const { typeMapping } = require('../../constants');

function generateMigrationCode(pluralModelName, options) {
  const hasVector = options.some((option) => option.split(':')[1] === 'vector');

  let extensionsToInstall = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';
  if (hasVector) {
    extensionsToInstall = `${extensionsToInstall} CREATE EXTENSION IF NOT EXISTS "vector";`;
  }

  const data = {
    pluralModelName,
    options,
    typeMapping,
    extensionsToInstall,
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve(__dirname, './templates/migrationCode.ejs'), data, {}, function (err, str) {
      if (err) reject(err);
      resolve(str);
    });
  });
}

module.exports = generateMigrationCode;
